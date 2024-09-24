const {Router} = require('express');

const adminRouter = Router();
const {adminModel} = require("../db");
const {courseModel} = require("../db");

const bcrypt = require("bcrypt");
const { z } = require("zod");
const {JWT_ADMIN_SECRET} = require("../config")
const jwt  = require("jsonwebtoken");
const {adminMiddleware} = require("../middleware/admin")



adminRouter.post("/login", async(req, res) => {
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

    await adminModel.create({
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


adminRouter.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const admin = await adminModel.findOne({
            email:email,
            //password : password
        });
        console.log(admin);
        
        if(!admin){
           return res.status(403).send({"message" : "User not found"});
        }
        //matching the password
        const isMatch = bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(401).send({"message" : "Invalid Password"});
        }
        //generating the token
        const token = jwt.sign({
            _id : admin._id.toString(),
            email: admin.email
        },JWT_ADMIN_SECRET);

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

adminRouter.post("/course",adminMiddleware, async(req, res) => {
    const adminId =  req.adminId;
    const {title,description, imageUrl, price} = req.body;
    const course = await courseModel.create({
        title:title,
        description : description,
        imageUrl:imageUrl,
        price:price,
        creatorId : adminId
    })

    res.json({
        "message" : "Course Created",
        courseId : course._id
    })
});

adminRouter.put("/course",adminMiddleware, async(req, res) => {
    const adminId =  req.adminId;
    const {title,description, imageUrl, price,courseId} = req.body;
    const course = await courseModel.updateOne({
        _id : courseId,
        creatorId:adminId
    },{
        title:title,
        description : description,
        imageUrl:imageUrl,
        price:price,
        
    })

    res.json({
        "message" : "Course Updated",
        courseId : course._id
    })
});


adminRouter.get("/courses/bulk",adminMiddleware,async (req, res) => {
    const adminId =  req.adminId;
    const {title,description, imageUrl, price} = req.body;
    const course = await courseModel.find({
        creatorId : adminId
    })

    res.json({
        "message" : "Course get",
        courseId : course._id
    })
});


module.exports ={
    adminRouter:adminRouter
};