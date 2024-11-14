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

type Query {
  bookCount: Int!
  getBookByISBN(
    isbn: String!
  ): Book
  getAuthentication(
    username: String!
    hashedPassword: String!
  ): ID
}

type Mutation {
  createUser(
    username: ID!
    hashedPassword: String!
    display: String!
  ): User
}

`;
