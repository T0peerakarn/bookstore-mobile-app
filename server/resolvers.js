import { books, authors, publishers } from "./data.js";

export const resolvers = {
  Query: {
    bookCount: () => books.length,
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
