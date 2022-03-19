import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql `
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

export const CREATE_SIGN_UP_MUTATION = gql `
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

export const CREATE_POST_MUTATION = gql `
	mutation AddPost(
		$title: String!
		$region: String!
		$type: Int!
		$content: String!
	) {
		addPost(
			title: $title
			region: $region
			type: $type
			content: $content
		) {
			_id
		}
	}
`;


export const CREATE_LOGOUT_MUTATION = gql `
mutation Mutation {
  logout
}
`