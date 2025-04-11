const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Expense_Tracker");

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true , "Please provide your name "] ,
        trim : true,
        maxlength : 75
    } ,
   
    username : {
        type : String,
        required : [true , "Please provide a username "] ,
        unique : true,
        trim : true,
        lowercase : true,
        minlength : 3,
        maxlength : 30
        
    },
   
    email : {
        type : String,
        required : [true , "Please provide an Email "],
        lowercase : true,

    },

    password : {
        type : String ,
        required : [true , "Please provide a password "] ,
        minlength : [6 , " Required at least 6 length of password " ]

    }
})

const TransactionSchema = mongoose.Schema({
 
   userId : {
           type : mongoose.Schema.Types.ObjectId ,
           ref : "User" ,
           required : true
   } ,
    
    amount : {
        type : Number ,
        required : true
    },

    title : String ,

    type : {
        type : String,
        enum : ["income","expense"],
        required : true
    },


     date : {
        type : Date,
        default : Date.now
     }

})

const BudgetSchema = mongoose.Schema({
  
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true
} ,
    amount : {
        type : Number,
        required : true ,
        min : 0
    } 
    ,
    income :{
        type : Number
    }
    ,
    expense : {
        type : Number
    }
})


const Budget = mongoose.model("Budget",BudgetSchema)
const Transaction = mongoose.model("Transaction",TransactionSchema)
const User = mongoose.model("User",UserSchema);

module.exports = {User,Transaction,Budget}