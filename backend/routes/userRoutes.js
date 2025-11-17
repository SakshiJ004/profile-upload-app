const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a profile picture' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
        let user = await User.findOne({ email });

        if (user) {
            user.name = name;
            user.profilePicture = fileUrl;
            await user.save();
        } else {
            user = await User.create({
                name,
                email,
                profilePicture: fileUrl,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
});

router.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;