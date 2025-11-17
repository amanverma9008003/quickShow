import React, { useState, useEffect } from 'react';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon } from 'lucide-react';
// import the main react-player build (some bundlers/Vite configs can't resolve the '/lazy' subpath)

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer]=useState(dummyTrailers[0]);

    // Normalize common YouTube URL formats to a consistent embeddable URL
    const normalizeYouTube = (url) => {
        if (!url || typeof url !== 'string') return url;
        try {
            const u = new URL(url);
            // youtu.be short links
            if (u.hostname.includes('youtu.be')) {
                const id = u.pathname.slice(1);
                return `https://www.youtube.com/embed/${id}`;
            }

            // youtube.com -- extract v= param or /watch or /embed
            if (u.hostname.includes('youtube.com')) {
                // if already an embed url, return as-is
                if (u.pathname.startsWith('/embed/')) return url;
                const v = u.searchParams.get('v');
                if (v) return `https://www.youtube.com/embed/${v}`;
                // fallback: last path segment
                const parts = u.pathname.split('/').filter(Boolean);
                const last = parts[parts.length - 1];
                if (last) return `https://www.youtube.com/embed/${last}`;
            }
        } catch {
            // not a valid URL, return original
            return url;
        }

        return url;
    }

    useEffect(() => {
        const normalized = currentTrailer?.videoUrl ? normalizeYouTube(currentTrailer.videoUrl) : null;
       // console.log('TrailerSection currentTrailer:', currentTrailer);
       // console.log('TrailerSection normalized videoUrl:', normalized);
    }, [currentTrailer]);

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <h2 className='text-3xl font-bold mb-8'>Trailer</h2>
            <div className='relative mt-6'>
                {currentTrailer && currentTrailer.videoUrl ? (
                    <div className='mx-auto' style={{maxWidth: 960}}>
                        <div style={{position: 'relative', paddingTop: '56.25%'}}>
                            <iframe
                                src={normalizeYouTube(currentTrailer.videoUrl)}
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                            />
                        </div>
                    </div>
                ) : (
                    <p className='text-center text-gray-500'>No trailer available</p>
                )}
            </div>
            <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto' >
                {dummyTrailers.map((trailer) => (
                    <div key={trailer.image} className='relative group-hover:not-hover:opacity-50 hover:translate-y-1 duration 300 transition max-md:h-60 md:max-h-60 curser-pointer' onClick={()=>setCurrentTrailer(trailer)}>
                        
                        <img src={trailer.image} alt="trailer" className='rounded-lg w-full h-full object-cover brightness-75' />
                        <PlayCircleIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition duration-300' size={64} />
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrailerSection;