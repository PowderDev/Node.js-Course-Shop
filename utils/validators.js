const { body } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.registerValidators = [
    body('email')
    .isEmail().withMessage('Введите корректный Email')
    .custom( async (value, req) =>{
        try{
            const user = await User.findOne({ email: value })
            if (user){
                return Promise.reject('Пользователь с таким Email уже существует')
            }
        } catch(err){
            console.log(err);
        }
    })
    .normalizeEmail(),
    body('password', 'Введите корректный пароль')
    .isLength({min: 6, max: 32})
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value, {req}) =>{
        if (value !== req.body.password){
            throw new Error('Пароли должны совпадать')
        }
        return true
    })
    .trim(),
    body('name', 'Имя должно быть минимум 3 символа')
    .isLength({min: 3, max: 12})
    .trim()
]

exports.loginValidators  = [
    body('email')
    .isEmail().withMessage('Введите корректный Email')
    .custom( async (value, req) =>{
        try{
            const user = await User.findOne({ email: value })
            if (!user){
                return Promise.reject('Пользователя с таким Email не существует')
            }
        } catch(err){
            console.log(err);
        }
    }),
    body('password')
    .custom(async (value, req) =>{
        try{
            const user = await User.findOne({ email: req.req.body.email })
            const areSame = await bcrypt.compare(value, user.password)
            if (!areSame){
                return Promise.reject('Не верный пароль')
            }
        } catch(err){

        }
    })
]

exports.courseValidators = [
    body('title').isLength({min: 3, max: 32 }).withMessage('Минимальная длина названия 3 символа, максимальная 32 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body("image", 'Введите корректный url картинки').isURL()
]