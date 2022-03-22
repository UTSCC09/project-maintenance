import { gql } from "@apollo/client";

export const LOAD_USERS = gql `
  query {
    getAllUsers {
      id
      firstName
      email
    }
  }
`;

export const LOAD_CURRENT_CONVOS = gql `
query Query {
  getCurrentConvos {
    _id
    userEmails
  }
}
`

export const GET_USER_DATA = gql `
query {
  currentUser {
    email
    username
    type
    phone
    rating
    createdAt
    permissions
    profilePic {
      filepath
      fileGetPath
      mimetype
      encoding
    }
  }
}
`;

export const GET_POSTS_QUERY = gql `
query GetPostPage($postPerPage: Int!, $coordinates: [Float], $page: Int!) {
  getPostPage(postPerPage: $postPerPage, coordinates: $coordinates, page: $page) {
    posterEmail
    _id
    posterUsername
    acceptorEmail
    acceptorUsername
    title
    content
    distance
    type
    state
    createdAt
    updatedAt
  }
}
`;

export const GET_COUNT = gql `
query GetPostCount {
  getPostCount
}
`;

export const GET_WORKER = gql `
query GetWorkerPage($workerPerPage: Int!, $page: Int!, $coordinates: [Float]) {
  getWorkerPage(workerPerPage: $workerPerPage, page: $page, coordinates: $coordinates) {
    email
    username
    password
    type
    phone
    rating
    distance
    profilePic {
      filepath
      fileGetPath
      mimetype
      encoding
    }
    permissions
    createdAt
  }
}
`;

export const GET_ONE_WORKER = gql `
query GetOneWorker($email: String!) {
  getOneWorker(email: $email) {
    email
    username
    password
    type
    phone
    rating
    distance
    profilePic {
      filepath
      fileGetPath
      mimetype
      encoding
    }
    permissions
    createdAt
  }
}
`

export const WORKER_COUNT = gql `
query Query {
  getWorkerCount
}
`;

export const GET_POST_DETAIL = gql `
query GetOnePost($id: String!, $coordinates: [Float]) {
  getOnePost(_id: $id, coordinates: $coordinates) {
    updatedAt
    type
    title
    state
    posterUsername
    posterEmail
    distance
    createdAt
    content
    acceptorUsername
    acceptorEmail
    _id
  }
}
`
export const GET_USER_POST = gql `
query GetUserPostsPage($userPostPerPage: Int!, $coordinates: [Float], $page: Int!) {
  getUserPostsPage(userPostPerPage: $userPostPerPage, coordinates: $coordinates, page: $page) {
    _id
    posterEmail
    posterUsername
    acceptorEmail
    acceptorUsername
    title
    content
    distance
    type
    state
    createdAt
    updatedAt
  }
}
`

export const GET_USER_POST_COUNT = gql `
query Query {
  getUserPostCount
}
`

export const GET_ACCEPT_USER_POST = gql `
query GetAcceptedPostsPage($acceptedPostPerPage: Int!, $coordinates: [Float], $page: Int!) {
  getAcceptedPostsPage(acceptedPostPerPage: $acceptedPostPerPage, coordinates: $coordinates, page: $page) {
    _id
    posterEmail
    posterUsername
    acceptorEmail
    acceptorUsername
    title
    content
    distance
    type
    state
    createdAt
    updatedAt
  }
}
`

export const GET_ACCEPT_USER_POST_COUNT = gql `
query GetAcceptedPostsPage {
  getAcceptedPostCount
}
`

export const SEARCH_WORKER = gql `
query GetPostPage($queryText: String!, $workerPerPage: Int!, $page: Int!, $coordinates: [Float]) {
  searchWorkerPage(queryText: $queryText, workerPerPage: $workerPerPage, page: $page, coordinates: $coordinates) {
    username
    rating
    type
    profilePic {
      mimetype
      filepath
      fileGetPath
      encoding
    }
    phone
    permissions
    password
    email
    distance
    createdAt
  }
}
`

export const SEARCH_WORKER_COUNT = gql `
query Query($queryText: String!) {
  searchWorkerPageCount(queryText: $queryText)
}
`

export const SEARCH_POST = gql `
query SearchPostPage($queryText: String!, $page: Int!, $postPerPage: Int!, $coordinates: [Float]) {
  searchPostPage(queryText: $queryText, page: $page, postPerPage: $postPerPage, coordinates: $coordinates) {
    updatedAt
    type
    title
    state
    posterUsername
    posterEmail
    distance
    createdAt
    content
    acceptorUsername
    acceptorEmail
    _id
  }
}
`

export const SEARCH_POST_COUNT = gql `
query Query($queryText: String!) {
  searchPostPageCount(queryText: $queryText)
}
`