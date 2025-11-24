import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

const checkSeatAvailability = async (showId,selectedSeats) => {
    try{
        const show = await Show.findById(showId);
        if(!show){
            return false;
        }
        const occupiedSeats= showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    }catch(err){
        console.log(err);
        return false;
    }
}

export const createBooking = async (req,res) => {
    try{
        const {userId} = req.auth();
        const {showId,selectedSeats} = req.body;
        const {origin}=req.headers;

        //check if the seat is available or not
        const isAvailable = await checkSeatAvailability(showId,selectedSeats);
        if(!isAvailable){
            return res.json({success:false,message:"Some of the seats are already taken"})
        }

        // get all show data

        const showData = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice*selectedSeats.length,
            bookingSeats: selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        return res.json({success:true,message:"Booking created successfully"});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}

export const getOccupiedSeats = async (req,res) => {
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);
        return res.json({success:true,occupiedSeats});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }

}