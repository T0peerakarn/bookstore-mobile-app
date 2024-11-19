import { gql } from "@apollo/client";

export const ALL_RECORDS = gql`
  query getRecords {
    getRecords {
      id
      books {
        isbn
        title
        image
        authors {
          name
        }
        amount
        price
      }
      totalPrice
      createdAt
    }
  }
`;
