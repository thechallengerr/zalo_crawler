const {
	Builder,
	By,
	Key,
	until,
	JavascriptExecutor,
	Capabilities,
} = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
// const options =new Chrome();

const { elementLocated } = require("selenium-webdriver/lib/until");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const chrome = require('selenium-webdriver/chrome')

const options = new chrome.Options();

options.addArguments(['--disable-notifications']);

async function fbFriendsCrawler(acc, pwd, options, data) {

	const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
	driver.get("https://facebook.com");
	driver.manage().window().maximize();

	try {
		await loginFacebook(acc, pwd, driver);
		console.log("Login successfully");

		// block notifications on login
		await sleep(5000);
		let overlay = await driver.wait(until.elementLocated(By.xpath('/html/body/div[6]/div[1]/div/div[2]')));
		await driver.sleep(3000);
		if (overlay.isDisplayed()) {
			console.log('Overlay found');
			await overlay.click();
			console.log('Overlay clicked');
		}


		// go to profile page and get uid 
		let el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[1]/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/ul/li/div/a')));
		await el.click();
		console.log('Go to profile page');
		let user = '';
		let userUrl = await driver.getCurrentUrl();
		if (!userUrl.includes('https://www.facebook.com/profile.php?id=')) {

			user = userUrl.slice(25, userUrl.length);
			console.log(user);
		} else {
			user = userUrl.slice(40, userUrl.length);
			console.log(user);
		}
		data = new Array();


		//get  all friends
		if (options === "friend") {
			await getFriends(driver, data);
		}

		//save to csv file
		writeCsv(user, data);

		return data;

	} catch (error) {
		console.error(error);
	} finally {
		await driver.close();
	}
}

async function getFriends(driver, data) {
	// click on Friends tab
	let showFriend = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div/div[3]/div/div/div/div[1]/div/div/div[1]/div/div/div/div/div/div/a[3]')));
	await showFriend.click();
	// loop until all friends found  by scrolling down
	let friendsBeforeScrolling;// friends before scrolling to compare after each scroll action
	while (true) {
		//Find element of each friend
		friendsBeforeScrolling = await driver.wait(until.elementsLocated(By.xpath('//*[@class="buofh1pr hv4rvrfc"]/div[1]/a')), 15000);

		//scroll
		await driver.executeScript('window.scrollBy(0, screen.height);');
		console.log('Scrolled');
		await sleep(Math.floor((Math.random() * 5000) + 5000));

		// Calculate the friends found again
		let friendsAfterScrolling = await driver.wait(until.elementsLocated(By.xpath('//*[@class="buofh1pr hv4rvrfc"]/div[1]/a')), 15000);
		console.log('Total before scrolling: ' + friendsBeforeScrolling.length);

		//if friendsBeforeScrolling == friendsAfterScrolling then terminate the loop
		if (friendsBeforeScrolling.length == friendsAfterScrolling.length) {

			break;
		}
	}

	// store data to array
	for (let i = 0; i < friendsBeforeScrolling.length; i++) {

		let index = i + 1;
		let name = await friendsBeforeScrolling[i].getText();
		let link = await friendsBeforeScrolling[i].getAttribute('href');
		console.log(index + ', ' + name + '\n' + link);
		data.push({
			index: index,
			name: name,
			link: link,
		});
	}
}


// Write data to .csv file
function writeCsv(user, data) {
	try {

		if (!fs.existsSync(path.join(__dirName, 'data/facebook/friends'))) {
			console.log("Folder does not exist. Creating... ")
			fs.mkdir(path.join(__dirName, 'data/facebook/friends'), { recursive: true }, err => { });
		}
	} catch (error) {
		console.log(error);
	}
	const csvWriter = createCsvWriter({
		path: `data/facebook/friends/fb_friends_${user}.csv`,
		header: [
			{ id: "index", title: "index" },
			{ id: "name", title: "name" },
			{ id: "link", title: "link" },
		],
	});

	csvWriter
		.writeRecords(data)
		.then(() => console.log("The CSV file was written successfully"));
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginFacebook(username, password, driver) {
	await driver.findElement(By.id("email")).sendKeys(username);
	await driver.findElement(By.id("pass")).sendKeys(password, Key.ENTER);
	await sleep(5000);


}

// fbFriendsCrawler("hoangnd171@gmail.com", "Passw0rd171", "friend").then(data => console.log(data)).catch((err) =>
// 	console.error(err)
// );

// acount 1 : Vus2huong2001@…. Vudz2001

module.exports = { fbFriendsCrawler }


