import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Movies from "./pages/Movies.jsx";
import SeatLayout from "./pages/SeatLayout.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Favourites from "./pages/Favourite.jsx";
import {Toaster} from "react-hot-toast";
import  Layout  from "./pages/admin/Layout";
import  Dashboard  from "./pages/admin/Dashboard";
import  AddShow   from "./pages/admin/AddShow";
import  ListShows  from "./pages/admin/ListShows";
import  ListBooking  from "./pages/admin/ListBooking";
import { useAppContext } from "../context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";

function App(){
  const isAdminRoute=useLocation().pathname.startsWith("/admin");
  
  const {user} = useAppContext();
  //console.log(user);
  return (
    <>
      <Toaster />
      { !isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/admin/*" element={user ? <Layout /> : (<div className="min-h-screen flex justify-center items-center">Please sign in to access this page: <SignIn fallbackRedirectUrl={'/admin'} /> </div>)} >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShow />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBooking />} />
        </Route>
      </Routes>
      { !isAdminRoute && <Footer />}
    </>
  )
}

export default App;