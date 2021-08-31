
// SIGNL4 duty schedule importer.
// This sample is provided as is with no guarantees, please use with care. 

const fetch = require('node-fetch');

const csv = require('csv-parser');
const fs = require('fs');
const { exit } = require('process');

// These variables need to be configured

// The SIGNL4 API key.
const strAPIKey = 'Your-SIGNL4-API-Key';
// The team name of the SIGNL4 team.
const strTeamName = 'Super SIGNL4';
// The email address of a user for whom to export the alerts.
// The user needs to be a member of the team. Then all alerts for this team are exported.
const strUserEmail = 'ron@signl4.com';
// Start of the date range to export alerts for.
const strDateFrom = '2021-08-01';
// End of the date range to export alerts for.
const strDateTo = '2021-08-31';

// Run
exportAlerts();

//var strTeamId =  getTeamId(strTeamName);
//console.log("Team ID: " + strTeamId);

// Main function
async function exportAlerts() {

  // Get the team ID from the team name
  var strTeamId = await getTeamId(strTeamName);
  console.log("Team ID: " + strTeamId);

  // Get the user ID from the user's email
  var strUserId = await getUserId(strUserEmail);
  console.log("User ID: " + strUserId);

  // Export alerts
  var alertIds = await getAlerts(strUserId, strTeamId, strDateFrom, strDateTo);
  
  // Get the alerts
  for (let i = 0; i < alertIds.length; i++) {
    var alertDetails = await getAlertDetails(strUserId, alertIds[i]);
    console.log(alertDetails);
  }
}



// Get the team ID from the team name
async function getTeamId(strTeamName) {
  var teamId = "";
  const res = await fetch('https://connect.signl4.com/api/v2/teams', {
          method: 'get',
          headers: { 'X-S4-Api-Key': strAPIKey }
      });

      const json = await res.json();
      
      //console.log(json);

      // Get team id from team name
      json.forEach(function (item) {
        if (strTeamName == item.name) {
          console.log(item.name + ': ' + item.id);
          teamId = item.id;
        }
      });

    return teamId;
  }


// Get user ID from user email
async function getUserId(strMail) {
  var userId = "";
  const res = await fetch('https://connect.signl4.com/api/v2/users', {
          method: 'get',
          headers: { 'X-S4-Api-Key': strAPIKey }
      })

      const json = await res.json();
      
      // console.log(json);

      // Get team id from team name
      json.forEach(function (item) {
        if (strMail.toLowerCase() == item.mail.toLowerCase()) {
          console.log(item.mail + ': ' + item.id);
          userId = item.id;
        }
      });

    return userId;
  }

// Get alert details
async function getAlertDetails(userId, alertId) {
  const res = await fetch('https://connect.signl4.com/api/v2/alerts/' + alertId + '/details?userId=' + userId, {
          method: 'get',
          headers: {
            'X-S4-Api-Key': strAPIKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
      })

      var json = await res.json();
      
      // console.log(json);

      // Re-format result
      var result = {
        'Title': json.title,
        'Text': json.text,
        'CreationTime': json.history.created
        };

      // Get the parameter value pairs
      json.parameters.forEach(function (item) {
        if (item.name.indexOf('X-S4-') == -1) {
          result[item.name] = item.value;
        }
      });

      // Add your export code here
      console.log(result);

      return result;
  }

// Get alert details
async function getAlerts(userId, teamId, dateFrom, dateTo) {

  var alertIds = new Array();
  var body = {
    'teamid': teamId,
    'alertIds': [],
    'afterId': '',
    'categoryIds': [],
    'continuationToken': {
      'nextPartitionKey': '',
      'nextRowKey': '',
      'nextTableName': ''
    },
    'maxCreated': dateTo + 'T23:59:59.999Z',
    'minCreated': dateFrom + 'T00:00:00.000Z',
    'modSince': '',
    'showPersonalHiddenCategories': true,
    'alertStatusCodes': 0,
    'textToSearch': ''
  };

  var bHasMore = true;

  while (bHasMore) {
    const res = await fetch('https://connect.signl4.com/api/v2/alerts/paged?userId=' + userId + '&maxResults=10', {
            method: 'post',
            headers: {
              'X-S4-Api-Key': strAPIKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        })

        var json = await res.json();

        // Get the alert id's
        json.results.forEach(function (item) {
          // console.log('Alert ID: ' + item.id);
          
          alertIds.push(item.id);

        });

        bHasMore = json.hasMore;

        if (bHasMore) {
          body.continuationToken.nextPartitionKey = json.continuationToken.nextPartitionKey;
          body.continuationToken.nextRowKey = json.continuationToken.nextRowKey;
        }
    }

    return alertIds;

  }
