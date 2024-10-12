const inputEl = document.getElementsByClassName('app__controls-input')[0]
const btnEl = document.getElementsByClassName('app__controls-button')[0]
const listEl = document.getElementsByClassName('app__list')[0]
let counter = 1
let data = []
const BASE_URL = 'http://127.0.0.1:3000/tasks'


//API
async function getItemsApi() {
    const res = await fetch(BASE_URL, {
        method: 'GET'
    })
    if (!res.ok) {
        console.log('oh no, no data');
        return
    }
    data = await res.json()
}

// POST 
async function createTaskApi(data) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
            text: data.text,
            isDone: data.isDone
        })
    }) 
    if (!res.ok) {
        console.log('oh no, no data');
        return
    }
    return await res.json()
}

// PATCH
async function changeStatusApi(id) {
    const res = await fetch(BASE_URL, {
        method: 'PATCH',
        body: JSON.stringify({
            id
        })
    })
    if (!res.ok) {
        console.log('oh no, no change');
        return
    }
    return await res.json()
}

// DELETE 
async function deleteApi(id) {
    const res = await fetch(BASE_URL, {
        method: 'DELETE',
        body: JSON.stringify({
            id
        })
    })
    console.log('delete_api - ok')
    if (!res.ok) {
        console.log('oh no, no delete');
        return
    }
    return
}



// APP
async function init() {
    // const tmp = localStorage.getItem('data')
    // if (tmp !== null) {
    //     data = JSON.parse(tmp)
    // }
    // data.forEach((item) => {
    //     if (item.id > counter) {
    //         counter = item.id
    //     }
    // })
    // if (counter > 1) {
    //     counter++
    // }
    await getItemsApi()
    render()
}

async function deleteById(id) { // Удаление обычное
    const idx = await data.findIndex((i) => {
        return i.id === id
    })
    const item = await deleteApi(id)
    data[idx] = item
    render()
}

// function syncData() {
//     localStorage.setItem('data', JSON.stringify(data))
//     render()
// }

async function changeStatusById(id) {
    const item = await changeStatusApi(id)
    const idx = data.findIndex((i)=>{
        return i.id === id
    })
    data[idx] = item
    // const item = data.find((i) => {
    //     return i.id === id
    // })
    // item.isDone = !item.isDone
    // syncData()
    render()
}

function createTask(objectData) {
    const root = document.createElement('div')
    root.classList.add('app__list-item')

    if (objectData.isDone === true) {
        root.classList.add('app__list-item_done')
    }

    root.addEventListener('click', ()=>{
        data.isDone != data.isDone
        console.log('lol');
    })

    const input = document.createElement('input')
    input.classList.add('app__list-checkbox')
    if (objectData.isDone) {
        input.checked = true
    }
    input.type = 'checkbox'

    const txt = document.createElement('label')
    txt.classList.add('app__list-item-text')
    txt.innerText = objectData.text

    const btn = document.createElement('button')
    btn.classList.add('app__list-btn')

    const img = document.createElement('img')
    img.src='./Vector.svg'
    img.alt = 'trash'

    btn.appendChild(img)
    root.appendChild(input)
    root.appendChild(txt)
    root.appendChild(btn)

    btn.addEventListener('click', (event) => { // Кнопка удаления
        event.stopPropagation(); // Чтоб не накладывался changestatus и delete
        deleteById(objectData.id)
        console.log(objectData.id)
        console.log('event - ok')
        render()
    })
    
    root.addEventListener('click', () => {
        changeStatusById(objectData.id)
    })
    return root
}


btnEl.addEventListener('click', async ()=>{
    const textValue = inputEl.value
    // data.push({
    //     id: counter++,
    //     text: textValue,
    //     isDone: false
    // })
    // syncData()
    const item = await createTaskApi({
        text: textValue,
        isDone: false
    })
    data.push(item)
    inputEl.value = ''
    render()
})


function render() {
    listEl.innerHTML = ''
    for(let item of data) {
        const tmpElement = createTask(item)
        listEl.appendChild(tmpElement)
    }
}

init()

