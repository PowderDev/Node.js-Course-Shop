const {Router} = require('express')
const secure  = require('../middleware/secure')
const User = require('../models/User')
const router = Router()

router.get('/', secure, async(req, res) =>{
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', secure,  async(req, res) =>{
    try{
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name
        }

        if (req.file){
            toChange.avatarURL = '/' + req.file.path
        }

        if (req.body.avatarTextURL){
            toChange.avatarURL = req.body.avatarTextURL
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch(err){
        console.log(err);
    }
})


module.exports = router