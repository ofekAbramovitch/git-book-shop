'use strict'

const KEY = 'books'
const PAGE_SIZE = 3
var gPageIdx = 0
var gFilterBy = { maxPrice: 1000, minRate: 0 }
var gBooks = _createBooks()
var gBooksLength

function _createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || books.length === 0) {
        books = []
        books.push('Book 1', 50)
        books.push('Book 2', 80)
        books.push('Book 3', 100)
        saveToStorage(KEY, books)
    }
    return books
}

function _createBook(name, price, rate = 0) {
    return {
        id: makeId(),
        name,
        price,
        rate,
        imgUrl: _getRandomImg()

    }
}

function createBook(name, price) {
    gBooks.unshift(_createBook(name, price))
    saveToStorage(KEY, gBooks)
}

function getBooks() {
    var books = gBooks.filter(book => book.rate >= gFilterBy && book.price <= gFilterBy.maxPrice)
    gBooksLength = books.length
    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function updateBook(price, bookId) {
    const book = gBooks.find(book => book.id === bookId)
    if (!book) return
    book.price = price
    saveToStorage(KEY, gBooks)
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (bookIdx === -1) return
    gBooks.splice(bookIdx, 1)
    saveToStorage(KEY, gBooks)
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function updateRate(diff, gBookId) {
    const book = gBooks.find(book => book.id === gBookId)
    if (diff === -1 && book.rate === 0 || diff === 1 && book.rate === 10) return
    book.rate += diff
    saveToStorage(KEY, gBooks)
}

function getBookRate(gBookId) {
    return gBooks.find(book => book.id === gBookId).rate
}

function setBookFilter(filterBy = {}) {
    gPageIdx
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    return gFilterBy
}

function nextPage(elNextBtn) {
    document.querySelector('.prev-button').removeAttribute('disabled')
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooksLength) elNextBtn.setAttribute('disabled', '')
    else gPageIdx++
}

function prevPage(elPrevBtn) {
    document.querySelector('.next-button').removeAttribute('disabled')
    if (gPageIdx === 0) elPrevBtn.setAttribute('disabled', '')
    else gPageIdx--
}

function sortBooks(sortBy) {
    gPageIdx
    if (sortBy === 'name') gBooks.sort((book1, book2) => book1.name.localeConpare(book2.name))
    else gBooks.sort((book1, book2) => book1.price - book2.price)
}

function _getRandomImg() {
    const imgs = ['book1', 'book2', 'book3']
    const img = imgs[getRandomIntInclusive(0, 2)]
    return `<img src="img/${img}.jpg">`
}