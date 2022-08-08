const express = require('express');
const axios = require('axios');
const { Builder, By, Key, until, JavascriptExecutor, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { fbFriendsCrawler, } = require('./scripts/facebook_friends.js');
const { getAllZaloGroups } = require('./scripts/zalo_groups.js');
const { getSpecificGroupMembers } = require('./scripts/getGroupMembers.js');
const { zaloNameCheck } = require('./scripts/zaloNameCheck.js');
const { autoChatZalo } = require('./scripts/autoChatZalo.js');
const csvReader = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { json } = require('express');
const app = express();
const port = 8888;
const busboy = require('connect-busboy');
//middleware
app.use(cors());
app.use(busboy());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Route 
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/index.html'));
});


app.post('/fb-friends', (req, res) => {
	let data = new Array();
	fbFriendsCrawler(req.body.email, req.body.password, "friend", data).then(friends => {
		let htmls = friends.map(friend => {
			return `
			<div class="friend-list">
				
				<div class="row border-bottom mt-2">
					<div class="col-sm-2">
						${friend.index}
					</div>
					<div class="col-sm-4 font-weight-bold">
						${friend.name}
					</div>
					<div class="col-sm-6">
						<a href="${friend.link}">${friend.link}</a>
					</div>
				</div>
				
			</div>`
		});
		let html = htmls.join('');
		let header = `	<div class="row border-bottom mt-2">
							<div class="col-sm-2 font-weight-bold">
								No.
							</div>
							<div class="col-sm-4 font-weight-bold">
								Name
							</div>
							<div class="col-sm-6 font-weight-bold">
								FB Link
							</div>
						</div>`
		res.send(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
					<h3 class= "mt-5 mb-5 text-center text-uppercase font-weight-bold">Result</h3>
					<div class="container mb-5">`+ header + html + `</div>`);
	}).catch((err) => {
		console.error(err);
		res.sendFile(path.join(__dirname, 'src/404.html'));
	}
	);
	// res.send(req.body);
});

app.get('/fb-friends', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/crawl-friends-fb.html'));
})


app.get('/zalo-specific-group', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/crawl-gr-members-zalo.html'));
	// res.send('Specific Group members');
});

app.post('/zalo-specific-group', (req, res) => {
	let data;
	console.log(req.body);
	if (!fs.existsSync(path.join(__dirname, `/data/zalo/groups`))) {
		fs.mkdir(path.join(__dirname, `/data/zalo/groups`), { recursive: true }, err => { });
	}
	getSpecificGroupMembers(req.body.group, data)
		.then((data) => {
			let htmls = data.members.map(member => {
				return `
				<div class="row border-bottom mt-2">
					<div class="col-sm-2">
						${data.members.indexOf(member)}
					</div>
					<div class="col-sm-10 text-primary">
						${member}
					</div>
				
				</div>`
			});
			let html = htmls.join('');
			let header = `<h3 class="mt-5 mb-5">Group: ${data.gr_name} </h3>
						<h3 class="mt-3 mb-3">No. of Members: ${data.members.length} </h3>`
			res.send(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
						<h3 class= "mt-5 mb-5 text-center text-uppercase font-weight-bold">Result</h3>
						<div class="container mb-5">`+ header + `<ul class="p-4">${html}</ul>` + `</div>`);
		})
		.catch((err) => {
			console.log(err);
			res.sendFile(path.join(__dirname, 'src/404.html'));
		});
});



app.get('/zalo-groups', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/crawl-groups-zalo.html'));

});

