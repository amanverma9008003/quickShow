import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRight, ClockIcon, ArrowRightIcon } from "lucide-react";
import isoTimeformat from "../lib/isoTimeformat";
import toast from "react-hot-toast";
import {assets} from "../assets/assets";

function SeatLayout(){
    const groupRows =[["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]];
    const {id,date}= useParams();
    console.log(id,date);
    const [selectedSeats,setSelectedSeats]=useState([]);
    const [selectedTime,setSelectedTime]=useState(null);
    const [show,setShow]=useState(null);
    const navigate=useNavigate();

    // load show data for the given id

    const handleSeatClick = (seatId) => {
        if(!selectedTime){
            return toast("Please select a time");
        }
        // prevent selecting more than 4 seats
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= 4) {
            return toast("You can select only 4 seats")
        }
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(item => item!== seatId) : [...prev,seatId])
    }

    const renderSeats = (row, count = 9) => {
        return (
            <div key={row} className="flex gap-2 mt-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: count }, (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const selected = selectedSeats.includes(seatId);
                        return (
                            <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId)}
                                className={`h-10 w-12  items-center justify-center text-sm font-semibold rounded border border-primary/60 cursor-pointer ${selected ? 'bg-primary/100 text-white' : ''}`}>
                                {seatId}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    useEffect(() => {
        const showData = dummyShowsData.find(show => show.id === parseInt(id, 10));
        if (showData) {
            setShow({
                movie: showData,
                dateTime: dummyDateTimeData
            });
        } else {
            console.log('Show not found');
            setShow(null);
        }
    }, [id]);

    return show ?(
        <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
            {/* Available Timings */}
            <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
            
            <p className="text-lg font-semibold px-6">Available Timings</p>
            <div className="mt-5 space-y-1">
                {show.dateTime[date].map((item)=>(
                    <div key={item.time} onClick={()=>setSelectedTime(item.time)} className={`flex items-center gap-2 px-6 py-2 w-max rouded-r-md cursor-pointer transition ${selectedTime===item.time? "bg-primary/100 text-white" : "hover:bg-primary/20"}`} >
                        <ClockIcon className="w-4 h-4" />
                        <p className="text-sm">{isoTimeformat(item.time)}</p>
                    </div>
                ))}
            </div>
            </div>

            {/* Seat Layouts */}
            <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
            <h1 className="text-2xl font-semibold mb-4">Select Your Seat</h1>
            <img src={assets.screenImage} alt="screen" />
            <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

            <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-10 md:gap-2 mb-6">
                        {groupRows[0].map((group, gi) => (
                            <div key={gi} className="space-y-4">
                                {renderSeats(group)}
                            </div>
                        ))}
                    </div>
            

            <div className="grid grid-rows-2 grid-cols-2 gap-11">
                {groupRows.slice(1).map((group, gi) => (
                            <div key={gi} className="space-y-4">
                                {group.map(row => renderSeats(row))}
                            </div>
                        ))}
            </div>

            </div>
            <button onClick={()=>navigate('/my-bookings')} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95">
                Proceed to Checkout
                <ArrowRight strokeWidth={2} className="w-4 h-4" />
            </button>
            </div>
        </div>
    ):(<Loading />)
}

export default SeatLayout;