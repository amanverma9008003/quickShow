import { model } from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import stripe from 'stripe';
import { getAuth } from '@clerk/express';

const checkSeatAvailability = async (showId,selectedSeats) => {
    try{
        const show = await Show.findById(showId);
        if(!show){
            return false;
        }
        const occupiedSeats= show.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    }catch(err){
        //console.log("bookingController:checkSeatAvailability",err.message);
        return false;
    }
}

export const createBooking = async (req,res) => {
    try{
        const { userId } = getAuth(req);
        //console.log(userId, getAuth(req));

        const {showId,selectedSeats} = req.body;
        const {origin}=req.headers;
        
        console.log(selectedSeats);
        //check if the seat is available or not
        const isAvailable = await checkSeatAvailability(showId,selectedSeats);
        if(!isAvailable){
            return res.json({success:false , message:"Some  of the seats are already taken"})
        }

        // get all show data

        const showData = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice*selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();
        
        //Stripe payment link creation
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        
        const line_items = [{
            price_data:{
                currency:'inr',
                product_data:{
                    name:showData.movie.title
                },
                unit_amount: Math.floor(booking.amount)*100
            },
            quantity:1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-ookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                bookingId: booking._id.toString()
            },
            expires_at:Math.floor(Date.now()/1000)+30*60, //expires in 30 min
        })
        booking.paymentLink = session.url;
        await booking.save();
        
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })
        
        res.json({success:true,url:session.url});
    }catch(err){
        //console.log(err);
        res.json({success:false,message:`createBooking: ${err.message}`})
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        // Guard: check for valid showId
        //console.log("showId", showId);
        if (!showId || typeof showId !== 'string' || showId === 'undefined') {
            return res.status(400).json({ success: false, message: 'Show ID is required and must be valid.' });
        }
        const showData = await Show.findById(showId);
        if (!showData) {
            return res.status(404).json({ success: false, message: 'Show not found.' });
        }
        const occupiedSeats = Object.keys(showData.occupiedSeats || {});
        res.json({ success: true, occupiedSeats });
    } catch (err) {
        //console.log(err);
        res.json({ success: false, message: `getOccupiedSeats: ${err.message}` });
    }
};