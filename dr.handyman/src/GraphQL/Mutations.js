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

export const CREATE_POST_MUTATION = gql`
	mutation AddPost(
		$title: String!
		$type: Int!
		$coordinates: [Float!]
		$content: String!
	) {
		addPost(
			title: $title
			type: $type
			coordinates: $coordinates
			content: $content
		) {
			_id
		}
	}
`;

export const CREATE_LOGOUT_MUTATION = gql`
	mutation Mutation {
		logout
	}
`;

export const SET_USER = gql`
	mutation SetUser($user: UserInput!) {
		setUser(user: $user)
	}
`;

export const SET_WORKER = gql`
	mutation SetWorker($coordinates: [Float!]) {
		setWorker(coordinates: $coordinates)
	}
`;

export const ACCEPT_POST = gql`
	mutation AcquirePost($id: String!) {
		acquirePost(_id: $id)
	}
`;

export const CANCEL_ACCEPT_POST = gql`
mutation UnacquirePost($id: String!) {
  unacquirePost(_id: $id)
}
`