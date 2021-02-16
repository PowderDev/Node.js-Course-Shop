if (process.env.NODE_ENW === 'production'){
    module.exports = require('./keys-prod')
} else{
    module.exports = require('./keys-dev')
}