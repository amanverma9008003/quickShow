import React, { useState, useEffect } from'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import {dateFormat} from '../../lib/Dateformat'
import { useAppContext } from '../../../context/AppContext';

const ListShows = () => {
    const {axios , getToken, user} = useAppContext();
    const [shows, setShows]=useState([]);
    const [loading, setLoading]=useState(true);
    
    const getAllShows = async () => {
        try{
            const {data}=await axios.get('/api/admin/all-shows',{headers:{Authorization: `Bearer ${ await getToken()}`}});
            //nconsole.log(data.shows);
            setShows(data.shows);
            setLoading(false);
        }
        catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        if(user){
        getAllShows();
        }
    }, [user]);

    return !loading ?(
    <>
        <Title text1='List' text2='Shows' />
        <div className='max-w-4xl mt-6 overflow-x-auto'>
            <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                <thead>
                    <tr className='bg-primary/20 text-left text-white'>
                        <th className='p-2 font-medium pl-5'>Movie Name</th>
                        <th className='p-2 font-medium'>Show Time</th>
                        <th className='p-2 font-medium'>Total Bookings</th>
                        <th className='p-2 font-medium'>Earnings</th>
                    </tr>
                </thead>
                <tbody className='text-sm font-light'>
                    {shows.map((show,index)=>(
                        <tr key={index} className='border-b border-gray-200 bg-primary/5 even:bg-priary/10'>
                            <td className='p-2 pl-5'>{show.movie.title}</td>
                            <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                            <td className='p-2'>{/*(Object.keys(show.occupiedSeats).length)*/ '0'}</td>
                            <td className='p-2'>&#8377;{show.showPrice }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    ):<Loading />
}

export default ListShows