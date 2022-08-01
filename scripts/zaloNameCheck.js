const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { elementLocated } = require('selenium-webdriver/lib/until');


// read data from csv file

function readData(filename, data) {
    let i = 1;
    try {
        fs.createReadStream(filename)
            .pipe(csvParser())
            .on('data', function (row) {
                // console.log(row.phone + '\t' + row.name);
                data.push({
                    index: i++,
                    phone: row.phone,
                    name: row.name,
                    zaloName: row.name,
                });
                // console.log(data);
            })
            .on('end', function () {
                console.log('File read successfully ');
            });
        return data;
    } catch (error) {
        console.log(error);
    }
}

function writeCsv(data) {
    const csvWriter = createCsvWriter({
        path: `data/contacts/contactsE.csv`,
        header: [
            { id: "index", title: "index" },
            { id: "phone", title: "phone" },
            { id: "name", title: "name" },
            { id: "zaloName", title: "zaloName" },
        ],
    });

    csvWriter
        .writeRecords(data)
        .then(() => console.log("The CSV file was written successfully"));
}

async function clear(driver, elm) {
    // await driver.executeScript(e => e.select(), elm);
    // await elm.sendKeys(Key.BACK_SPACE);
    await driver.executeScript("arguments[0].value = '';", elm)
}
// main process
async function zaloNameCheck(data) {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://chat.zalo.me/');
    await driver.manage().window().maximize();
    data = [];
    data = readData('./data/contacts/contacts.csv', data);

    try {

        if (data.length === 0) {
            console.log('No phones found');
        }
        let findXpath = '//*[@id="contact-search-input"]';

        let search = await driver.wait(until.elementLocated(By.xpath(findXpath)));
        for (let elm of data) {
            await clear(driver, search);
            await driver.sleep(1000);

            await search.sendKeys(elm.phone);
            await driver.sleep(10000);
            let conv = await driver.findElements(By.className('conv-item-title__name'));

            if (conv.length > 0) {
                console.log('check check');
                elm.zaloName = await driver.wait(until.elementLocated(By.className('conv-item-title__name'))).getText();
                // await clear(driver, search);
                console.log('clear');
            } else {
                continue;
            }


        }
        writeCsv(data);

        // console.log(data);
        return data;
    } catch (errors) {
        console.log(errors);

    } finally {
        await driver.close(until);
    }
}


// zaloNameCheck().then().catch(function (err) { console.error(err); });
module.exports = { zaloNameCheck }