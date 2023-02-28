//server creation

//1.import express
const express = require('express')

//importing webtoken
const jwt = require('jsonwebtoken')

//import cors
const cors = require('cors')

const dataService = require('./services/dataServices')
//create an app using express
const app = express()
app.use(express.json())

// give commands to share data via cors
app.use(cors({
    origin:['http://localhost:4200','http://192.168.1.7:8080','http://127.0.0.1:8080']
}))

//3.create a port number
//portnumber for backend:3000
app.listen(3000, () => {
    console.log('Litsening on port');
})

//application specific middleware
const appMiddleware = (req, res, next) => {
    console.log("Application specific middleware");
    next();
}
app.use(appMiddleware)

//router specific middleware
const routerMiddleware = (req, res, next) => {
    try {
        console.log("Router specific middleware");
        const token = req.headers['x-access-token']
        const data = jwt.verify(token, 'superkey2023')
        console.log(data);
        next();
    } catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'please login first'
        })
    }
}

//4.resolving http requests

//API Calls

//Register requests
app.post('/register', (req, res) => {
    dataService.register(req.body.acno, req.body.password, req.body.username).then(
        result => {
            res.status(result.statusCode).json(result)
        }
    )
})

//login Requests
app.post('/login', (req, res) => {
    dataService.login(req.body.acno, req.body.password).then(
        result => {
            res.status(result.statusCode).json(result)
        }
    )
})
//Deposit request

app.post('/deposit', routerMiddleware, (req, res) => {
    dataService.deposit(req.body.acno, req.body.password, req.body.amount).then(
        result => {
            res.status(result.statusCode).json(result)
        }
    )
})

//withdraw request
app.post('/withdraw', routerMiddleware, (req, res) => {
    dataService.withdraw(req.body.acno, req.body.password, req.body.amount).then(
        result => {
            res.status(result.statusCode).json(result)
        }
    )
})
//transaction request
app.post('/transactions', routerMiddleware, (req, res) => {
    dataService.getTransactions(req.body.acno).then(
        result => {
            res.status(result.statusCode).json(result)
        }
    )
    
})
//delete request

app.delete('/deleteACC/:acno',(req,res)=>{
    dataService.deleteACC(req.params.acno).then(
        result => {
            res.status(result.statusCode).json(result)
        }  
    )
})
