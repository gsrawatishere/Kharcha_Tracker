const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
const {User} = require("../Database")

const userMiddleware = async (req,res,next)=>{
     try{
           const token = req.headers.authorization
           if(!token){
            return res.status(401).json({msg : "Token not found Access Denied! "})
           }
           const data = jwt.verify(token,JWT_SECRET)
           const username = data.username

           const user = await User.findOne({username : username})
           if(user) {
            req.userId = user._id;
            next()
           }
           else {
            return res.status(403).json({msg : "user not found Access Denied!"})
           }
     }
     catch(error) {
        console.log("Error in middleware",error)
        res.status(500).json({msg : "Error in middleware",error})
     }
}

module.exports = {userMiddleware}