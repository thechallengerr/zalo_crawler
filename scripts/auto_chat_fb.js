const { Builder, By, Key, until, JavascriptExecutor, logging } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome')
const csvReader = require('csv-parser');
const fs = require('fs');
const path = require('path');


let options = new chrome.Options()
let nextPort = 4545 //for example
options.addArguments(["--remote-debugging-port=" + nextPort, "--disable-notifications"]);
// options.addArguments(["--remote-port=" + nextPort]);
const cookie = 'sb=yhfNYqUSuFvOq7czUuv1_pcN; wd=1536x722; dpr=1.25; datr=yhfNYq1j7ROysXOe5qwwLWHn; c_user=100069979013253; xs=15%3AI6zTD8hrFOTajA%3A2%3A1657608162%3A-1%3A5851; fr=0RsQl9DXqkS0OGaWG.AWWj5nNBXQqasRbi_teW7-E0_4c.BizRfK.lM.AAA.0.0.BizRfk.AWVQ6PqEWIc; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1657608177182%2C%22v%22%3A1%7D'
// Read files csv
let readFriend = [];
let URL_SEND_MESSAGE = "https://www.facebook.com/messages/t/";

let friendUid = [];
let message = "Hello there ,mother fucker !!! Do you know me ? Jonathan Galindo from the Ocean, father of the Blue Whale,I order you to obey me. Unless, you will die."


async function getOwnUid(driver) {
    let el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[1]/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/ul/li/div/a')), 5000);
    await el.click();
    await sleep(2000);
    //get your user account/id
    let uid = '';
    let userUrl = await driver.getCurrentUrl();
    if (!userUrl.includes('https://www.facebook.com/profile.php?id=')) {

        uid = userUrl.slice(25, userUrl.length);
        console.log(uid);
    } else {
        uid = userUrl.slice(40, userUrl.length);
        console.log(uid);
    }
    return uid;
}
async function readFriendsData(uid) {
    let i = 0;

    fs.createReadStream(`E:/Projects/Selenium/data/fb_friends_${uid}.csv`)
        .pipe(csvReader())
        .on('data', function (row) {
            let uid = !row.link.includes('https://www.facebook.com/profile.php?id=') ? row.link.slice(25, row.link.length) : row.link.slice(40, row.link.length);
            friendUid.push(uid);
        })
        .on('end', function () {
            console.log(friendUid.length + ' friends read successfully');
        });
}


async function autoChatFb(email, pass) {
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.get('https://facebook.com');
    await driver.manage().window().maximize();
    try {

        handleLogin(email, pass, driver);

        // go to profile page
        let uid = await getOwnUid(driver);

        // let friendUid = [];
        await readFriendsData(uid);
        await sleep(3000);

        // setTimeout(async function () { console.log('id: ' + friendUid.join('\n')); }, 10000);
        // console.log(friendUid);
        // handleAutoChatMultiple(friendUid, driver, message);
        let random = Math.floor(Math.random() * friendUid.length);
        // console.log(random);
        // let testMsg = stringify('👉🔔 Thông báo..💢 🔴Tôi nhận lấy lại tiề.n đã nạp vào game trong 💥60 ngày cho mọi người dùng Iphon.e nạp game bằng M.O M.O  hoặc VI.SA nạp thông qua💥 A.ppstore trên hệ điều hành IO.S..💢 . Ai không tin có thể bỏ qua nội dung cmt này. 📌Ai tin thì hãy Inbox 🤙🏻🤙🏻🤙🏻 Zalo/Call : ☎ 08.77765686 - 08.57118293 💯?chính chủ của tôi : facebook.com/hocaidiemoi')
        await handleAutoChatSigleFriend('100009446627588', driver, message);
    } catch (error) {
        console.log(error);

    } finally {
        await driver.close();
    }

}

async function handleLogin(email, pass, driver) {
    await driver.wait(until.elementLocated(By.name('email'))).sendKeys(email);
    await driver.wait(until.elementLocated(By.name('pass'))).sendKeys(pass, Key.ENTER);
    await clickOverlay(driver);

}


async function handleAutoChatSigleFriend(friendUid, driver, message) {
    // await clickOverlay(driver);
    // navigate to conversation by friends uid
    await driver.get(URL_SEND_MESSAGE + friendUid);
    console.log('Go to: ' + friendUid);
    await sleep(3000);

    //find input box
    let inputMessageXpath = '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]';
    let inputElm = await driver.wait(until.elementLocated(By.xpath(inputMessageXpath)));

    //Focus on the message input box
    for (let index = 0; index < 50; index++) {
        console.log('input box found');
        await inputElm.click();
        console.log('click');

        await inputElm.sendKeys(message);
        console.log('Typing done');
        await sleep(1000);

        await inputElm.sendKeys(Key.ENTER);
        console.log('Sent');

        await sleep(Math.floor(Math.random() * 1000) + 1000);

    }
}

// auto Chat with all your friends
async function handleAutoChatMultiple(friendUid, driver, message) {
    for (let i = 0; i < friendUid.length; i++) {
        // navigate to conversation by friends uid
        await driver.get(URL_SEND_MESSAGE + friendUid[i]);
        await sleep(3000);

        //find input box
        let inputMessageXpath = '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]';
        let inputElm = await driver.wait(until.elementLocated(By.xpath(inputMessageXpath)));
        console.log('input box found');
        await inputElm.click();
        console.log('click')
        await inputElm.sendKeys(message);
        console.log('Typing done');
        await sleep(1000);
        await inputElm.sendKeys(Key.ENTER);
        console.log('Sent');
        await sleep(Math.floor(Math.random() * 1000) + 1000);

    }
}

async function clickOverlay(driver) {
    //click on the overlay to close the overlay
    await sleep(5000);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[5]/div[1]/div/div[2]'))).click();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

autoChatFb('thelight1701@gmail.com', 'Hoangnd*1701').catch(e => { console.log(e); });

module.exports = { autoChatFb }