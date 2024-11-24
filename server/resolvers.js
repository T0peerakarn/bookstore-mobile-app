import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  mockedBooks,
  mockedAuthors,
  mockedPublishers,
  mockedUsers,
  mockedRecords,
} from "./data.js";

import { formatDate } from "./utils/date.js";

let books = [...mockedBooks].map((book) => ({ ...book, likedBy: [] }));
let authors = [...mockedAuthors];
let publishers = [...mockedPublishers];
let users = [...mockedUsers];
let records = [...mockedRecords];

const validateUserId = (userId, message) => {
  if (!userId) {
    throw new GraphQLError(message, {
      extensions: {
        code: 401,
      },
    });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: 404,
      },
    });
  }
};

export const resolvers = {
  Query: {
    getToken: async (_, { username, password }) => {
      const user = users.find(
        (user) => user.username.toLowerCase() === username.toLowerCase()
      );

      if (!user) {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: 401,
          },
        });
      }

      const match = await bcrypt.compare(password, user.hashedPassword);
      if (!match) {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: 401,
          },
        });
      }

      return jwt.sign(user.id, process.env.JWT_SECRET);
    },
    bookCount: () => books.length,
    getAllBooks: () => books.map((book) => ({ ...book, liked: false })),
    getBookByISBN: (_, { isbn }, { userId }) => {
      validateUserId(userId, "Please sign in before accessing the data");

      const book = books.find((book) => book.isbn === isbn);
      return { ...book, liked: book.likedBy.includes(userId) };
    },
    getRecords: (_root, _args, { userId }) => {
      validateUserId(userId, "Please sign in before accessing your records");

      return records.filter((record) => record.userId === userId);
    },
    getRecordByRecordId: (_, { recordId }, { userId }) => {
      validateUserId(userId, "Please sign in before accessing your records");

      const record = records.find((record) => record.id === recordId);

      if (!record) {
        throw new GraphQLError("Record not found", {
          extensions: {
            code: 404,
          },
        });
      }

      if (record.userId != userId) {
        throw new GraphQLError(
          "You don't have permission to access this record",
          {
            extensions: {
              code: 403,
            },
          }
        );
      }

      return record;
    },
    getAllLikedBooks: (_root, _args, { userId }) => {
      validateUserId(userId, "Please sign in before accessing your books");

      return books.filter((book) => book.likedBy.includes(userId));
    },
  },
  Mutation: {
    createUser: (_, { username, password, display }) => {
      if (
        users.find(
          (user) => user.username.toLowerCase() === username.toLowerCase()
        )
      ) {
        throw new GraphQLError("Username must be unique", {
          extensions: {
            code: 409,
          },
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = { username, hashedPassword, display, id: uuidv4() };
      users = users.concat(newUser);

      return jwt.sign(newUser.id, process.env.JWT_SECRET);
    },
    checkoutBooks: (_, { checkedOutBooks }, { userId }) => {
      validateUserId(userId, "Please sign in before checking out the books");

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

      const totalPrice = checkedOutBooks.reduce((acc, cur) => {
        const book = books.find((b) => b.isbn === cur.isbn);
        books = books.map((b) =>
          b.isbn === cur.isbn ? { ...b, amount: b.amount - cur.amount } : b
        );
        return acc + book.price * cur.amount;
      }, 0);

      records = records.concat({
        id: uuidv4(),
        userId,
        books: checkedOutBooks,
        totalPrice,
        createdAt: new Date(),
      });

      return {
        success: true,
        message: "Checkout successful",
        totalPrice: totalPrice,
      };
    },
    toggleLike: (_, { isbn }, { userId }) => {
      validateUserId(userId, "Please sign in before like/unlike the book");

      const book = books.find((book) => book.isbn === isbn);

      let found = false,
        result;

      books = books.map((book) => {
        if (book.isbn != isbn) {
          return book;
        }

        found = true;
        result = !book.likedBy.includes(userId);

        return {
          ...book,
          likedBy: result
            ? book.likedBy.concat(userId)
            : book.likedBy.filter((id) => id != userId),
        };
      });

      if (!found) {
        throw new GraphQLError("Book not found", {
          extensions: {
            code: 404,
          },
        });
      }

      return result;
    },
  },
  Book: {
    authors: (parent) =>
      authors.filter((author) => parent.authorId.includes(author.id)),
    publishers: (parent) =>
      publishers.filter((publisher) => parent.authorId.includes(publisher.id)),
    image: (parent) => parent.imageL,
  },
  Author: {
    books: (parent) =>
      books.filter((book) => book.authorId.includes(parent.id)),
  },
  Publisher: {
    books: (parent) =>
      books.filter((book) => book.authorId.includes(parent.id)),
  },
  Record: {
    books: (parent) =>
      parent.books.map((book) => ({
        ...books.find((b) => b.isbn === book.isbn),
        amount: book.amount,
      })),
    createdAt: (parent) => formatDate(parent.createdAt),
  },
};
