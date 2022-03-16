import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
mutation
Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      email
      username
    }
    
  }
}
`;
