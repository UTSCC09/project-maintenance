import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql `
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				email
				username
				createdAt
				phone
				rating
				type
			}
		}
	}
`;

export const CREATE_SIGN_UP_MUTATION = gql `
	mutation Signup(
		$username: String!
		$email: String!
		$password: String!
		$phone: String!
	) {
		signup(
			username: $username
			email: $email
			password: $password
			phone: $phone
		) {
			user {
				email
				username
				type
				phone
				rating
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
  setUser(username: $username, phone: $phone){
	username
    email
    password
    type
    phone
    rating
    location
    distance
    commentCount
    profilePic {
      filepath
      fileGetPath
      mimetype
      encoding
    }
    createdAt
  }
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
`;

export const CANCEL_ACCEPT = gql `
	mutation UnacquirePost($id: String!) {
		unacquirePost(_id: $id)
	}
`;

export const SET_POST = gql `
	mutation SetPost($id: String!, $content: String!, $title: String!) {
		setPost(_id: $id, content: $content, title: $title) {
			content
			title
			_id
		}
	}
`;

export const CREATE_MESSAGE = gql `
	mutation CreateMessage($id: String!, $content: String!) {
		createMessage(_id: $id, content: $content)
	}
`;
export const CREATE_CONVERSATION = gql `
	mutation CreateConvo($email: String!) {
		createConvo(email: $email) {
			_id
			userEmails
		}
	}
`;

export const ADD_NEW_APPOINTMENT = gql `
	mutation AddAppointment(
		$description: String!
		$startTime: Float!
		$endTime: Float!
		$userEmail: String!
	) {
		addAppointment(
			description: $description
			startTime: $startTime
			endTime: $endTime
			userEmail: $userEmail
		) {
			_id
			description
			workerEmail
			userEmail
			startTime
			endTime
		}
	}
`;
export const EDIT_NEW_APPOINTMENT = gql `
	mutation EditAppointment(
		$id: String!
		$description: String!
		$startTime: Float!
		$endTime: Float!
		$userEmail: String!
	) {
		editAppointment(
			_id: $id
			description: $description
			startTime: $startTime
			endTime: $endTime
			userEmail: $userEmail
		) {
			_id
			description
			workerEmail
			userEmail
			startTime
			endTime
		}
	}
`;

export const DEL_APPOINTMENT = gql `
	mutation DeleteAppointment($id: String!) {
		deleteAppointment(_id: $id)
	}
`;

export const ADD_NEW_COMMENT = gql `
	mutation AddComment(
		$appointmentId: String!
		$workerEmail: String!
		$rating: Float!
		$content: String!
	) {
		addComment(
			appointmentId: $appointmentId
			workerEmail: $workerEmail
			rating: $rating
			content: $content
		) {
			_id
			content
			appointmentId
			workerEmail
			userEmail
			rating
			createdAt
			updatedAt
		}
	}
`;

export const EDIT_COMMENT = gql `
	mutation EditComment($id: String!, $rating: Float!, $content: String!) {
		editComment(_id: $id, rating: $rating, content: $content){
			_id
			rating
			content

		}
	}
`;

export const DEL_COMMENT = gql `
	mutation DeleteComment($id: String!) {
		deleteComment(_id: $id)
	}
`;