import React from 'react';
import { assets } from '../assets/assets';
import { ArrowRight, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    return(
        <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center min-h-screen'>
            <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20' />
            <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold'>Guardians <br/> of the Galaxy</h1>

            <div className='flex items-center gap-4 text-gray-300'>
                <span>Action | Adventure | Sci-Fi</span>
                <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-5 h-5' />2018
                </div>
                <div className='flex items-center gap-1'>
                    <ClockIcon className='w-5 h-5' />2h 8min
                </div>
            </div>
            <p className='text-gray-300 text-lg md:text-2xl'>Marvel Studios presents the Guardians of the Galaxy, a new adventure for the entire family.</p>
            <button onClick={()=> navigate('/movies')} className='flex items-center gap-2 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 cursor-pointer'>Watch Trailer<ArrowRight className='w-5 h-5'/></button>
        </div>
        
    )
}

export default HeroSection;