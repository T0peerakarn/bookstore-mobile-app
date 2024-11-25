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
  query getBookByISBN ($isbn: String!){
    getBookByISBN (isbn: $isbn){
      isbn
      title
      authors {
        name
    }
      publishers{
        name
      }
    yearOfPublication
      image
      price
      amount
      
  }
}
`;

export const CHECK_OUT = gql`
    query checkoutBooks($book: Book) {
        checkoutBooks {
            
        }
    }
`
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
