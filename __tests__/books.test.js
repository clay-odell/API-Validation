process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

const booksRouter = require("../routes/books");

app.use("/books", booksRouter);

let testBook;

beforeAll(async () => {
  testBook = await Book.create({
    isbn: "1234567890",
    amazon_url: "http://test.com",
    author: "Arthur Test",
    language: "English",
    pages: 404,
    publisher: "Vintage",
    title: "Testing Schema",
    year: 2024,
  });
});

afterAll(async () => {
  await db.query(`DELETE FROM books`);
  await db.end();
});

describe("GET / Route for Books", function () {
  test("Gets all books from database and returns 200", async function () {
    const resp = await request(app).get("/books");

    expect(resp.statusCode).toBe(200);
    const book = resp.body.books[0];

    expect(book.isbn).toEqual(testBook.isbn);
    expect(book.publisher).toEqual("Vintage");
  });
});

describe("GET /books/:id", () => {
  test("Gets a book by usbn and responds with a book object", async () => {
    const resp = await request(app).get(`/books/${testBook.isbn}`);

    expect(resp.statusCode).toBe(200);
    const book = resp.body.book;
    expect(book.isbn).toEqual(testBook.isbn);
    expect(book.author).toEqual(testBook.author);
    expect(book.language).toEqual(testBook.language);
  });
});

describe("POST /books", () => {
  test("Posts a book an responds with book object and status 201", async () => {
    const newBook = {
      isbn: "0987654321",
      amazon_url: "http://test2.com",
      author: "Arthur Testagain",
      language: "English",
      pages: 500,
      publisher: "Penguin",
      title: "Another Schema Test",
      year: 2024,
    };
   
    const resp = await request(app).post("/books").send(newBook);

    expect(resp.statusCode).toBe(201);
    const nBook = resp.body.book;
    expect(nBook.isbn).toEqual(newBook.isbn);
    expect(nBook.author).toEqual(newBook.author);
  });
  test("Attempts to post an invalid book", async () => {
    const invalidBook = {
        "isbn": "123",
        "amazon_url": "http://test.com",
        "author": "Arthur Test",
        "language": "English",
        "pages": "404",
        "publisher": "NoneSuch",
        "title": "Invalid Schema Testing",
        "year": 2024
    };
    const resp = await request(app).post("/books").send(invalidBook);

    expect (resp.statusCode).toBe(400);
    expect(resp.body.message).toBe("Invalid data");
  })
});

