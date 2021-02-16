const keys = require('../keys')

module.exports = function(email){
    return {
                to: email,
                from: keys.EMAIL_FROM,
                subject: 'Регистрация прошла успешно',
                html: `
                    <h1>Добро пожаловать в наш магазин</h1>
                    <p>Вы успешно создали аккаунт</p>
                    <hr />
                    <a href=${keys.SITE_URL}>Магазин курсов</a>
                ` 
            }
}