import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useAppContext } from '../../context/AppContext';

const FeaturedSection = () =>{
    const navigate = useNavigate();

    const {shows}=useAppContext()
    //console.log(shows)
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

            <div className='relative flex item-center justify-between pt-20 pb-10'>
                <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
                <button onClick={() => navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300' >View All
                    <ArrowRight className="group-hover:animate-pulse" />
                </button>
            </div>

            <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
                {shows.slice(0, 4).map((show) => (
                    <MovieCard key={show._id} movie={show} />)
                )}
            </div>
            
            <div className='flex justify-center mt-20'>
                <button onClick={() => navigate('/movies')} className='px-10 py-3 text-sm text-white bg-red-500 rounded-md hover:bg-red-600'>Show More</button>
            </div>
        </div>
    )
}

export default FeaturedSection;