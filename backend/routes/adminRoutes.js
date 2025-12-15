const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Create security user (admin only)
router.post('/create-security', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check duplicate email
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Admin({
            name,
            email,
            password: hashedPassword,
            role: "security"
        });

        await newUser.save();
        
        res.json({ message: "Security user created successfully!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
