
# SIGNL4 Alert Export

In the SIGNL4 web portal you can manually export historic alert reports as .csv files. In some cases it might be useful to export alert data programmatically. For example you can forward all alerts including specific parameters to [InfluxDB](https://www.influxdata.com/) and show the alert history in [Grafana](https://grafana.com/) to recognize peaks, trends and abnormalities over time. You can even use AIOps to recognize certain trends automatically.

Using the REST API it is also possible to export alert data automatically. Here, we provide a sample script to do this.

You can trigger the export script automatically (e.g. every hour or every day) using a cron job or via tools like [Node-RED](https://nodered.org/).

## Usage and Sample Code

Attention: This code is intended as a sample and only lightly tested with no guarantee. Please use with care.

We provide a sample JavaScript / Node.js script for exporting historic SIGNL4 alerts. The script uses the SIGNL4 REST API as documented here:
[https://connect.signl4.com/api/docs/index.html](https://connect.signl4.com/api/docs/index.html)

As a prerequisite you first need to install Node.js as described [here](https://nodejs.org/en/download/).

The sample code is provided in the file 'alert-export.js'. You can execute the wile with the node command.

Command line sample:

    node export-alerts.js

Within the source file you need to adapt the SIGNL4 API key, the team name, a user's email address and the date range to be exported:

```
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
```

Attention: All times are UTC times.

You can create the API key in your SIGNL4 web portal under Teams -> Developer.

Right now the exported alerts are logged as command line result. You can change this according to your specific needs. For example you can export the alert data to a .csv file, database, InfluxDB, etc.

You can add your own export code in the function "getAlertDetails" right below "// Add your export code here".

You can find the sample script here on GitHub: https://github.com/signl4/signl4-alert-export/.
