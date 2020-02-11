const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../Models/User');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.get('/', (req, res) => {
    res.send('<p>API NodeJS + Express + Mongo</p>');
});

router.get('/register', async (req, res) => {
    try {
        const db_files = await User.find({});
        return res.status(200).send(db_files);
    } catch(err) {
        return res.send('Cannot get access to the database');
    }
})

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' });
        } else {
            const user = await User.create(req.body);

            user.password = undefined;

            return res.send({
                user,
                token: generateToken({ id: user._id })
            });
        }
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user._id })
    });
})



module.exports = router;