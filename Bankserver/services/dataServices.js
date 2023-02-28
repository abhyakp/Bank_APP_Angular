//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import db

const db = require('./db')

//userDetails = {
//1000: { acno: 1000, username: 'Amal', password: 1000, balance: 2000, transactions: [] },
// 1001: { acno: 1001, username: 'Akhil', password: 1001, balance: 2000, transactions: [] },
// 1002: { acno: 1002, username: 'Alen', password: 1002, balance: 2000, transactions: [] }
//}

const register = (acno, password, username) => {
  return db.User.findOne({ acno }).then(
    user => {
      if (user) {
        return {
          status: false,
          statusCode: 401,
          message: "Account already exists"
        }
      } else {
        const newUser = new db.User({
          acno: acno,
          username: username,
          password: password,
          balance: 0,
          transactions: []
        })
        newUser.save()//to save the data to mongodb
        return {
          status: true,
          statusCode: 200,
          message: "Reg successful"
        }
      }
    }
  )
}

const login = (acno, pswd) => {
  return db.User.findOne({ acno, pswd }).then(
    user => {
      if (user) {
        currentUser = user.username
        currentAcno = acno
        //token generation
        const token = jwt.sign({ currentAcno: acno }, 'superkey2023')
        //superkey2023 will generate a encrypted code as token
        return {
          status: true,
          statusCode: 200,
          message: "Login successful",
          token: token,
          currentUser: user.username,
          currentAcno: acno
        }
      } else {
        return {
          status: false,
          statusCode: 401,
          message: "Invalid User Details"
        }
      }
    }
  )
}
const deposit = (acno, pswd, amount) => {
  var amnt = parseInt(amount)
  return db.User.findOne({ acno, pswd }).then(
    user => {
      if (user) {
        if (pswd == user.password) {
          user.balance += amnt
          user.transaction.push({
            type: 'credit',
            amount: amount
          })
          user.save()
          return {
            status: true,
            statusCode: 200,
            message: `${amnt} is credited and balance is ${user.balance}`
          }
        }
        else {
          return {
            status: false,
            statusCode: 401,
            message: "Incorrect credentials"
          }
        }
        }
        else {
          return {
            status: false,
            statusCode: 401,
            message: "Incorrect credentials"
          }
        }
      }
    
  )
}

const withdraw = (acno, pswd, amount) => {
  var amnt = parseInt(amount)
  return db.User.findOne({ acno, pswd }).then(
    user => {
      if (user) {
        if (pswd == user.password) {
          if (user.balance > amnt) {
            user.balance -= amnt
            user.transaction.push({
              type: 'debit',
              amount
            })
            user.save()
            return {
              status: true,
              statusCode: 200,
              message: `${amnt} is debited and balance is ${user.balance}`
            }
          }
          else {
            return {
              status: false,
              statusCode: 401,
              message: "insuffient fund"
            }
          }
        }else{
          return {
            status: false,
            statusCode: 401,
            message: "Incorrect credentials"
          }
        }
      }
    }
  )
}

const getTransactions = (acno) => {
  return db.User.findOne({ acno }).then(
    user => {
      return {
        status: true,
        statusCode: 200,
        transactions: user.transaction
      }
    })
}

const deleteACC=(acno)=>{

  return db.User.deleteOne({acno}).then(
    user=>{
      if(user){
        return {
          status: true,
          statusCode: 200,
          message: "Account Deleted"
        }
      } else {
        return {
          status: false,
          statusCode: 401,
          message: "Invalid User Details"
        }
      }
    }
  )

}

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransactions,
  deleteACC
}