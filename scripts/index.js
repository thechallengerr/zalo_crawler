// Find element to display result
let result = document.getElementById('result');

// options click handler
function optionsClickHandler() {
	let options = document.querySelectorAll('.list-group-item');
	// console.log(options);
	for (let option of options) {
		option.children[0].onclick = function () {
			option.children[1].classList.toggle('d-block');
		}
	}
}



// crawl fb friends
function crawlFriendsFb() {
	let crawlFbFriendsBtn = document.querySelector('.crawl-fb-friends');
	console.log(crawlFbFriendsBtn);
	crawlFbFriendsBtn.onclick = function () {
		let email = document.querySelector('input[name="email"]').value;

		let password = document.querySelector('input[name="password"]').value;
		console.log(email, password);
		let data = {
			email: email,
			password: password,
		}

		let fbFriendsApi = 'http://localhost:8888/fb-friends'
		let htmls = '';
		postData(fbFriendsApi, data)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				htmls = data.map(function (item) {
					return `
                      <div class="friend-list">
                          
                          <div class="row border-bottom mt-2">
                              <div class="col-sm-2">
                                  ${item.index}
                              </div>
                              <div class="col-sm-4 text-bold">
                                  ${item.name}
                              </div>
                              <div class="col-sm-6">
                                  <a href="${item.link}">${item.link}</a>
                              </div>
                          </div>
                          
                      </div>`
				})
				// console.log(htmls);
				let html = htmls.join('');
				result.innerHTML = `<div class="friend-list">
                          
                          <div class="row border-bottom mt-2">
                              <div class="col-sm-2 text-bold">
                                  STT
                              </div>
                              <div class="col-sm-4 text-bold">
                                  Display Name
                              </div>
                              <div class="col-sm-6">
                                  <p class="text-bold">Facebook link</p>
                              </div>
                          </div>
                          
                      </div>`+ html;
			})
			.catch(err => console.log(err));

	}
	async function postData(api, data) {
		const response = await fetch(api, {
			method: 'POST',
			mode: 'cors', // no-cors, *cors, same-origin
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},


			body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		return response.json();
	}



}
//crawl members of specific group
function crawlMembersOfGroup() {
	let crawlZaloGroupMembersBtn = document.querySelector('.crawl-group-members');
	console.log(crawlZaloGroupMembersBtn);
	let groupName = document.querySelector('input[name="group"]').value;
	let data = { group: group };
	let zaloGroupMembersApi = 'http://localhost:8888/zalo-specific-group';
	crawlZaloGroupMembersBtn.onclick = function () {

		postData(zaloGroupMembersApi, data)
			.then(data => {
				let htmls = data.map(function (item) {
					return `
          <div class="friend-list">
              
              <div class="row border-bottom mt-2">
                  <div class="col-sm-2">
                      ${item.memberId}
                  </div>
                  <div class="col-sm-4 text-bold">
                      ${item.memberName}
                  </div>
              </div>
              
          </div>`
				})
				let html = htmls.join('');
				result.innerHTML = `<div class="friend-list">
              
              <div class="row border-bottom mt-2">
                  <div class="col-sm-2 text-bold">
                      STT
                  </div>
                  <div class="col-sm-4 text-bold">
                      Members Name
                  </div>
                  
              </div>
              
          </div>` + html;
				console.log(result);
			})
			.catch(err => console.log(err));
	}

}

// crawl zalo groups
function crawlZaloGroups() {
	let crawlZaloGroupsBtn = document.querySelector('.crawl-groups-zalo');
	console.log(crawlZaloGroupsBtn);
	let zaloGroupsApi = 'http://localhost:8888/zalo-groups';
	crawlZaloGroupsBtn.onclick = function () {

		fetch(zaloGroupsApi)
			.then(response => response.json())
			.then(data => {
				let htmls = data.map(function (item) {
					return `
                      <div class="friend-list">
                          
                          <div class="row border-bottom mt-2">
                              <div class="col-sm-2">
                                  ${item.index}
                              </div>
                              <div class="col-sm-4 text-bold">
                                  ${item.gr_name}
                              </div>
                              <div class="col-sm-6">
                                  <p>${item.participants}</p>
                              </div>
                          </div>
                          
                      </div>`
				})
				let html = htmls.join('');
				result.innerHTML = `<div class="friend-list">
                          
                          <div class="row border-bottom mt-2">
                              <div class="col-sm-2 text-bold">
                                  STT
                              </div>
                              <div class="col-sm-4 text-bold">
                                  Group Name
                              </div>
                              <div class="col-sm-6">
                                  <p class="text-bold">Number of members</p>
                              </div>
                          </div>
                          
                      </div>` + html;
				console.log(result);
			})
			.catch(err => console.log(err));
	}
}


function cancelButtonHandler() {
	let cancelBtns = document.querySelectorAll('.btn-danger');
	// console.log(cancelBtns)
	cancelBtns.forEach(btn => {
		btn.onclick = function () {
			let option = document.querySelector('.d-block');
			console.log(option.classList);
			option.classList.remove('d-block');
			console.log(option.classList);


		}
	});
}
function start() {
	optionsClickHandler();
	cancelButtonHandler();
	crawlFriendsFb();
	crawlMembersOfGroup();
	crawlZaloGroups();
}

start()