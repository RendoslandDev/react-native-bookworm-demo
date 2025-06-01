import express from 'express';
import "dotenv/config";
import authRoutes from './routes/authRoute.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import bookRouter from './routes/bookRoutes.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use("/api/auth",authRoutes)
app.use("/api/books",bookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });
    app.use(cors());
