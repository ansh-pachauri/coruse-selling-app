const {Router} = require('express');

const courseRouter = Router();
const {userMiddleware} = require("../middleware/user")


courseRouter.post("/purchase",userMiddleware,async (req, res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    })
    res.json({
        message: "Wow! you have succefully a member from now"
    })
});



courseRouter.get("/preview",async (req, res) => {
    const courses = await courseModel.find({});
    res.json({
       courses
    })
});

module.exports = {
    courseRouter:courseRouter
};