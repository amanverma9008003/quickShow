import React,{useState} from "react";
import { useParams } from "react-router-dom";
import { StarIcon,Heart, PlayCircleIcon  } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/dateSelect";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function MovieDetails(){
    const {id} =useParams();
    const [show,setShow]=useState(null);
    const navigate=useNavigate();
    const {shows,axios,getToken,user,fetchFavouriteMovies, favouriteMovies}= useAppContext();
    
    const getShow = async ()=>{
        try{
            const {data} = await axios.get(`/api/show/${id}`);
            if(data.success){
                setShow(data);
            }
        }catch(error){
            console.log("MovieDetails.js:getShow:error",error);
            toast.error("Error fetching show details in moviedetails getShow");
        }
    }

    const handleFavourite = async ()=>{
        try{
            //toast.success("clicked")
            if (!user) return toast.error("You need to sign in to add to favourite");
            const token= await getToken();
            const {data} = await axios.post('/api/user/update-favourite',{movieId:id}, {headers: {Authorization: `Bearer ${token}`}});
            if(data.success){
                await fetchFavouriteMovies()
                toast.success(data.message)
            }
        }catch(error){
            console.log(error);
            toast.error("Error adding to favourite");
        }
    }
    React.useEffect(() => {
        getShow();
    }, [id]);
    
    if(!show || !show.movie){
        return (<div className=" px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
        <Loading />
        </div>)
    }
    return(
        <div className=" px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <img src={"https://image.tmdb.org/t/p/original" +show.movie.poster_path} alt={show.movie.title} className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"/>
                <div className="relative flex flex-col gap-3">
                    <p className="text-primary">ENGLISH</p>
                    <h1 className="text-4xl font-semibold max-w-96 text-balance">
                        {show.movie.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-300">
                        <StarIcon className="text-red-500 fill-primary" />
                        {show.movie.vote_average.toFixed(1)}User Rating
                    </div>
                    <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{show.movie.overview}</p>
                    <p>{timeFormat(show.movie.runtime)} * {show.movie.genres.map( genre =>genre.name).join(",")}*{show.movie.release_date.split("-")[0]}</p>
                    
                    <div className="flex items-center flex-wrap gap-4 mt-4">
                        <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
                            <PlayCircleIcon className="w-5 h-5"/>Watch Trailer</button>
                        <a href="#dateSelect" onClick={()=>navigate('#dateSelect')} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">Buy Tickets</a>
                        <button onClick={handleFavourite} className=" items-center  px-3 py-3 rounded-full gap-2  bg-gray-800 hover:bg-gray-900  transition cursor-pointer active:scale-95"> <Heart className={`w-5 h-5 ${favouriteMovies.find(movie => movie._id === id) ? "fill-primary text-primary" : " " }`} /></button>
                        
                    </div>
                </div>
            </div>

            <p className="text-lg font-medium mt-20">Your Favourite Cast</p>
            <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
                <div className="flex items-center gap-4 w-max px-4">
                    {show.movie.casts.slice(0,12).map((cast,index)=>(
                        <div key={index} className="flex items-center gap-2 w-max px-4">
                            <img src={"https://image.tmdb.org/t/p/original" +cast.profile_path} alt={cast.name} className="w-14 h-15 rounded-full object-cover"/>
                            <p className="text-gray-400 text-sm">{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DateSelect dateTime={show.dateTime} id={id} />

            <p className="text-lg font-medium mt-20 mb-8">You may also like</p>
            <div className="grid grid-cols-2 gap-4">
                {shows.slice(0,4).map((show,index)=>(
                    <MovieCard key={index} movie={show} />
                ))}
            </div>
            <div className="flex justify-center mt-10">
                <button onClick={()=>{navigate('/movies'); scrollTo(0,0)}} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">Show more</button>
            </div>
        </div>
    )
}

export default MovieDetails;