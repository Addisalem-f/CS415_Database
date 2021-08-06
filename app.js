/**
 * app.js
 * 
 * @author Addisalem
 * @since 2021-08-05
 */
const { MongoClient } = require("mongodb");

let conn = null;

// MongoDB Database connection url
const dbUrl = "mongodb://localhost:27017";
// Database name
const dbName = "Books-Db";

async function main() {
    conn = await MongoClient.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("Connected successfully to MongoDB Server...");
    const db = conn.db(dbName);
    const booksColl = db.collection("booksColl");
    // Perform Database operations
    let books = await getBooks(booksColl);
    // console.log(books);
    books.forEach(book => console.log(book));


    // Add a new book
    // const newBook = {
    //     "isbn": "978-999999",
    //     "book-title": "Introduction to Algorithm",
    //     "overdue-fee": 1.99,
    //     "publisher": "Heinemann Press",
    //     "date-published": "2021-05-31"
    // };
    // console.log(await addNewBook(booksColl, newBook));
    // const newBook = {
    //     "isbn": "111111111111",
    //     "book-title": "Introduction to DB",
    //     "overdue-fee": 6.0,
    //     "publisher": "Addisalem",
    //     "date-published": "2021-05-31"
    // };
    // console.log(await addNewBook(booksColl, newBook));

    // Update an existing book
    const filter = { "isbn": "978-999999" };
    const newTitle = "Introduction to Algorithm, 2nd Edition";
    console.log(await updateBook(booksColl, filter, newTitle));


    // Retrieve the updated book
    console.log(await getBookByISBN(booksColl, "978-999999"));

    // Delete the book
    const bookToDeleteFilter = { "isbn": "978-999999" };
    console.log(await deleteBook(booksColl, bookToDeleteFilter));

    // Fetch all books once again
    books = await getBooks(booksColl);
    // console.log(books);
    books.forEach(book => console.log(book));

    return "operations completed";


}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => { if (!conn) conn.close(); })
const getBooks = async function (collection) {
    const qryResultBooks = await collection.find({}).toArray();
    return qryResultBooks;
};

const addNewBook = async function (collection, newBook) {
    const insertResult = await collection.insertOne(newBook);
    return insertResult;
};

const updateBook = async function (collection, filter, newTitle) {
    const updateResult = await collection.updateOne(filter, { $set: { "book-title": newTitle } });
    return updateResult;
};



const getBookByISBN = async function (collection, isbn) {
    const book = await collection.findOne({ "isbn": isbn });
    return book;
};

const deleteBook = async function (collection, filter) {
    const deleteResult = await collection.deleteOne(filter);
    return deleteResult;
};
