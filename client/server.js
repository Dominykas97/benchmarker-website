const request = require("request");
const compression = require('compression');

const express = require('express');
const path = require('path');
const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', (req, res) => {
    return res.send('pong')
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
// app.get('/completed_jobs', function(req,res) {
//     //modify the url in any way you want
//     // let newurl = "http://express-back-end.2262804sproject.svc.cluster.local:5000/completed_jobs/";
//     let newurl = "http://express-back-end-2262804sproject.ida.dcs.gla.ac.uk/completed_jobs/";
//     request(newurl).pipe(res);
// });
// app.get('/running_jobs', function(req,res) {
//     //modify the url in any way you want
//     let newurl = "http://express-back-end-2262804sproject.ida.dcs.gla.ac.uk/running_jobs/";
//     request(newurl).pipe(res);
// });
// app.get('/express_backend', function(req,res) {
//     //modify the url in any way you want
//     let newurl = "http://express-back-end-2262804sproject.ida.dcs.gla.ac.uk/express_backend/";
//     request(newurl).pipe(res);
// });
//
// app.post('/new_job', function(req,res){
//     let url = "http://express-back-end-2262804sproject.ida.dcs.gla.ac.uk/new_job/";
//     let r = request.post({uri: url, json: req.body});
//     req.pipe(r).pipe(res);
// });

app.use('/', (req, res) => {
    let url = 'http://express-back-end-2262804sproject.ida.dcs.gla.ac.uk'+ req.url;
    let r = null;
    if(req.method === 'POST') {
        r = request.post({uri: url, json: req.body});
    } else {
        r = request(url);
    }

    req.pipe(r).pipe(res);
});
// app.listen(port, () => console.log(`${ip}:${port}`));

app.listen(3000);
