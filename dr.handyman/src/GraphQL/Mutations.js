import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				email
        username
        createdAt
        permissions
        phone
        rating
        type
			}
		}
	}
`;

export const CREATE_SIGN_UP_MUTATION = gql`
mutation Signup($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    user {
      email
      username
      type
      phone
      rating
      permissions
      createdAt
    }
  }
}
`;
