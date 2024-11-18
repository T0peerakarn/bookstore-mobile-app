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
