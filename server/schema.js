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

type Query {
  bookCount: Int!
  getBookByISBN(isbn: String!): Book
}

`;
