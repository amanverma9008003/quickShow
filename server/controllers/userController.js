import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req,res)=>{
    try{
        const user = req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1})
        res.json({success:true,bookings})
    }catch(err){
        res.json({success:false,error:err.message})
    }
}

export const addFavourite = async (req,res)=>{
    try{
        const {movieId} = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId);
        if (!user.privateMetadata.favourites){
            user.privateMetadata.favourites=[]
        }

        if (!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId);
        }else{
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(id=>id!==movieId)
        }

        await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata})
        res.json({success:true, message:"Favourite added successfully"})
    }catch(err){
        console.log(err);
        res.json({success:false, message:err.message})
    }
}

export const getFavourites = async (req,res)=>{
    try{
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);
        const favourites = user.privateMetadata.favourites;
        const movies = await Movie.find({_id:{$in:favourites}});
        res.json({success:true, movies})
    }catch(err){
        console.log(err);
        res.json({success:false, message:err.message})
    }
}