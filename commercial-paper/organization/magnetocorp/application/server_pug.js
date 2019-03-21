const express = require('express')
const path = require('path')

const bodyParser = require('body-parser');


const app = express()
const initport = 3001

const issue = require('./issue_module')

const company = "Magneto Corp"
const id = "MAG"

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

app.get('/',async function(req, res){

    res.render('home', {company: company, id: id, pg:0})

})

app.get('/issue',async function(req, res){

    res.render('issue', {company: company, id: id, pg:1})

})

app.post('/issue',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('issue',values.issuer,values.papernum,values.buyer,values.issuedate,values.redeemdate,values.faceval)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})

app.get('/approve',async function(req, res){

    res.render('approve', {company: company, id: id, pg:2})

})

app.post('/approve',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('approve',values.issuer,values.papernum,values.currentowner)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})

app.get('/openbid',async function(req, res){

    res.render('openbid', {company: company, id: id, pg:3})

})



app.post('/openbid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('openBid',values.issuer,values.papernum,values.opener)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})

app.get('/makebid',async function(req, res){

    res.render('makebid', {company: company, id: id, pg:4})

})

app.post('/makebid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('makeBid',values.issuer,values.papernum,values.bidder,values.price)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})

app.get('/closebid',async function(req, res){

    res.render('closebid',  {company: company, id: id, pg:5})

})

app.post('/closebid',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('closeBid',values.issuer,values.papernum,values.opener)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})

app.get('/redeem',async function(req, res){

    res.render('redeem',  {company: company, id: id, pg:6})

})

app.post('/redeem',async function(req, res){

    values = req.body
    console.log(values)
    response = await issue.issue('redeem',values.issuer,values.papernum,values.funder,values.date)
    res.render('result', {company: company, id: id, pg:0, result: response.toString()})

})


app.listen(initport,()=>console.log(`listen on port: ${initport}`))