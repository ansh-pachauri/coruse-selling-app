const express = require("express");

const app = express();



const {userRouter} =require("./routes/user.js");
const {courseRouter} =require("./routes/course.js");
const {adminRouter} =require("./routes/admin.js");
const { default: mongoose } = require("mongoose");

app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);



async function main() {
    await mongoose.connect("mongodb+srv://admin:2bbr9DG03sdYoQQT@cluster0.hnft8.mongodb.net/course-selling-app");
    app.listen(3000);
    console.log("listen to port 3000");
    

    
}

main();