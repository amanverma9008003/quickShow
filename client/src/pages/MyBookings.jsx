import React,{useEffect, useState} from 'react';
import Loading from '../components/Loading';
import  timeFormat  from '../lib/timeFormat.js';
import {dateFormat} from '../lib/Dateformat.js';
import { useAppContext } from '../../context/AppContext.jsx';
function MyBookings(){
    const [bookings,setBooking]=useState([]);
    const [isLoading,setISLoading]=useState(true);
    const {axios,getToken,user}= useAppContext();
        
    const getMyBookings = async () =>{
        try{
            const {data}= await axios.get('/api/bookings/mybookings',{
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            if(data.success){
            setBooking(data.bookings);
            }
        }catch(error){
            console.log(error);
        }
        setISLoading(false);
    }

    useEffect(()=>{
        if(user){
        getMyBookings();
        }
    },[user])

    return !isLoading? (
        <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
            <h1 className='text-lg font-semibold mb-4'>My Bookings Page </h1>
            {bookings.map((booking,index)=>(
                <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rouded-lg mt-4 p-2 max-w-3xl'>
                    <div className='flex flex-col md:flex-row items-center justify-between'>
                        <div className='flex items-center'>
                            <img src={"https://image.tmdb.org/t/p/original" +booking.show.movie.poster_path} alt={booking.show.title} className='w-20 h-20 md:w-24 md:h-24 rounded-lg mr-4' />
                            <div className='flex flex-col p-4'>
                                <p className='text-lg font-semibold'>{booking.show.movie.title}</p>
                                <p className='text-gray-400 text-sm'>{ timeFormat(booking.show.movie.runtime) }</p>
                                <p className='text-gray-400 text-sm mt-auto'>{dateFormat(booking.show.showDateTime)}</p>
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-end p-4'>
                        <p className='text-2xl font-semibold mb-3'>&#8377; {booking.amount}</p>
                        {!booking.isPaid && <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</button>}
                        <div className='text-sm'>
                            <p><span className='text-gray-400'>Total Tickets:</span> {booking.bookedSeats.length}</p>
                            <p><span className='text-gray-400'>Seat Number:</span> {booking.bookedSeats.join(', ')}</p>
                        </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ):<Loading />
}

export default MyBookings;
