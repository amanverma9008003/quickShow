import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React,{useState} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime,id }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate=useNavigate();

    const onBookHandler = () => {
        if(!selectedDate){
            return toast("Please select a date")
        }
        navigate(`/movies/${id}/${selectedDate}`)
    }
    return (
        <div id="dateSelect" className="pt-30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-lg font-semisolid">Choose Date</p>
            <ChevronLeftIcon width={28} />
            <span className=" grid grid-cols-3 md:flex items-center space-between gap-2 flex-wrap md:max-w-lg text-sm font-light">
                {Object.keys(dateTime).map((date)=>(
                <button key={date} className={`flex flex-col items-center justify-center gap-2 aspect-square rounded-md bg-primary/10 py-2 px-4 text-sm font-light hover:bg-primary/20 cursor-pointer ${selectedDate===date ? "bg-primary/20 text-white" :"border border-primary/20" }`} onClick={()=>setSelectedDate(date)}>
                    <span>{new Date(date).getDate()}</span>
                    <span>{new Date(date).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
                </button>
            ))}</span>
            <ChevronRightIcon width={28} />
            <button  onClick={onBookHandler} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">Book Now</button>
            </div>


        </div>
    )

}

export default DateSelect;