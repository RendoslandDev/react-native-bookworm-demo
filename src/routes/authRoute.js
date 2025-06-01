import express from 'express';

import User from '../models/User.js';
const router = express.Router();

const generateToken = (userId) => {
    // Implement your token generation logic here
    // For example, using JWT:
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
    // Placeholder for demonstration
};


router.get('/register', async(req, res) => {
    try {
        const {email, username, password } = req.query;
        if (!username ||!email || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });

        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        if(username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

    //    const existingUser = await User.findOne({ $or:[{email}]});
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const profileImage = `https://api.dicebear.com/7.x/avataars/svg?seed=${username}`; // Default profile image URL

        const newUser = new User({
            username,
            email,
            password,
            profileImage,
        });


        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });


const token = generateToken(newUser._id);

    res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
        token,
    });
    } catch (error) {

        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});
router.get('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
        user:
{                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
}
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
