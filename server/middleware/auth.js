import { clerkClient } from "@clerk/express";

const protection = async(req,res,next)=>{
    try{
        const {userId} =req.auth();
        console.log('User Id:',userId,"isAuthentication",req.auth());
        const user =await clerkClient.users.getUser(userId);
        if(user.privateMetadata.role !='admin')
        {
            console.log('You are not a valid admin');
            return res.json({successs:false,message:'You are not a valid admin'});
        }
        console.log('You are authorized to access this resource');
        next();
    }catch(err){
        console.log(err)
        return res.json({successs:false,message:'You are not authorized to access this resource'});
    }
}

export default protection;