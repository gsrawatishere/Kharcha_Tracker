const z = require("zod");

const zoduserSignup = z.object({
    name : z.string().min(1," Invalid Name "),
    username : z.string().min(3,"Required Min length of usernme is 3"),
    email : z.string().email("Invalid Email"),
    password : z.string().min(6,"Required Min length of password is 6")
})

const zodTransaction = z.object({
    amount : z.number().min(0,"Invalid Amount"),
    title : z.string().optional(),
    type : z.enum(["income","expense"]),

})

module.exports = {zoduserSignup, zodTransaction}