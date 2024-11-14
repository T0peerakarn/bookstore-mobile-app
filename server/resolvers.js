import { books } from "./books/data.js";
import { authors } from "./authors/data.js";
import { publishers } from "./publishers/data.js";

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
