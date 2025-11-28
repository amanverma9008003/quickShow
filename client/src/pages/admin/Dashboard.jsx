import { ChartLineIcon, PlayCircleIcon, ReceiptIndianRupee, StarIcon, UserIcon } from 'lucide-react';
import { useState,useEffect } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import {dateFormat} from "../../lib/Dateformat";
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';
const Dashboard = () => {
    
    const {axios , getToken , user} = useAppContext();

    const [dashboardData, setDashboardData]=useState({
        totalBookings:0,
        totalRevenue:0,
        activeShows:[],
        totalUser:0
    })

    const [loading,setLoading]=useState(true);

    const dashboardCards=[
        {title:"Total Bookings", value:dashboardData.totalBookings || "0", icon:ChartLineIcon},
        {title:"Total Revenue", value:`${dashboardData.totalRevenue}` || "0", icon:ReceiptIndianRupee},
        {title:"Active Shows", value:dashboardData.activeShows.length || "0", icon:PlayCircleIcon},
        {title:"Total Users", value:dashboardData.totalUser || "0", icon:UserIcon}
    ]

    const fetchDashboardData = async ()=>{
        try{
            const {data} = await axios.get('/api/admin/dashboard', {headers: {Authorization: `Bearer ${ await getToken()}`}});
            if(data.success){
                setDashboardData(data.dashboardData);
                setLoading(false);
            }
            else{
                toast.error(dashboardCards, ` "dashboard": ${data.message}`);
            }
        }
        catch(error){
            console.log("dashboard error",error);
            toast.error("Something went wrong in dashboard",error);
        }
        
    }

    useEffect(()=>{
        if(user){
            fetchDashboardData();
        }
        
    },[user]);

    return !loading ? (
        <>
        <Title text1='Admin' text2='Dashboard' />
        <div className='relative flex flex-wrap justify-center items-center mt-10'>
            <div className='flex flex-wrap gap-4 w-full'>
            {dashboardCards.map((card,index)=>(
                <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <h3 className='text-xl font-bold'> {card.value}</h3>
                        <p className='text-sm text-gray-500'>{card.title}</p>
                    </div>
                    <card.icon className='w-12 h-12 text-gray-500' />
                </div>
            ))}
            </div>
        </div>
        <p className='mt-10 text-lg font-medium'>Active Shows</p>
        <div className='relative flex fex-wrap gap-6 mt-4 max-w-5xl'>
            {dashboardData.activeShows.map((show)=>(
                <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
                    <img src={"https://image.tmdb.org/t/p/original"+show.movie.poster_path} alt={show.movie.title} className='w-full h-60 object-cover' />
                    <p className='p-2 truncate font-medium'>{show.movie.title}</p>
                    <div className='flex items-center justify-between px-2'>
                        <p className='text-lg font-medium'>&#8377; {show.showPrice}</p>
                        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                            <StarIcon className="w-4 h-4 text-primary fill-primary" />
                            {show.movie.vote_average.toFixed(1)}
                        </p>
                    </div>
                    <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(show.showDateTime)}</p>
                </div>
            ))}
        </div>
        </>
    ):<Loading />
}

export default Dashboard