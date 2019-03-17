const express = require('express')
const path = require('path')

const bodyParser = require('body-parser');


const app = express()
const initport = 3300

const issue = require('./issue_module')

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// app.use(session({
//     secret: 'rinneprprpr',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     next();
// });

app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug')


app.get('/issue',async function(req, res){

    res.render('issue')

})

app.post('/issue',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('issue',values.issuer,values.papernum,'','',values.faceval)
    res.send(response.toString())

})

app.get('/submit',async function(req, res){

    res.render('submit')

})

app.post('/submit',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('submit',values.issuer,values.papernum,values.currentowner,values.newowner)
    res.send(response.toString())

})

app.get('/openbid',async function(req, res){

    res.render('openbid')

})



app.post('/openbid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('openBid',values.issuer,values.papernum,values.currentowner)
    res.send(response.toString())

})

app.get('/makebid',async function(req, res){

    res.render('makebid')

})

app.post('/makebid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('makeBid',values.issuer,values.papernum,values.bidder,values.price)
    res.send(response.toString())

})

app.get('/closebid',async function(req, res){

    res.render('closebid')

})

app.post('/closebid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('closeBid',values.issuer,values.papernum,values.currentowner)
    res.send(response.toString())

})

app.get('/redeem',async function(req, res){

    res.render('redeem')

})

app.post('/redeem',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('redeem',values.issuer,values.papernum,values.redeemowner,values.date)
    res.send(response.toString())

})


app.listen(initport,()=>console.log(`listen on port: ${initport}`))