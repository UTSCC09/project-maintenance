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
	mutation Signup($username: String!, $email: String!, $password: String!, $phone: String!) {
		signup(username: $username, email: $email, password: $password, phone: $phone) {
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

export const CREATE_LOGOUT_MUTATION = gql `
	mutation Mutation {
		logout
	}
`;

export const SET_USER = gql `
	mutation SetUser($username: String!, $phone: String!) {
		setUser(username: $username, phone: $phone)
	}
`;

export const SET_WORKER = gql `
	mutation SetWorker($coordinates: [Float!]) {
		setWorker(coordinates: $coordinates)
	}
`;

export const ACCEPT_POST = gql `
	mutation AcquirePost($id: String!) {
		acquirePost(_id: $id)
	}
`;

export const CANCEL_ACCEPT_POST = gql `
	mutation UnacquirePost($id: String!) {
		unacquirePost(_id: $id)
	}
`;

export const DEL_POST = gql `
	mutation DeletePost($id: String!) {
		deletePost(_id: $id)
	}
`;

export const UPLOAD_AVATAR = gql `
mutation ProfilePicUpload($file: Upload!) {
  profilePicUpload(file: $file)
}
`

export const CANCEL_ACCEPT = gql `
mutation UnacquirePost($id: String!) {
  unacquirePost(_id: $id)
}
`

export const SET_POST = gql `

mutation SetPost($id: String!, $content: String!, $title: String!) {
  setPost(_id: $id, content: $content, title: $title)
}
`