import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL =import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({children})=>{

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows,setShows] = useState([])
    const [favouriteMovies,setFavouriteMovies] = useState([])
    const {user} = useUser()

    //console.log(isSignedIn, user, isLoaded)
    const {getToken} = useAuth()
    const location = useLocation();
    const navigate = useNavigate()

    //console.log(userId, sessionId, getToken, isLoaded, isSignedIn);

    const fetchIsAdmin = async ()=>{
        try{
            const token = await getToken();
            //console.log('Clerk token:', token);
            const {data} = await axios.get(`/api/admin/is-admin`, {headers: {Authorization: `Bearer ${token}`}});
            console.log(data)
            setIsAdmin(data.isAdmin);
            
            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/');
                toast.error('You are not authorized to admin dashboard');
            }
        }catch(err){
            console.log(err.message);
        }
    }

    const fetchShows = async ()=>{
        try{
            
            const {data} = await axios.get('/api/show/all');
            console.log(data);
            if(data.success){
            setShows(data.shows);
            }
            else{
                toast.error(data.message);
            }
        }catch(err){
            console.log(err);
        }
    }

    const fetchFavouriteMovies = async ()=>{
        try{
            const token = await getToken()
            const {data} = await axios.get('/api/user/favourites',{headers: {Authorization: `Bearer ${token}`}});//, {headers: {Authorization: ` ${ await getToken() }`}}
            console.log(data);
            if(data.success){
            setFavouriteMovies(data.movies);
            }
            else{
                toast.error(` AppcontextbfetcchFavouriteMovies: ${data.message}`);
            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchShows();
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin();
            fetchFavouriteMovies();
        }
    },[user])

    const value = { axios,
        fetchIsAdmin,
        fetchShows,
        fetchFavouriteMovies,
        isAdmin, user , getToken, navigate, shows, favouriteMovies
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext =() =>useContext(AppContext);