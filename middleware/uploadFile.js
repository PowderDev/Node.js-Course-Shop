const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'images')
    },
    filename(req, file, cb){
        cb(null, new Date().toISOString + '-' + file.originalname)
    }
})

const alowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg']

const fileFilter = (req, file, cb) =>{
    if (alowedTypes.includes(file.mimetype)){
        cb(null, true)
    } else{
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})