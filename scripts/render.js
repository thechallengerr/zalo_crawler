import csvReader from 'csv-parser';
import { createReadStream } from 'fs';

let friend_fb_links = [];
let readFriend = [];
createReadStream('fb_friends.csv')
    .pipe(csvReader())
    .on('data', function (row) {
        friend_fb_links.push(row);
        console.log(row);
    })
    .on('end', function () {
        console.log(friend_fb_links.length + ' friends have been processed successfully.');
    });

// console.log(friend_fb_links.join(',\n'));
friend_fb_links.shift();
htmls = friend_fb_links.map(function (row) {
    return `<li>
                    <span class="idFriend">{{row.id}}</span>
                    <a href="${row[0]}">${row.Name}</a>
                </li>`
});
console.log(htmls);