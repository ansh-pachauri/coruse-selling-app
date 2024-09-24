const {Router} = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config")
const bcrypt = require("bcrypt");
const { z } = require("zod");
const {userMiddleware} = require("../middleware/user")

const userRouter = Router();
const { userModel, purchaseModel, courseModel} =require("../db");
const course = require('./course');



userRouter.post("/login",async (req, res) => {
    const requirebody = z.object({
        email: z.string().email(),
        firstName : z.string().min(4).max(20),
        lastName : z.string().min(4).max(20),
        password: z.string().min(4).max(20)
    });
    
    
    
    const bodyParse =  requirebody.safeParse(req.body);
    console.log( bodyParse );
    


    
    if (!bodyParse.success) {
        res.json({
            message :"Formate is incorrect"
        });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try{
        //hashing the password
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log("Hashed Password: ", hashedPassword); 

    await userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
    });

    return res.json({
        message: "Login successful"
    });
    } catch (err) {
    console.error("Error in processing: ", err); 

    return res.status(500).json({
        message: "An error occurred",
        error: err.message
    });
}
});


userRouter.post("/signin", async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await userModel.findOne({
            email:email,
            password : password
        });
        if(!user){
           return res.status(403).send({"message" : "User not found"});
        }
        //matching the password
        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).send({"message" : "Invalid Password"});
        }
        //generating the token
        const token = jwt.sign({
            _id : user._id.toString(),
            email: user.email
        },JWT_USER_SECRET);

       console.log("token: " + token);

       res.json({
        "message":"Succefully signed",
        token : token
       });
       
    }catch(error){
        console.error("Error during sign-in:", error);
        return res.status(500).json({ error: "Server error" });
    }
    
});

userRouter.get("/purchases",userMiddleware, async(req, res) => {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId: userId
    });
    const courseData = await courseModel.find({
        _id: {$in: purchases.map(p => p.courseId)}
    });


    res.json({
        purchases
    })
});



module.exports ={
    userRouter:userRouter
};