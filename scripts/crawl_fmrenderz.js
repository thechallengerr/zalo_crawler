const { Builder, By, Key, until, JavascriptExecutor, logging } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome')
const csvReader = require('csv-parser');
const fs = require('fs');
const path = require('path');


async function getEventsData(driver) {
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div/div[3]/div[5]/div/div/div[3]/div[2]/div[1]/div/section/h3/a'))).click();
}
async function getData() {
    let driver = new Builder().forBrowser('chrome').build();
    await driver.get('https://fifarenderz.com');
    await driver.manage().window().maximize();
    getEventsData(driver);
}


getData();