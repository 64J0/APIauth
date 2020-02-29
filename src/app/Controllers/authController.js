const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

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
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user._id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            to: email,
            from: 'diego@rocketseat.com.br',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err) {
                return res.status(400).send({ error: 'Erro on forgot password, try again' });
            }

            return res.send();
        });

    } catch(err) {
        console.log(err);
        res.status(400).send({ error: 'Error on forgot password, try again' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid' });
        }

        const now = new Date();
        if (now > user.passwordResetExpires) {
            return res.status(400).send({ error: 'Token expired, generate a new one' });
        }

        user.password = password;

        await user.save();

        res.send();

    } catch(err) {
        res.status(400).send({ error: 'Cannot reset passwrod, try again' });
    }
});



module.exports = router;