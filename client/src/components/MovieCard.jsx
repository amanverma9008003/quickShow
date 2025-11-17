import { StarIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';

const MovieCard = ({movie}) => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col justify-between p-2 bg-gray-100 rounded-lg hover:-translate-y-1 hover:shadow-lg'>
            <img onClick={() =>{navigate(`/movies/${movie._id}`); window.scrollTo(0,0) }} src={movie.backdrop_path} alt="" className='rounded-lg h-70 w-80 object-cover object-right-bottom cursor-pointer' />
        
            
            <p className='font-semibold mt-2 truncate' >{movie.title}</p>
            <p className='text-sm text-gray-400 mt-2'>
                {new Date(movie.release_date).getFullYear()} * {movie.genres.slice(0,2).map(genre =>genre.name).join(" | ")} * {timeFormat(movie.runtime)}
            </p>

            <div className='flex items-center justify-between mt-4 pb-3'>
                <button onClick={() =>{navigate(`/movies/${movie._id}`); window.scrollTo(0,0) }} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>Buy Tickets</button>
                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    )

}

export default MovieCard;