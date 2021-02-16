const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const helmet = require('helmet')
const compression = require('compression')
const homeRoutes= require('./routes/home')
const coursesRoutes= require('./routes/courses')
const addRoutes= require('./routes/add')
const cardRoutes= require('./routes/card')
const ordersRoutes= require('./routes/orders')
const authRoutes= require('./routes/auth')
const profileRoutes= require('./routes/profile')
const mongoose = require('mongoose')
const varMiddleware = require('./middleware/variables') 
const userMiddleware = require('./middleware/user')
const error404Middleware = require('./middleware/error404')
const uploadFileMiddleware = require('./middleware/uploadFile')
const keys = require('./keys')

const server = express()

server.engine('hbs', handlebars({
    defaultLayout: "main",
    extname: 'hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    },
    helpers: require('./utils/hbs-helpers')
  })
)
server.set('view engine', 'hbs')
server.set('views', 'pages')

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_DB_URI
})

server.use(express.static(path.join(__dirname, 'public')))
server.use ( '/images' ,express.static(path.join(__dirname, 'images')))

server.use(express.urlencoded({extended: true}))
server.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

server.use(uploadFileMiddleware.single('avatar'))

server.use(csrf())
server.use(varMiddleware)
server.use(userMiddleware)
server.use(flash())
server.use(compression())


server.use('/', homeRoutes)
server.use('/add', addRoutes)
server.use('/courses', coursesRoutes)
server.use('/card', cardRoutes)
server.use('/orders', ordersRoutes)
server.use('/auth', authRoutes)
server.use('/profile', profileRoutes)




server.use(error404Middleware)

const PORT = process.env.PORT || 3000


async function start(){
    try{
        await mongoose.connect(keys.MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

        server.listen(PORT, () =>{
            console.log(`Server is runnig on port ${PORT} `);
        })

    }catch(err){
        console.log(e);
    }
}


start()


