import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation signIn($username: String!, $password: String!) {
    getAuthentication(username: $username, password: $password)
  }
`;

export const SIGN_UP = gql`
  mutation signUp($username: ID!, $password: String!, $display: String!) {
    createUser(username: $username, password: $password, display: $display) {
      id
    }
  }
`;
