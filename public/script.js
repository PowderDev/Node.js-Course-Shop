function priceFunc(){
    document.querySelectorAll('.price').forEach(item =>{
    item.textContent = new Intl.NumberFormat('ru-Ru', {
        currency: 'rub',
        style: 'currency'
    }).format(item.textContent)
})
}

const toData = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toData(node.textContent)
})


const $card = document.querySelector('#card')

if ($card){
    $card.addEventListener('click', e =>{
        if(e.target.classList.contains('js-remove')){
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf

            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
            .then(res => res.json())
            .then(card => {
                
                if (card.courses.length){
                    const html = card.courses.map(course =>{
                        const {courseId} = course

                        return `
                            <tr>
                                <td>${courseId.title}</td>
                                <td>${course.count}</td>
                                <td class="price min">${courseId.price}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${courseId._id}">Удалить</button>
                                </td>
                            </tr>
                        
                        `
                    }).join('')
                    $card.querySelector('tbody').innerHTML = html
                    $card.querySelector('.pr').textContent = card.price
                    priceFunc()
                } else{
                    $card.innerHTML = '<p>Корзина пуста</p>'
                }
            })

        }
    })
}

priceFunc()

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));


