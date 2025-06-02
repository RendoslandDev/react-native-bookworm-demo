import jwt from "jsonwebtoken";
import User from "../models/User.js"
import express from 'express'


const app = express();
app.use(express.json());


const protectedRoute = async(req, res,next) =>{
    try {

  const token = req.headers("Authentication").replace("Bearer", '');
  if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });}

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        req.user = user;
        next();

    } catch (error) {

        console.error('Error in protected route middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export default protectedRoute;
