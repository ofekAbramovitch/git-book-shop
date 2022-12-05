'use strict'

var gBookId

function onInit() {
    filterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    if (books.length === 0) return document.querySelector('.books-container').innerHTML = ''
    renderByTable(books)
}

function renderByTable(books) {
    var strHTML = `<table><caption><button class="create" onclick="onCreateBook()">Create new book</button></caption>
    <thead><tr><td>Id</td><td onclick="onSortBooks('name')">Title</td><td onclick="onSortBooks('price')">Price</td>
    <td>Rate</td><td colspan="3">Action</td></tr></thead><tbody>`
    const keys = Object.keys(books[0])
    keys.pop()
    const strHTMLs = books.reduce((acc, book) => {
        acc.push('<tr>')
        acc.push(keys.map(key => `<td>${book[key]}</td>`).join(''))
        acc.push(`<td><button class="read" onclick="onReadBook('${book.id}')">Read</button></td>`)
        acc.push(`<td><button class="update" onclick="onUpdateBook('${book.id}')">Update</button></td>`)
        acc.push(`<td><button class="delete" onclick="onDeleteBook('${book.id}')">Delete</button></td></tr>`)
        return acc
    }, [])
    strHTML += strHTMLs.join('')
    document.querySelector('.books-container').innerHTML = strHTML + '</tbody></table>'
}



function onCreateBook() {
    const name = prompt('Enter a book name')
    const price = +prompt('Enter a book price')
    if (name && price) {
        createBook(name, price)
        renderBooks()
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    gBookId = book.id
    elModal.querySelector('h2 .name').innerText = book.name
    elModal.querySelector('h2 .id').innerText = book.id
    elModal.querySelector('h2 .price').innerText = book.price
    elModal.querySelector('.rate').innerText = book.rate
    elModal.querySelector('.img-div').innerHTML = book.imgUrl
    elModal.classList.add('open')
}

function onUpdateBook(bookId) {
    const price = +prompt('Enter new price')
    updateBook(price, bookId)
    renderBooks()
}

function onDeleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return
    deleteBook(bookId)
    renderBooks()
}

function onUpdateRate(elBtn) {
    const diff = elBtn.innerText === '+' ? 1 : -1
    updateRate(diff, gBookId)
    document.querySelector('.rate').innerText = getRateBook(gBookId)
    renderBooks()
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
}

function onFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onPrevPage(elBtn) {
    prevPage(elBtn)
    renderBooks()
}

function onNextPage(elBtn) {
    nextPage(elBtn)
    renderBooks()
}

function filterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || '',
        minRate: +queryStringParams.get('minRate') || 0
    }
    if (!filterBy.maxPrice && !filterBy.minRate) return
    document.querySelector('.filter-maxPrice').value = filterBy.maxPrice
    document.querySelector('.filter-minRate').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onSortBooks(sortBy) {
    sortBooks(sortBy)
    renderBooks()
}

