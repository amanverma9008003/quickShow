import express from 'express';
import { getNowPlayingMovies, addShow, getShows, getShow } from '../controllers/showController.js';
import  protection  from '../middleware/auth.js';
const showRouter = express.Router();

showRouter.get('/now-playing', getNowPlayingMovies);//protection,

showRouter.post('/add',protection,addShow);//,protection

showRouter.get('/all',getShows);

showRouter.get('/:movieId',getShow);

export default showRouter;