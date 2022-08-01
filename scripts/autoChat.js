const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');


//login with default user 
let options = new chrome.Options(
);
// options.addArguments("user-data-dir=C:/Users/Dell/AppData/Local/Google/Chrome/User Data")


async function autoChatZalo(phoneNumber, chatContent) {
    let driver = new Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chrome')
        .build()
        ;
    //open zalo with maximum size of browser window
    await driver.get('https://chat.zalo.me');
    driver.manage().window().maximize();
    sleep(13000);
    try {
        let findXpath = '//*[@id="contact-search-input"]';
        let inputMessageXpath = '/html/body/div/div/div[2]/main/div/article/div[4]/div[3]/div/div/div/div/div[1]';


        await search.sendKeys(phoneNumber);
        await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/nav/div[2]/div[3]/div/div[2]/div/div/div[1]/div/div[1]/div/div/div[2]')));
        await sleep(5000);
        await search.sendKeys(Key.ENTER);

        console.log('Enter Key PRESSED');
        sleep(5000);
        // await driver.wait(until.elementLocated(By.className('conv-item conv-rel'))).click();
        // console.log('appeared and clicked');

        for (let content of chatContent) {
            // sleep(5000)
            // driver.sleep(3000);
            let inputMessage = await driver.wait(until.elementLocated(By.id('richInput')));

            await inputMessage.click();
            console.log('click ' + content);
            // await driver.wait(inputMessage.getAttribute('contenteditable') === 'true');
            await inputMessage.sendKeys(content);
            await sleep(1000);

            await driver.wait(until.elementLocated(By.xpath('//*[@id="chatInputv2"]/div/div/div[2]/div[5]'))).click();

            // await inputMessage.sendKeys(Key.ENTER);
            // console.log('enter ' + content);

            await sleep(2000);
            // sleep(2000);
        }
        driver.close();

    } catch (error) {
        console.log(error);
    }
}

var testChat = ['Trấn tuấn mãi đỉnh', "Trấn tuấn mãi đỉnh :))", 'Trấn tuấn mãi đỉnh', 'Trấn tuấn mãi đỉnh?', 'Trấn tuấn mãi đỉnh?', 'Yes, I do'];
autoChatZalo('0818320988', testChat).catch(function (err) { console.error(err); });

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { autoChatZalo }