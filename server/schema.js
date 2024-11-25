export const typeDefs = `

type Author {
  id: ID!
  name: String!
  books: [Book!]!
}

type Publisher {
  id: ID!
  name: String!
  books: [Book!]!
}

type Book {
  isbn: ID!
  title: String!
  authors: [Author!]!
  publishers: [Publisher!]!
  price: Float!
  amount: Int!
}

type User {
  id: ID!
  username: String!
  hashedPassword: String!
  display: String!
}

input CheckoutBooksInput {
  isbn: ID!
  amount: Int!
}

type CheckoutBooksResponse {
  success: Boolean!
  message: String!
  totalPrice: Float
}

type Record {
  id: ID!
  userId: String!
  books: [Book!]!
  totalPrice: Float!
  createdAt: String!
}

type Query {
  bookCount: Int!
  getAllBooks: [Book!]!
  getBookByISBN(
    isbn: String!
  ): Book
  getAuthentication(
    username: String!
    hashedPassword: String!
  ): ID
  getRecords: [Record!]!
  getRecordByRecordId(
    recordId: ID!
  ): Record
}

type Mutation {
  createUser(
    username: ID!
    hashedPassword: String!
    display: String!
  ): User
  checkoutBooks(
    checkedOutBooks: [CheckoutBooksInput!]!
  ): CheckoutBooksResponse!
}

`;
