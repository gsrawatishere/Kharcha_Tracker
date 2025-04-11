const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const userRoute = require("./Routes/user")
app.use("/api/v1/user",userRoute)

app.listen(4000,()=>{
    console.log("server is running on port 4000")
})