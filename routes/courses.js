const {Router} = require('express')
const Course = require('../models/course')
const secure = require('../middleware/secure')
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
const router = Router()

function isOwner(userId, reqId){
    return userId.toString() === reqId.toString()
}

router.get('/', async (req, res) => {
    try{
        const courses = await Course.find().populate('userId', 'email name')
        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            courses,
            userId: req.user ? req.user._id.toString() : null
        })
    } catch(err){
        console.log(err);
    }
})

router.get('/:id/edit', secure, async (req, res) =>{

    if (!req.query.allow){
        res.redirect('/courses')
        return
    }

    try{
        const course = await Course.findById(req.params.id)

        if (!isOwner(course.userId, req.user._id)){
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title:`Edit/${course.title}`,
            course,
            error: req.flash('errorEdit')
        })
    } catch(err){
        console.log(err);
    }


    router.post('/edit', courseValidators,  secure, async (req, res) =>{
        const {id} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            req.flash('errorEdit', errors.array()[0].msg)
            res.status(422).redirect(`/courses/${id}/edit?allow=true`)
        }

        try{
            delete req.body.id

            if(!isOwner(id, req.user._id)){
                return res.redirect('/courses')
            }

            await Course.findByIdAndUpdate(id, req.body)
            res.redirect('/courses')
        } catch(err){
            console.log(err);
        }


    })

})

router.get('/:id', async (req, res) =>{
    try{
        const course = await Course.findById(req.params.id)

        res.render('course', {
            title: course.title,
            layout: 'coursePage',
            course
        })
    } catch(err){
        console.log(err);
    }

})

router.post('/remove', secure, async (req, res) =>{
    try{
        await Course.deleteOne({
             _id: req.body.id,
             userId: req.user._id
        })
        res.redirect('/courses')
    } catch(err){
        console.log(err);
    }
})


module.exports = router
