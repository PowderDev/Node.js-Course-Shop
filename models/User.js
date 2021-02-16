const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    avatarURL: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

user.methods.addToCart = function(course){
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    if(idx >= 0){
        clonedItems[idx].count++
    } else{
        clonedItems.push({
            count: 1,
            courseId: course._id
        })
    }

    this.cart = {items: clonedItems}
    return this.save()
}

user.methods.removeFromCart = function(id){
    let cloneItems = [...this.cart.items]
    const idx = cloneItems.findIndex(c => c.courseId.toString() === id.toString())

    if(cloneItems[idx].count == 1){
        cloneItems = cloneItems.filter(c => c.courseId.toString() !== id.toString())
    } else{
        cloneItems[idx].count--
    }

    this.cart = {items: cloneItems}
    return this.save()
}

user.methods.clearCart = function(){
    this.cart = {items: []}
    return this.save()
}


module.exports = model('User', user)