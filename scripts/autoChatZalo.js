const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');

let options = new chrome.Options();
options.addArguments("--user-data-dir=C:\\Users\\Dell\\AppData\\Local\\Google\\Chrome\\User Data\\Default");

async function autoChatZalo(phoneNumbers, chatContent) {
    let driver = new Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chrome')
        .build();
    //open zalo with maximum size of browser window
    await driver.get('https://chat.zalo.me');
    driver.manage().window().maximize();
    await driver.sleep(5000);
    try {
        let logs = new Array(phoneNumbers.length);
        let findXpath = '//*[@id="contact-search-input"]';


        //Loop through every phone number
        for (let phoneNumber of phoneNumbers) {
            //Find the search contact box
            let search = await driver.wait(until.elementLocated(By.xpath(findXpath)));
            await driver.sleep(Math.floor(Math.random() * 1000 + 1000));

            // Clear current input
            await search.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
            await driver.sleep(Math.floor(Math.random() * 2000 + 1000));

            //input phone number
            await search.sendKeys(phoneNumber);
            await driver.sleep(Math.floor(Math.random() * 2000 + 8000));

            // 3 case when search for a phone number
            // Conversation found
            // No result found
            // No call info
            let conv = await driver.findElements(By.className('conv-item-title__name'));
            let noResult = await driver.findElements(By.className('global-search-no-result'));
            let noCallInfo = await driver.findElements(By.css('div[icon="outline-call-info"]'));
            console.log('Conv found: ' + conv.length);
            console.log(noResult.length > 0 ? 'No results found' : "");
            console.log(noCallInfo.length > 0 ? 'No call info' : "");
            // if conversation found and none of the rest case happen then we choose the first conversation found
            if (conv.length > 0 && (noResult.length === 0 && noCallInfo.length === 0)) {

                //Add log 
                logs.push('Conversation with ' + phoneNumber + ' found');

                // Enter key press to enter conversation
                await search.sendKeys(Key.ENTER);

                logs.push('Enter Chat');

                //find name of the receiver
                let name = await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/main/div/header/div[1]/div[2]/div[1]/div[1]/div'))).getText();

                //loop through list of message to send
                for (let content of chatContent) {

                    // wwait until the input message loccated , click on the input field and type message
                    await driver.sleep(Math.floor(Math.random() * 2000));
                    let inputMessage = await driver.wait(until.elementLocated(By.id('richInput')));
                    await inputMessage.click();
                    await inputMessage.sendKeys(content);
                    logs.push(`\'${content}\' sent to <strong class="fw-bold">${name}</strong>`);
                    await driver.sleep(Math.floor(Math.random() * 1000 + 1000));

                    //Click button to send message
                    await driver.wait(until.elementLocated(By.xpath('//*[@id="chatInputv2"]/div/div/div[2]/div[5]'))).click();
                    await driver.sleep(Math.floor(Math.random() * 4000 + 1000));
                    let lastestResponse = await driver.findElements(By.css('div[data-id="div_LastReceivedMsg_Text"] div span[id*="mtc-"]'));
                    if (lastestResponse.length > 0) {
                        let sendTime = await driver.findElements(By.css('div[data-id="div_LastReceivedMsg_Text"] div .card-send-time'));
                        logs.push(`<strong class="fst-italic fw-bold">"${await lastestResponse[0].getText()}"</strong> sent by <strong class="fw-bold">${name}</strong> at <strong class="fst-italic fw-bold">${await sendTime[0].getText()}</strong>`);
                    } else {
                        logs.push(`No response from <strong class="fw-bold">${name}</strong> for message you 've sent`);
                    }
                }
                // reload after each number
                await driver.navigate().to(driver.getCurrentUrl());
                logs.push('Chat conversation ended with ' + name);
            } else {
                // console.log('No conversation found for phone number: ' + phoneNumber);
                logs.push('No conversation found for phone number: ' + phoneNumber);
                logs.push('*****************************************************************');
                continue;
            }
            logs.push('*****************************************************************');
        }
        console.log(logs.join('\n'));
        return logs;

    } catch (error) {
        console.log(error);
    } finally {
        await driver.close();

    }
}

module.exports = { autoChatZalo }