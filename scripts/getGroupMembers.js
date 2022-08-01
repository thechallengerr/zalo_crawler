const { Builder, By, Capabilities, ChromiumWebDriver, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
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
async function getSpecificGroupMembers(groupName, data) {
	let driver = new Builder()
		.forBrowser('chrome')
		.build();
	//open zalo with maximum size of browser window
	await driver.get('https://chat.zalo.me');
	driver.manage().window().maximize();
	sleep(20000);
	try {
		data = {};
		let members = new Array();
		// Find groups by Name
		let findXpath = '//*[@id="contact-search-input"]';
		// let inputMessageXpath = '/html/body/div/div/div[2]/main/div/article/div[4]/div[3]/div/div/div/div/div[1]';

		let search = await driver.wait(until.elementLocated(By.xpath(findXpath)));
		await search.sendKeys(groupName);
		let groupFound = await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/nav/div[2]/div[3]/div/div[2]/div/div/div[1]/div/div[1]/div/div/div[2]')));
		await sleep(5000);
		await groupFound.click();

		// Get group display  name
		let groupNameElm = await driver.wait(until.elementLocated(By.className('title header-title')));
		groupName = await groupNameElm.getText();

		// Get group members 
		// click to show members on the right side
		let ele = await driver.wait(until.elementLocated(By.className('subtitle__groupmember__content')));
		await ele.click();

		//Find the member element
		let membersName = await driver.wait(until.elementsLocated(By.css('.chat-box-member__info__name')));
		for (let memberName of membersName) {
			let name = await memberName.getText();

			// console.log('Member :' + name);
			members.push(rename(name));
			// console.log(name);
		}

		data = {
			gr_name: groupName,
			members: members,
		}
		return data;
	} catch (errors) {
		console.error(errors);
	} finally {
		await driver.quit();
	}


}


module.exports = { getSpecificGroupMembers }