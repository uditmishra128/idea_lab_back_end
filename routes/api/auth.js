const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); 


// @route   Get /api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Post /api/auth
// @desc    Authenticate user & get token
// @access  Public

router.post('/', [
    check('email', 'Enter a valid email id').isEmail(),
    check('password', 'Invalid password').exists()    
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try{
        // Check if user exist

        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ errors: [
                {msg: 'Invalid credentials'}
            ] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [
                {msg: 'Invalid credentials'}
            ] });
        }

        // Return json web token

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtToken'),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );     
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;