import { books, authors, publishers } from "./data.js";

export const resolvers = {
  Query: {
    bookCount: () => books.length,
    getBookByISBN: (_, { isbn }) => books.find((book) => book.isbn === isbn),
  },
  Book: {
    authors: (parent) =>
      authors.filter((author) => parent.authorId.includes(author.id)),
    publishers: (parent) =>
      publishers.filter((publisher) => parent.authorId.includes(publisher.id)),
  },
  Author: {
    books: (parent) =>
      books.filter((book) => book.authorId.includes(parent.id)),
  },
  Publisher: {
    books: (parent) =>
      books.filter((book) => book.authorId.includes(parent.id)),
  },
};
