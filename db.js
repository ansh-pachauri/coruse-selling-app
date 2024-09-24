const mongoose = require('mongoose');


console.log("moongoes Connected");

mongoose.connect('mongodb+srv://admin:2bbr9DG03sdYoQQT@cluster0.hnft8.mongodb.net/course-selling-app');

//defining schemas

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    //_id : ObjectId,
    email: {type: String,unique :true},
    password: String,
    firstName: String,
    lastName: String,
});

const CourseSchema = new Schema({
   // _id : ObjectId,
    title : String,
    description: String,
    price : Number,
    imageUrl : String,
    creatorId : String 
});

const AdminSchema = new Schema({
    //_id: ObjectId,
    email: {type: String,unique :true},
    password:String,
    firstName: String,
    lastName: String,
});

const PurchaseSchema =  new Schema({
    //_id: ObjectId,
    courseId: ObjectId,
    userId : ObjectId
});

const userModel = mongoose.model("user",UserSchema);
const adminModel = mongoose.model("admin",AdminSchema);

const courseModel = mongoose.model("course",CourseSchema);
const purchaseModel = mongoose.model("purchase",PurchaseSchema);

module.exports=  {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,

}

