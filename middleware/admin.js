const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config")


function adminMiddleware(req,res,next){
    const token = req.headers.authorization &&req.headers.authorization.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const decodeData = jwt.verify(token,JWT_ADMIN_SECRET);
        req.adminId = decodeData.id;
        next();
    }catch(error){
        return res.status(401).json({message: "Invalid token"})
    }
}

module.exports={
    adminMiddleware 
}