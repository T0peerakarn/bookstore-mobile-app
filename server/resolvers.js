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
    getBookByISBN: (_, { isbn }) => books.find((book) => book.isbn === isbn),
    getAuthentication: (_, { username, hashedPassword }) => {
      const user = users.find(
        (user) =>
          user.username === username && user.hashedPassword === hashedPassword
      );

      return user ? user.id : null;
    },
  },
  Mutation: {
    createUser: (_, args) => {
      if (users.find((user) => user.username === args.username)) {
        throw new GraphQLError("Username must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const newUser = { ...args, id: uuidv4() };
      users = users.concat(newUser);

      return newUser;
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
