const express = require("express");
const app = express.Router()
const {User,Transaction,Budget} = require("../Database")
const {userMiddleware} = require("../Middleware/index")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
const zod = require("zod")
const bcrypt = require("bcrypt")
const {zoduserSignup, zodTransaction} = require("../zod/index")


app.post("/signup",async (req,res)=>{
    try{
        const validateData =   zoduserSignup.safeParse(req.body)
        if(!validateData.success){
            return res.status(400).json({
                msg : "  Error in Signup!",
                errors : validateData.error.errors.map(e=>e.message),
            })
        }
         const {name, username, email, password} = validateData.data

        const existUser = await User.findOne({username : username})
        if(existUser) {
            return res.status(401).json({msg : "Username Already Exists! "})
        }
        const hashedPassword = await bcrypt.hash(password,12);

        const newUser = await User.create({
            name,
            username,
            email,
            password : hashedPassword
        })
        const userId = newUser._id
        const budget = await Budget.create({
            userId : userId ,
             amount : 0
          })

        res.json({msg : "Signup Success!" , username : newUser.username})
             
    }
    catch(error){
        console.log("Error in signup route",error)
        res.status(400).json({msg : "Error in signup route",error})
    }
})

app.post("/signin",async (req,res)=>{
    try{
           const {username, password} = req.body
           const user = await User.findOne({username : username})

           if(!user){
            return res.status(400).json({msg : "Username not found"})
           }
           const isMatch = await bcrypt.compare(password,user.password)
           if(!isMatch) {
            return res.status(400).json({msg : "Invalid Password"})
           }
          const token = jwt.sign({username : user.username},JWT_SECRET)
          res.status(200).json({msg : "Login Success!" , token : token}) 
       
    }
    catch(error){
        console.log("Error in signin route")
        res.status(400).json({msg : "Error in signin router" , error})
    }
})

const zodNum = zod.number().min(0,"Invalid Amount")

app.post("/budget",userMiddleware, async (req,res)=>{
    try{
          const amount = req.body.amount
          const validateAmount = zodNum.safeParse(amount)
          if(!validateAmount.success){
            return res.status(400).json({msg : " Validation Error!", errors : validateAmount.error.errors.map(e=>e.message)})
          }
          const finalamount = validateAmount.data;
         const budget = await Budget.updateOne({ userId : req.userId},
            {$inc : { amount : finalamount , income : finalamount} }
          
         )
    
         res.status(200).json({msg : "Amount Credited Successfully!" })

    }
    catch(error){

    }
})

app.post("/transaction",userMiddleware,async (req,res)=>{
    try{
          const validateData = zodTransaction.safeParse(req.body)
          
          if(!validateData.success){
            return res.status(400).json({
                msg : "Zod validation Error in Transaction",
                errors : validateData.error.errors.map(e=>e.message)
            })
          }
         const {amount,title,type} = validateData.data;

         const budget = await Budget.findOne({userId : req.userId})
         if (!budget) {
            return res.status(404).json({ msg: "Budget not found!" });
          }

         if(type === "expense" && amount>budget.amount){
            return res.status(400).json({msg : "Insufficient Balance!"})
         }

         if(type==="expense"){
            const budget = await Budget.updateOne({userId : req.userId},
                {$inc : {amount : -amount, expense : amount}})
         }
          else if(type==="income"){
            const budget = await Budget.updateOne({userId : req.userId},
                {$inc : {amount : amount, income : amount}})
          }
         
         const transaction = await Transaction.create({
            userId : req.userId,
            amount : amount,
            title : title,
            type : type
         })

         
         res.json({msg : "Transaction Success !" ,data : transaction})
    }
    catch(error){
          console.log(error)
            res.json({error})
    }
})

app.get("/amountdetails",userMiddleware,async (req,res)=>{
    try{
        const response = await Budget.findOne({userId : req.userId})
        
        res.json({
           amount : response.amount,
           income : response.income,
           expense : response.expense
        })
    }
    catch(error){
        console.log(error)
    }
})

app.get("/alltransactions",userMiddleware,async(req,res)=>{
    try{
       const response = await Transaction.find({userId : req.userId})
       res.json({
        data : response.map(transaction =>({
            amount : transaction.amount,
            title : transaction.title,
            type : transaction.type,
            date : transaction.date
        }))
       })

    }
    catch(error){
        console.log(error)
    }
})

module.exports = app 