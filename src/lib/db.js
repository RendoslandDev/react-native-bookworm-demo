import mongoose from 'mongoose';



export async function connectDB  (){
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