app.post('/zalo-groups', (req, res) => {
	let data;
	if (!fs.existsSync(path.join(__dirname, `/data/zalo/groups`))) {
		fs.mkdir(path.join(__dirname, `/data/zalo/groups`), { recursive: true }, err => { });
	}
	getAllZaloGroups(data)
		.then(groups => {
			console.log(groups);
			// res.json(groups);
			let htmls = groups.map(group => {
				return `
			<div class="friend-list">
				
				<div class="row border-bottom mt-2">
					<div class="col-sm-2">
						${group.index}
					</div>
					<div class="col-sm-4 font-weight-bold">
						${group.gr_name}
					</div>
					<div class="col-sm-6">
						${group.participants}
					</div>
				</div>
				
			</div>`
			});
			let html = htmls.join('');
			let header = `	<div class="row border-bottom mt-2">
							<div class="col-sm-1 font-weight-bold">
								No.
							</div>
							<div class="col-sm-4 font-weight-bold">
								Group Name
							</div>
							<div class="col-sm-6 font-weight-bold">
								Number of participants
							</div>
						</div>`
			res.send(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
						<h3 class= "mt-5 mb-5 text-center text-uppercase font-weight-bold">Result</h3>
						<div class="container mb-5">`+ header + html + `</div>`)
		})
		.catch((err) => {
			console.log(err);
			res.sendFile(path.join(__dirname, 'src/404.html'));
		});
});

app.get('/zalo-name-check', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/check-name-zalo.html'));

});
app.post('/zalo-name-check', (req, res) => {
	if (!fs.existsSync(path.join(__dirname, 'data/contacts'))) {
		fs.mkdirSync(path.join(__dirname, 'data/contacts'), { recursive: true }, err => { });
	};
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log(filename)
		var fstream = fs.createWriteStream('./data/contacts/contacts.csv');
		file.pipe(fstream);
		fstream.on('close', function () {
			let data;
			// let csv = 'STT,SĐT,Họ Tên,Tên Zalo';
			zaloNameCheck(data)
				.then((infos) => {
					let htmls = infos.map(info => {

						return `
					<div class="row border-bottom mt-2">
					<div class="col-sm-1">
						${info.index}
					</div>
					<div class="col-sm-2 ">
						${info.phone.startsWith('0') ? info.phone : '0' + info.phone}
					</div>
					<div class="col-sm-4">
						${info.name}
					</div>
					<div class="col-sm-5 font-weight-bold ${info.zaloName === 'Not Registered/Checked' ? 'text-danger' : ''}">
						${info.zaloName}
					</div>
				</div>`
					});
					let html = htmls.join('');
					let backBtn = `<a href="/" class="bg-danger p-2 border-0 text-white text-decoration-none">Back</a>`
					let downloadFile = `<a href="http://localhost:8888/zalo-name-check/zaloName.csv" class="bg-success p-2 border-0 text-white text-decoration-none" download="zaloName.csv"> Download CSV </a>`
					let header = `	<div class="row border-bottom mt-2 font-weight-bold">
								<div class="col-sm-1">
									No.
								</div>
								<div class="col-sm-2">
									Phone Number
								</div>
								<div class="col-sm-4">
									Name
								</div>
								<div class="col-sm-5">
									Zalo Name
								</div>
							</div>`
					res.send(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
			integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
							<h3 class= "mt-5 mb-5 text-center text-uppercase font-weight-bold">Result</h3>
							<div class="container mb-5">` + downloadFile + header + html + `</div> ` + backBtn);
				})
				.catch(err => console.log(err));
		});
	}).on('error', function (err) { console.log(err) });



});

// Download file csv
app.get("/zalo-name-check/:filename", (req, res) => {
	const filePath = __dirname + "/data/contacts/" + req.params.filename;
	res.download(
		filePath,
		"zaloName.csv", // Remember to include file extension
		(err) => {
			if (err) {
				res.send({
					error: err,
					msg: "Problem downloading the file"
				})
			}
		});
});

app.get("/zalo-auto-chat", (req, res) => {
	res.sendFile(path.join(__dirname, "src/auto-chat-zalo.html"));
});

app.post("/zalo-auto-chat", (req, res) => {
	console.log(req.body);
	let phoneNumbers = req.body.phoneNumber.split(',');
	let messages = req.body.message.split(',');
	if (phoneNumbers.length === 0 || messages.length === 0) {
		res.send("No phone was found. Please comeback and try again.");
	}
	console.log(messages);
	autoChatZalo(phoneNumbers, messages).then((logs) => {
		let htmls = logs.map((log) => {
			return `<p>${log}</p>`
		})
		let backBtn = `<a href="/" class="bg-danger p-2 border-0 text-white text-decoration-none mb-5">Back</a>`

		res.send(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
		<div class="container"><h3 className="mb-5 mt-5 text-center">Chat logs</h3>` + htmls.join('\n') + backBtn + `</div >`);
	}).catch(err => {
		console.log(err);
		res.sendFile(path.join(__dirname, 'src/404.html'))
	});
});


app.listen(port, () => {
	console.log(`Crawler app listening on port ${port}`)
});