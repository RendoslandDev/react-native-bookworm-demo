import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import protectedRoute from '../middleware/auth.js';
const router = express.Router();
import Book from '../models/book.js'; // Assuming you have a Book model defined

router.post('/',protectedRoute, async(req, res) => {
   try {
    const {title , caption, image, rating, user} = req.body;
    if (!title || !caption || !image || !rating || !user) {
        return res.status(400).json({ message: 'All fields are required' });
    }

   const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'book_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    });
    const imageUrl = uploadResponse.secure_url;
    const imagePublicId = uploadResponse.public_id;

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

router.get('/:id', protectedRoute, async (req, res) => {
    try {

const page = req.query.page || 1;
const limit = req.query.limit || 5;

 const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'username profileImage').exec();
 res.send({
    books,
    currentPage: page,
    totalPages: Math.ceil(await Book.countDocuments() / limit),
    totalBooks: await Book.countDocuments(),
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
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to delete this book' });
        }
        if(book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {

                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
            }
            // await cloudinary.uploader.destroy(book.imagePublicId);
        }



        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }});


export default router;
