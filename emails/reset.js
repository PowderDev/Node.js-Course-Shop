const keys = require('../keys')

module.exports = function(email, token){
    return {
                to: email,
                from: keys.EMAIL_FROM,
                subject: 'Ввостановить пароль',
                html: `
                    <h1>Забыли пароль?</h1>
                    <p>Если нет, то проигнорируйте это письмо</p>
                    <p>Иначе нажмите на ссылку ниже:</p>
                    <a href="${keys.SITE_URL}/auth/password/${token}">Сбросить пароль</a>
                    <hr />
                    <a href=${keys.SITE_URL}>Магазин курсов</a>
                ` 
            }
}