
/**
const schedule = require('node-schedule');

function scheduleCronstyle() {
  schedule.scheduleJob('30 * * * * *',function() {
    console.log('test test test : '+ new Date());
  })
}
scheduleCronstyle();

**/
const url = require('url');
const text = url.resolve("http://civetInterface.foxconn.com/","Open/ScanPage?redirect_uri=http://10.142.214.89:3030/civetsso&scope=snsapi_userinfo&NonBorder=true&NonNav=true");
console.log(text);
