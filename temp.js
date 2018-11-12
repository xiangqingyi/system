const schedule = require('node-schedule');

function scheduleCronstyle() {
  schedule.scheduleJob('30 * * * * *',function() {
    console.log('test test test : '+ new Date());
  })
}
scheduleCronstyle();