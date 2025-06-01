import  cron from 'cron';
import https from 'https';


const job = new cron.CronJob('*/14 * * * *', function () {
  https.get(process.env.API_URL, (res) => {
    if(!res.statusCode || res.statusCode !== 200) {
      console.error(`Request failed with status code: ${res.statusCode}`);
      return;
    }
    console.log(`statusCode: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
});


export default job;
