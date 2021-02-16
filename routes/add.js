const {Router} = require('express')
const Course = require('../models/course')
const secure = require('../middleware/secure')
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
const router = Router()

router.get('/', secure, (req, res) =>{
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    })
})

router.post('/', secure, courseValidators, async (req, res) =>{
    const {title, price, image} = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(422).render('add', {
            title: 'Add courses',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title,
                price,
                image
            }
        })
    }

    const course = new Course({
        title,
        price,
        image,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch(e){
        console.log(e);
    }


})



module.exports = router