const express = require('express')
const app = express()
const port = 3000


const addToWallet = require('./organization/magnetocorp/application/addToWallet')
const issue = require('./organization/magnetocorp/application/issue')


app.get('/addToWallet', async function(req, res){
    
    // param = req.query
    // console.log(param)
    // result = 
    await addToWallet.addToWallet()
    // console.log('server: '+result.toString())
    // res.send( result.toString() ) 

})

app.get('/issue',  async function(req, res){

    // result = 
    await issue.issue()
    // console.log('server: '+result.toString())
    // res.send( result.toString() ) 
  
})

app.listen(port, () => console.log(`app listening on port ${port}!`))