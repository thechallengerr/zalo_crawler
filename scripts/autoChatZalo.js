const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');

async function autoChatZalo(phoneNumbers, chatContent) {
    let driver = new Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chrome')
        .build()
        ;
    //open zalo with maximum size of browser window
    await driver.get('https://chat.zalo.me');
    driver.manage().window().maximize();
    await driver.sleep(5000);
    try {
        let logs = new Array(phoneNumbers.length);
        let findXpath = '//*[@id="contact-search-input"]';
        let inputMessageXpath = '/html/body/div/div/div[2]/main/div/article/div[4]/div[3]/div/div/div/div/div[1]';
        let i = 0;
        for (let phoneNumber of phoneNumbers) {
            let search = await driver.wait(until.elementLocated(By.xpath(findXpath)));
            // phoneNumbers.indexOf()
            // await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/nav/div[2]/div[3]/div/div[2]/div/div/div[1]/div/div[1]/div/div/div[2]')));
            // let contact = await driver.wait(until.elementLocated(By.xpath('//*[@id="main-tab"]/div[1]/div[2]/div[2]')));
            // await contact.click();
            await driver.sleep(Math.floor(Math.random() * 1000 + 1000));
            await search.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
            await driver.sleep(Math.floor(Math.random() * 2000 + 1000));
            await search.sendKeys(phoneNumber);
            await driver.sleep(Math.floor(Math.random() * 2000 + 8000));
            // if (await driver.wait(until.elementLocated(By.className('global-search-no-result')))) {
            //     logs.push('No conversation found for phone number: ' + phoneNumber);
            //     continue;
            // }
            let conv = await driver.findElements(By.className('conv-item-title__name'));
            let noResult = await driver.findElements(By.className('global-search-no-result'));
            let noCallInfo = await driver.findElements(By.css('div[icon="outline-call-info"]'));
            console.log('Conv found: ' + conv.length);
            console.log(noResult.length > 0 ? 'No results found' : "");
            console.log(noCallInfo.length > 0 ? 'No call info' : "");

            if (conv.length > 0 && (noResult.length === 0 && noCallInfo.length === 0)) {

                // console.log('Conversation with ' + phoneNumber + ' found');
                logs.push('Conversation with ' + phoneNumber + ' found');
                // await driver.wait(until.elementIsVisible(By.className('conv-item-title__name'))).click();
                await search.sendKeys(Key.ENTER);
                // console.log('Enter Chat');

                logs.push('Enter Chat');
                let name = await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/main/div/header/div[1]/div[2]/div[1]/div[1]/div'))).getText();
                for (let content of chatContent) {
                    await driver.sleep(Math.floor(Math.random() * 2000));
                    let inputMessage = await driver.wait(until.elementLocated(By.id('richInput')));

                    await inputMessage.click();
                    await inputMessage.sendKeys(content);
                    // console.log(`\'${content}\' sent to ${name}`);

                    logs.push(`\'${content}\' sent to <strong class="fw-bold">${name}</strong>`);
                    await driver.sleep(Math.floor(Math.random() * 1000 + 1000));
                    await driver.wait(until.elementLocated(By.xpath('//*[@id="chatInputv2"]/div/div/div[2]/div[5]'))).click();
                    await driver.sleep(Math.floor(Math.random() * 1000 + 1000));
                }
                // console.log('Chat conversation ended with ' + name);
                await driver.navigate().to(driver.getCurrentUrl());
                logs.push('Chat conversation ended with ' + name);
            } else {
                // console.log('No conversation found for phone number: ' + phoneNumber);
                logs.push('No conversation found for phone number: ' + phoneNumber);
                logs.push('*****************************************************************');
                continue;
            }
            logs.push('*****************************************************************');
            i++;
        }
        console.log(logs.join('\n'));
        return logs;

    } catch (error) {
        console.log(error);
    } finally {
        await driver.close();

    }
}

var testChat = ['Trấn tuấn mãi đỉnh', "Trấn tuấn mãi đỉnh :))", 'Trấn tuấn mãi đỉnh', 'Trấn tuấn mãi đỉnh?', 'Trấn tuấn mãi đỉnh?', 'Yes, I do'];
// autoChatZalo('0818320988', testChat).catch(function (err) { console.error(err); });

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { autoChatZalo }