const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const { data } = require('jquery');
//login with default user 
let options = new chrome.Options(
);
// options.addArguments("--user-data-dir = C:/Users/Dell/AppData/Local/Google/Chrome/User Data")

const caps = new Capabilities();
caps.setPageLoadStrategy('normal');

// let groups = [];

async function getAllZaloGroups(groups) {
    let driver = new Builder()
        .withCapabilities(caps)
        .forBrowser('chrome')
        .build();
    //open zalo with maximum size of browser window
    await driver.get('https://chat.zalo.me');
    driver.manage().window().maximize();
    try {
        await sleep(10000);
        groups = new Array();
        let members = new Array();
        // Find the Contacts tab and click to show contact list 
        let contact = await driver.wait(until.elementLocated(By.xpath('//*[@id="main-tab"]/div[1]/div[2]/div[2]')));
        await contact.click();
        console.log('contact tab clicked');
        await sleep(3000);

        // Find the Group button and click to show group list
        let viewGroupBtn = await driver.wait(until.elementLocated(By.xpath('//*[@id="contactList"]/div[1]/div/div[1]/div/div/div[3]/div')));
        await viewGroupBtn.click();
        console.log('groups tab clicked');


        // Because of the HTML structure, 4 groups located in one line so find all the lines possible
        let groupsBlock = await driver.findElement(By.className('ReactVirtualized__Grid__innerScrollContainer')).findElements(By.xpath('//*[@id="react-v-list"]/div/*'));
        // console.log(groupsBlock.length);

        // Creat a 2D array to store all the xpath of groups .
        var xpathList = new Array(groupsBlock.length);
        // let groupNames = new Array(groupsBlock.length);

        for (let i = 0; i < xpathList.length; i++) {
            let convs = await groupsBlock[i].findElements(By.xpath(`//*[@id="react-v-list"]/div/div[${i + 1}]/div/*`));
            // console.log(convs.length);
            xpathList[i] = new Array(convs.length);
        }

        // Set array element values with xpath of a single group
        for (let i = 0; i < xpathList.length; i++) {
            for (let j = 0; j < xpathList[i].length; j++) {
                xpathList[i][j] = `//*[@id="react-v-list"]/div/div[${i + 1}]/div/div[${j + 1}]`;
            }
        }
        // Because the first line found above does not contains any groups, so remove it from the  array
        xpathList.shift();

        // Main process here.  
        let index = 0;
        for (let i = 0; i < xpathList.length; i++) {

            for (let j = 0; j < xpathList[i].length; j++) {
                // Loop through every element of the array and find group with the xpath then click
                await driver.wait(until.elementLocated(By.xpath(xpathList[i][j]))).click();

                // Get group name
                let groupNameElm = await driver.wait(until.elementLocated(By.className('title header-title')));
                let groupName = await groupNameElm.getText();

                // click to show members on the right side
                let ele = await driver.wait(until.elementLocated(By.className('subtitle__groupmember__content')));
                await ele.click();

                // Get all the groups'
                let membersName = await driver.wait(until.elementsLocated(By.css('.chat-box-member__info__name')));
                groups.push({
                    index: index + 1,
                    gr_name: groupName,
                    participants: membersName.length,
                });
                index++;

                // Get members of each groups
                // console.log("Group : " + groupName);
                for (let memberName of membersName) {
                    let name = await memberName.getText();
                    // console.log('Member :' + name);
                    members.push({
                        memberId: membersName.indexOf(memberName) + 1,
                        memberName: rename(name),
                    });
                }

                //write to file csv
                membersWriter(groupName.split(' ').join('_'), members);
                members.splice(0, members.length);

                // click the Groups button again to go back to the list of Grous 
                viewGroupBtn.click();
                await sleep(Math.floor(Math.random() * 10000));
            }
        }

        groupWriter.writeRecords(groups).then(() => console.log('The CSV file was written successfully')).catch(function (error) {
            console.log(error.message);
        });
        return groups;

        // .then(data => console.log(data));
    } catch (error) {
        console.log(error);
    } finally {
        await driver.quit();
    }
    // setTimeout(async function () {

    // }, 20000);
    // wait for manual login verification so setTimeout at 15 seconds
}
// Config .csv file 
const groupWriter = createCsvWriter({
    path: 'zaloGroup.csv',
    header: [
        { id: 'index', title: 'index' },
        { id: 'gr_name', title: 'gr_name' },
        { id: 'participants', title: 'participants' },
    ]
});

// sleep method
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//write members off each group to file
function membersWriter(name, members) {
    // if (!fs.existsSync(path.join(__dirname, `/data/zalo/groups`))) {
    //     fs.mkdir(path.join(__dirname, `/data/zalo/groups`), { recursive: true }, err => { });
    // }

    //config csv file
    const memberWriter = createCsvWriter({
        path: `data/zalo/groups/zaloMember_${name}.csv`,
        header: [
            { id: 'memberId', title: 'memberId' },
            { id: 'memberName', title: 'memberName' },
        ]
    });

    //wwrite file
    memberWriter.writeRecords(members)
        .then(() => console.log('members data written successfully'))
        .catch(err => console.log(err))
}

function rename(name) {
    if (name.includes('Trưởng nhóm')) {
        name = name.slice(-name.length, -12);
    }
    if (name.includes('Phó nhóm')) {
        name = name.slice(-name.length, -19);
    }
    return name;
}


//RUN
// let all_groups
// getAllZaloGroups(all_groups)
//     .then(data => console.log(data))
//     .catch(function (err) {
//         console.error(err);
//     });

module.exports = { getAllZaloGroups }
