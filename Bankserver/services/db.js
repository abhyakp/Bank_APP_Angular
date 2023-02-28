//server-integration

//import mongoose

const mongoose =require('mongoose')

//state connection string via mongoose

mongoose.connect('mongodb://localhost:27017/BankServer',{
    useNewURLParser:true//to avoid unwanted warning
})

//define bank model

const User=mongoose.model('User',{
    //model creation -user
    //schema creation
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}