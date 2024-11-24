import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query getAllBooks {
    getAllBooks {
      isbn
      title
      authors {
        name
      }
      publishers {
        name
      }
      yearOfPublication
      image
    }
  }
`;

export const GET_BOOK_BY_ISBN = gql`
  query getBookByISBN($isbn: String!) {
    getBookByISBN(isbn: $isbn) {
      isbn
      title
      authors {
        name
      }
      publishers {
        name
      }
      yearOfPublication
      image
      price
      amount
      liked
    }
  }
`;

export const ALL_LIKED = gql`
  query GetAllLikedBooks {
    getAllLikedBooks {
      isbn
      title
      authors {
        name
      }
      publishers {
        name
      }
      yearOfPublication
      image
    }
  }
`;

export const CHECKOUT_BOOKS = gql`
  mutation checkoutBooks($checkedOutBooks: [CheckoutBooksInput!]!) {
    checkoutBooks(checkedOutBooks: $checkedOutBooks) {
      success
      message
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($isbn: String!) {
    toggleLike(isbn: $isbn)
  }
`;
