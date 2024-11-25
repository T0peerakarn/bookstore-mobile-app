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
  yearOfPublication: Int!
  image: String!
  price: Float!
  amount: Int!
}

input CheckoutBooksInput {
  isbn: ID!
  amount: Int!
}

type CheckoutBooksResponse {
  success: Boolean!
  message: String!
  totalPrice: Float!
}

type Record {
  id: ID!
  userId: String!
  books: [Book!]!
  totalPrice: Float!
  createdAt: String!
}

type Query {
  getToken(
    username: String!
    password: String!
  ): String!
  bookCount: Int!
  getAllBooks: [Book!]!
  getBookByISBN(
    isbn: String!
  ): Book!
  getRecords: [Record!]!
  getRecordByRecordId(
    recordId: ID!
  ): Record!
}

type Mutation {
  createUser(
    username: String!
    password: String!
    display: String!
  ): String!
  checkoutBooks(
    checkedOutBooks: [CheckoutBooksInput!]!
  ): CheckoutBooksResponse!
}

`;
