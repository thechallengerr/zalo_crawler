const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { elementLocated } = require('selenium-webdriver/lib/until');
const path = require('path');

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
                    phone: row.phone.startsWith('84') ? row.phone.slice(2, row.phone.length) : row.phone,
                    name: row.name,
                    zaloName: 'Not Registered/Checked',
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
    // if (!fs.existsSync(path.resolve(__dirname, `../data/contacts`))) {
    //     fs.mkdir(path.resolve(__dirname, `../data/contacts`), { recursive: true }, err => { });
    // }
    const csvWriter = createCsvWriter({
        path: `data/contacts/zaloName.csv`,
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
            await driver.sleep(2000);
            await search.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
            await driver.sleep(3000);
            await search.sendKeys(elm.phone);
            await driver.sleep(10000);
            let conv = await driver.findElements(By.className('conv-item-title__name'));

            if (conv.length > 0) {
                elm.zaloName = await driver.wait(until.elementLocated(By.className('conv-item-title__name'))).getText();
                console.log('check check');

                writeCsv(data);
            } else {
                continue;
            }


        }
        return data;
    } catch (errors) {
        console.log(errors);

    } finally {
        await driver.close(until);
    }
}


// zaloNameCheck().then().catch(function (err) { console.error(err); });
module.exports = { zaloNameCheck }