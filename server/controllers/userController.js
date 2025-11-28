import { clerkClient, getAuth  } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.status(401).json({ success: false, message: "User is not authenticated." });
        }
        const bookings = await Booking.find({ user: userId }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        console.log("userController.getUserBookings", err);
        res.json({ success: false, message: `getUserBookings failed:${err.message}` });
    }
};

export const addFavourite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = getAuth(req);
        console.log("addfavourite", userId, movieId);
        if (!userId) {
            return res.json({ success: false, message: "User is not authenticated." });
        }

        const user = await clerkClient.users.getUser(userId);
        if (!user.privateMetadata.favourites) {
            user.privateMetadata.favourites = [];
        }

        if (!user.privateMetadata.favourites.includes(movieId)) {
            user.privateMetadata.favourites.push(movieId);
        } else {
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(id => id !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata });
        res.json({ success: true, message: "Favourite updated successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: `addfavourite failed: ${err.message}` });
    }
};

export const getFavourites = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        console.log("getfavourites", userId, getAuth(req));
        if (!userId) {
            return res.json({ success: false, error: "Unauthorized: No user ID found in get favourites request." });
        }

        const user = await clerkClient.users.getUser(userId);
        const favourites = user.privateMetadata.favourites;
        const movies = await Movie.find({ _id: { $in: favourites } });
        res.json({ success: true, movies });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: `getFavourites failed: ${err.message}` });
    }
};