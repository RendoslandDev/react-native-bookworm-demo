import express from 'express';
import "dotenv/config";
import authRoutes from './routes/authRoute.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import bookRouter from './routes/bookRoutes.js';
import job from './lib/cron.js';
const app = express();
const PORT = process.env.PORT || 3002;

// 1. First establish database connection
connectDB();

// 2. Middleware setup (ORDER MATTERS!)
app.use(cors()); // ✅ CORS first
app.use(express.json()); // ✅ Then JSON parser
app.use(express.urlencoded({ extended: true }));

// 3. Start cron job
job.start();

// 4. Routes (after all middleware)
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });
