const {Router} = require('express')
const Course = require('../models/course')
const secure = require('../middleware/secure')
const router = Router()

function computePrice(courses){
    return courses.reduce((total, course) =>{
        return total += course.courseId.price * course.count
    }, 0)
}

function coursesFunc(courses){
    courses.forEach(course =>{
        course.courseId.price = course.courseId.price * course.count
    })
    return courses
}


router.post('/add', secure,  async (req, res) =>{
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course) 
    res.redirect('/card') 
})

router.delete('/remove/:id', secure,  async (req, res) =>{
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items
    const cart = {
        price: computePrice(courses),
        courses: coursesFunc(courses)
    }
    
    res.status(200).json(cart)
})

router.get('/', secure, async(req, res) =>{
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items

    res.render('card', {
        title: 'Shoping card',
        price: computePrice(courses),
        courses: coursesFunc(courses),
        isCard: true
    })
})


module.exports = router
