import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import  User  from "../models/User.js";


export const isAdmin = async (req,res)=>{
    res.json({success:true, isAdmin: true})
}

export const getDashboardData = async (req,res)=>{
    try{
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime:{$gte: new Date()}}).populate('movie');

        const totalUser=await User.countDocuments();
        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue: bookings.reduce((acc,booking )=> acc + booking.amount,0),
            activeShows,
            totalUser
        }

        res.json({success:true, dashboardData})
    }catch(err){
       // console.log("getDashboardData: ", err)
        res.json({success:false, error:`getDashboardData: ${err.name}`})
    }
}

export const getAllShows = async (req,res)=>{
    try{
        const shows = await Show.find({showDateTime:{$gte: new Date()}}).populate('movie').sort({showDateTime:1});
        res.json({success:true, shows})
    }catch(err){
        //console.log("getAllShows: ", err)
        res.json({success:false, error: `getAllShows: ${err.name}`})
    }
}

export const getAllBookings = async (req,res)=>{
    try{
        const bookings = await Booking.find({}).populate('user').populate({
            path:"show",
            populate: {path: "movie"}
        }).sort({createdAt:-1});
        
        res.json({success:true, bookings})
    }catch(err){
        // console.log("getAllBookings: ", err)
        res.json({success:false,message:`getAllBookings: ${err.message}`})
    }
}