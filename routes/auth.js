const {Router} = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const node_mailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const { registerValidators, loginValidators } = require('../utils/validators')
const router = Router()

const transporter = node_mailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async(req, res) =>{
    res.render('auth/login',{
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error'),
        errLog: req.flash('errLog')
    })
})

router.get('/logout', async(req, res) =>{
    req.session.destroy(() => {
        res.redirect('/')
    })
    
})

router.get('/reset', (req, res) =>{
    res.render('auth/reset', {
        title:'Забыли пароль?',
        error: req.flash('errorReset')
    })
})

router.get('/password/:token', async (req, res) =>{
    if (!req.params.token){
        return res.redirect('/auth/login')
    }

    try{
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        }) 

        if (!user){
            return res.redirect('/auth/login')
        } else{
            res.render('auth/password', {
                title:'Задать пароль',
                error: req.flash('errorPassword'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch(err){
        console.log(err);
    }

})

// =================================================================

router.post('/login', loginValidators,  async(req, res) =>{
    try{

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errLog', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }

        const condidate = await User.findOne({ email: req.body.email })

        req.session.user = condidate
        req.session.isAuthenticated = true
        req.session.save(err =>{
            if (err) throw err
            res.redirect('/')
        })

    } catch(err){
        console.log(err);
    }
    const user = await User.findById('60254a9fc30b254f402f6f94')

})

router.post('/register', registerValidators, async(req, res) =>{
    try{
        const {email, password, name} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })
        await user.save()
        const condidate = await User.findOne({ email })
            req.session.user = condidate
            req.session.isAuthenticated = true
            req.session.save(err =>{
                if (err) throw err
                res.redirect('/')
            })
        await transporter.sendMail(regEmail(email))
        


    } catch(err){
        console.log(err);
    }
})

router.post('/reset', (req, res) =>{
    try{
        crypto.randomBytes(32, async (err, buffer) =>{
            if (err){
                req.flash('errorReset', 'Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const condidate = await User.findOne({email: req.body.email})

            if (condidate){
                condidate.resetToken = token
                condidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await condidate.save()
                await transporter.sendMail(resetEmail(condidate.email, token))
                res.redirect('/auth/login')
                req.flash('errLog', 'Письмо было отправлено на почту')
            } else{
                req.flash('errorReset', 'Такой почты нет')
                res.redirect('/auth/reset')
            }
        })
    } catch(err){
        console.log(err);
    }
})

router.post('/password', async (req, res) =>{
    try{
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined,
            user.resetTokenExp = undefined,
            await user.save()
            res.redirect('/auth/login')
        } else{
            res.redirect('/auth/login')
            req.flash('errLog', 'Время жизни токена истекло')
        }


    } catch(err){
        console.log(err);   
    }
})


module.exports = router