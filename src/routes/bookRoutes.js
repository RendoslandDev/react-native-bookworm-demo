import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import protectedRoute from '../middleware/auth.js';
const router = express.Router();
import Book from '../models/book.js';

router.post('/',protectedRoute, async(req, res) => {
   try {
    const {title , caption, image, rating} = req.body;
    if (!title || !caption || !image || !rating ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

   const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;


    const newBook = new Book({
        title,
        caption,
        image:imageUrl,
        rating,
        user:req.user._id
    });


    await newBook.save();
    res.status(201).json({
        message: 'Book created successfully',
        book: newBook,
    });

   } catch (error) {

    console.log("Error creating book ", error);
    res.status({message:error.message})
   }
});

// const response =  await fetch("http://localhost:3002/api/books?page=3&limit=5");

router.get('/', protectedRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5 ;
        const skip = (page-1) * limit

const books = await Book.find()
.sort({createdAt: -1})
.skip(skip)
.limit(limit)
.populate("user", "username profileImage")


   const totalBooks = await Book.countDocuments();
res.send({
    books,
    currentPage:page,
    totalBooks:Math.ceil(totalBooks / limit)
});

    } catch (error) {

        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/user', protectedRoute, async (req, res) => {

    try {
        const userId = req.user._id;
        const books = await Book.find({ user: userId }).sort({ createdAt: -1 }).populate('user', 'username profileImage').exec();
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

delete router.delete('/:id', protectedRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({message:"Book not found"})
            if(book.user.toString() !== req.user._id.toString())
                return res.status(401).json({message:Unauthorized})

        await book.deleteOne();
        res.json({message:"Book deleted successsfully"})
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }});


export default router;
