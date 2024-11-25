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
