const express = require('express')
const app = express()
const initport = 3300

const issue = require('./issue_module')




app.get('/issue',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('issue',values.issuer,values.papernum,'','',values.faceval)
    res.send(response.toString())

})

app.get('/submit',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('submit',values.issuer,values.papernum,values.currentowner,values.newowner)
    res.send(response.toString())

})

app.get('/openbid',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('openBid',values.issuer,values.papernum,values.currentowner)
    res.send(response.toString())

})


app.get('/makebid',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('makeBid',values.issuer,values.papernum,values.bidder,values.price)
    res.send(response.toString())

})

app.get('/closebid',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('closeBid',values.issuer,values.papernum,values.currentowner)
    res.send(response.toString())

})

app.get('/redeem',async function(req, res){

    values = req.query
    console.log(values)
    response = await issue.issue('redeem',values.issuer,values.papernum,values.redeemowner,values.date)
    res.send(response.toString())

})


app.listen(initport,()=>console.log(`listen on port: ${initport}`))