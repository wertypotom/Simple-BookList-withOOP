class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI {
    static displayBooks() {
        const books = Store.getBooks()

        books.forEach((book) => {
            UI.addBookToList(book)
        })
    }

    static addBookToList(book) {
        const bookList = document.querySelector('#book-list')

        const row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        bookList.appendChild(row)
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }

    static deleteBook(targetEl) {
        if (targetEl.classList.contains('delete')) {
            targetEl.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))

        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')

        container.insertBefore(div, form)

        setTimeout(() => {
            document.querySelectorAll('.alert').forEach(el => el.remove())
        }, 2000)
    }
}

class Store {
    static getBooks() {
        const books = !!localStorage.getItem('books') 
            ? JSON.parse(localStorage.getItem('books')) 
            : []

        return books
    }

    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks()

        const leftBooks = books.filter(book => book.isbn !== isbn)

        localStorage.setItem('books', JSON.stringify(leftBooks))
    }
}
 
class Events {
    constructor() {
        this.init()
    }

    init() {
        this.displayBooks()
        this.addBookToList()
        this.deleteBook()
    }

    displayBooks() {
        document.addEventListener('DOMContentLoaded', UI.displayBooks)
    }

    addBookToList() {
        document.querySelector('#book-form').addEventListener('submit', (e) => {
            e.preventDefault()
            const title = document.querySelector('#title').value
            const author = document.querySelector('#author').value
            const isbn = document.querySelector('#isbn').value

            if (!title || !author || !isbn) {
                UI.showAlert('Please fill all fields', 'danger')
                return 
            }
        
            const book = new Book(title, author, isbn)

            Store.addBook(book)
            UI.addBookToList(book)
            UI.clearFields()
            UI.showAlert('Book added', 'success')
        })
    }

    deleteBook() {
        document.querySelector('#book-list').addEventListener('click', (e) => {
            UI.deleteBook(e.target)

            Store.removeBook(e
                .target
                .parentElement
                .previousElementSibling
                .textContent
            )

            UI.showAlert('Book removed', 'success')
        })
    }
}


new Events()