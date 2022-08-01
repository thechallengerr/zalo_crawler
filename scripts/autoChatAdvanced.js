const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');


//login with default user 
let options = new chrome.Options(
);
// options.addArguments("user-data-dir=C:/Users/Dell/AppData/Local/Google/Chrome/User Data")


async function autoChat(phoneNumber, chatContent) {
    let driver = new Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chrome')
        // .setChromeOptions(options) 
        .build()
        ;
    //open zalo with maximum size of browser window
    await driver.get('https://chat.zalo.me');
    driver.manage().window().maximize();
    setTimeout(async function () {
        try {
            let findXpath = '//*[@id="contact-search-input"]';
            let inputMessageXpath = '//*[@id="richInput"]';

            let search = await driver.wait(until.elementLocated(By.xpath(findXpath)));
            await search.sendKeys(phoneNumber);
            await search.sendKeys(Key.ENTER);
            console.log('Enter Key PRESSED');
            await driver.wait(until.elementLocated(By.className('conv-item conv-rel'))).click();
            console.log('appeared and clicked');


            for (let content of chatContent) {
                
                let inputMessage = await driver.wait(until.elementLocated(By.xpath(inputMessageXpath)));
                await inputMessage.sendKeys(content, Key.ENTER);
                // setTimeout(async function() {
                // },3000)
            }


        } catch (error) {
            console.log(error);
        }
    }, 15000)
}

var testChat = ['Hello , would you like to chat ?','OK let \'s chat :))','What is your name, please?','How old are you?', 'How are you doing ?','Yes, I do'];
autoChat('0328025026', testChat).catch(function (err) { console.error(err); });

