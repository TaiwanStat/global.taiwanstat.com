var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var moment = require('moment');
var fs = require('fs');

var _URL = 'http://www.pm25.in/rank';

getAirData();

function getAirData () {
  async.waterfall([
    function (){
      request.get(_URL, function (error, response, body) {
        if(error){
          console.error('Request error.');
        }
        console.log(body);
        var outputData = parseData(body);
        fs.writeFile('data/data.json', JSON.stringify(outputData));
        console.log('output: data.json');
      }
      )}
    ], function (err, outputData) {
      if (err) {
        console.error('Error.');
      }

      if (!outputData || outputData.length === 0) {
        console.log('GET NULL');
      }
   });
};

function parseData (html){

  var outputData = {};
  var $ = cheerio.load(html);
  var attr = ['city', 'AQI', 'quality', 'pollutant', 'PM2.5', 
      'PM10', 'CO', 'NO2', 'O3', 'O3_8h', 'SO2'];

  $('table.table tbody')
    .find('tr')
    .each(function (number, elem){
      var tds = $(this).find('td');
      var siteData = {};
      var siteName =  $(this).find('td').eq(1)
                      .text().trim().replace(/(\r\n|\n|\r|\s)/g,'');

      for (var i = 1; i < tds.length; ++i) {
        siteData[attr[i-1]] = $(this).find('td')
                                   .eq(i)
                                   .text()
                                   .trim()
                                   .replace(/(\r\n|\n|\r|\s)/g,'');
      }
      outputData[siteName] = siteData;
  });
  var updateTime = $('div.time p').text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
  outputData['updateTime'] = updateTime.substring(7, 17) + ' '+  updateTime.substring(17);
  console.log(updateTime);

  return outputData;
}
