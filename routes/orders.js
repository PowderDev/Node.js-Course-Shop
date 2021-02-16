const {Router} = require('express')
const Order = require('../models/Order')
const secure = require('../middleware/secure')
const router = Router()


router.get('/',  secure,   async(req, res) =>{
    try{

        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o =>({
                ...o._doc, price: o.courses.reduce((total, current) =>{
                    return total += current.count * current.course.price
                }, 0)
            }))
        })
    } catch(err){
        console.log(err);
    }

})

router.post('/',  secure,  async(req, res) =>{
    try{
        const user = await req.user.populate('cart.items.courseId').execPopulate()
        const courses = user.cart.items.map(c => ({
            count: c.count,
            course: {...c.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')

    }  catch(err){
        console.log(err);
    }


})

module.exports = router