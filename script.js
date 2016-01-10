const fs = require('fs');
var keys = require('./keys');
var Snoocore = require('snoocore');
var reddit = new Snoocore({
  userAgent: 'rkp awards generator',
  oauth: {
    type: 'script',
    key: keys.clientKey,
    secret: keys.secret,
    username: keys.username,
    password: keys.password,
    scope: [ 'identity', 'read' ]
  }
});

var awardTitle;

// create output file
fs.writeFileSync('out.md', '');

// reddit('/api/v1/me').get().then(function(result) {
//   console.log(result);
// });

// reddit('/r/annualkpopawards/new').listing({ limit: 100 }).then(function(slice) {
//   for (var i = 0; i < slice.children.length; i++) {
//     // console.log(slice.children[i].data.url);
//   }
//   // console.log(slice.children);
// });

reddit('/r/annualkpopawards/comments/3uc10o').get().then(function(result) {
  // result[0] is the OP, result[1] is the comments section
  awardTitle = '__' + result[0].data.children[0].data.title + '__';

  // write award title to file
  fs.appendFileSync('out.md', awardTitle + '\n\n');

  // write nominations and scores to file
  for (var i = 0; i < result[1].data.children.length; i++) {
    var nomination = result[1].data.children[i].data.body;
    var upvotes = result[1].data.children[i].data.ups;
    if(i == 0) {
      fs.appendFileSync('out.md', '[](//#award2)' + nomination + ' | ' + upvotes + '\n' + ':|:' + '\n');
    } else if (i == 1) {
      fs.appendFileSync('out.md', '[](//#trophy)' + nomination + ' | ' + upvotes + '\n');
    } else {
      fs.appendFileSync('out.md', nomination + ' | ' + upvotes + '\n');
    }
  }
});