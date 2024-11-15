import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

import {
  mockedBooks,
  mockedAuthors,
  mockedPublishers,
  mockedUsers,
} from "./data.js";

let books = [...mockedBooks];
let authors = [...mockedAuthors];
let publishers = [...mockedPublishers];
let users = [...mockedUsers];

export const resolvers = {
  Query: {
    bookCount: () => books.length,
    getAllBooks: () => books,
    getBookByISBN: (_, { isbn }) => books.find((book) => book.isbn === isbn),
    getAuthentication: (_, { username, hashedPassword }) => {
      const user = users.find(
        (user) =>
          user.username.toLowerCase() === username.toLowerCase() &&
          user.hashedPassword === hashedPassword
      );

      return user ? user.id : null;
    },
  },
  Mutation: {
    createUser: (_, args) => {
      if (
        users.find(
          (user) => user.username.toLowerCase() === args.username.toLowerCase()
        )
      ) {
        throw new GraphQLError("Username must be unique", {
          extensions: {
            code: 409,
          },
        });
      }

      const newUser = { ...args, id: uuidv4() };
      users = users.concat(newUser);

      return newUser;
    },
    checkoutBooks: (_, { checkedOutBooks }, { userId }) => {
      if (!userId) {
        throw new GraphQLError("Please sign in before checking out the books", {
          extensions: {
            code: 401,
          },
        });
      }

      if (
        checkedOutBooks.some((book) => {
          const bookDb = books.find((b) => b.isbn === book.isbn);
          return !bookDb || bookDb.amount < book.amount;
        })
      ) {
        throw new GraphQLError("The books to be checked out are invalid", {
          extensions: {
            code: 400,
          },
        });
      }

      return {
        success: true,
        message: "Checkout successful",
        totalPrice: checkedOutBooks.reduce((acc, cur) => {
          const book = books.find((b) => b.isbn === cur.isbn);
          books = books.map((b) =>
            b.isbn === cur.isbn ? { ...b, amount: b.amount - cur.amount } : b
          );
          return acc + book.price * cur.amount;
        }, 0),
      };
    },
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
