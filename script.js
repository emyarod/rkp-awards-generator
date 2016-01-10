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
var postIDs = [];

// create output file
fs.writeFileSync('results.md', '');

reddit('/r/annualkpopawards/new').listing({ limit: 100 }).then(function(slice) {
  // get all award category post IDs
  for (var i = 0; i < slice.children.length; i++) {
    postIDs.push(slice.children[i].data.id);
  }

  // get top 5 nominations from each award category
  for (var i = 0; i < postIDs.length; i++) {
    reddit('/r/annualkpopawards/comments/' + postIDs[i]).get().then(function(result) {
      // result[0] is the OP, result[1] is the comments section
      awardTitle = '__' + result[0].data.children[0].data.title + '__';

      // write award title to file
      fs.appendFileSync('results.md', '\n' + awardTitle + '\n\n');

      // write top 5 nominations and scores to file
      for (var i = 0; i < 5; i++) {
        var nomination = result[1].data.children[i].data.body;
        var upvotes = result[1].data.children[i].data.ups;
        if (i == 0) {
          // give top nomination winner's trophy
          fs.appendFileSync('results.md', '[](//#award2)' + nomination + ' | ' + upvotes + '\n' + ':|:' + '\n');
        } else if (i == 1) {
          // give first runner up smaller trophy
          fs.appendFileSync('results.md', '[](//#trophy)' + nomination + ' | ' + upvotes + '\n');
        } else {
          fs.appendFileSync('results.md', nomination + ' | ' + upvotes + '\n');
        }
      }
    });
  }
});