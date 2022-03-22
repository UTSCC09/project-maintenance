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
query GetPostPage($postPerPage: Int!, $page: Int!) {
  getPostPage(postPerPage: $postPerPage, page: $page) {
    posterUsername
    title
    content
    type
    state
    posterEmail
    createdAt
    _id
    acceptorUsername
    acceptorEmail
  }
}
`;

export const GET_COUNT = gql `
query GetPostCount {
  getPostCount
}
`;

export const GET_WORKER = gql `
query GetWorkerPage($workerPerPage: Int!, $page: Int!) {
  getWorkerPage(workerPerPage: $workerPerPage, page: $page) {
    email
    username
    type
    phone
    rating
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
    location
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
query WorkerData($id: String!) {
  getOnePost(_id: $id) {
    _id
    posterEmail
    posterUsername
    acceptorUsername
    acceptorEmail
    title
    content
    type
    state,
    createdAt
  }
}
`
export const GET_USER_POST = gql `
query GetUserPosts($userPostPerPage: Int!, $page: Int!){
  getUserPostsPage(userPostPerPage: $userPostPerPage, page: $page) {
    posterEmail
    title
    content
    posterUsername
    acceptorUsername
    createdAt,
    type,
    state,
    acceptorUsername
    _id
  }
}
`

export const GET_USER_POST_COUNT = gql `
query Query {
  getUserPostCount
}
`

export const GET_ACCEPT_USER_POST = gql `
query GetAcceptedPostsPage($acceptedPostPerPage: Int!, $page: Int!) {
  getAcceptedPostsPage(acceptedPostPerPage: $acceptedPostPerPage, page: $page) {
    _id
    posterEmail
    posterUsername
    acceptorEmail
    acceptorUsername
    title
    content
    location
    state
    type
    updatedAt
    createdAt
  }
}
`

export const GET_ACCEPT_USER_POST_COUNT = gql`
query GetAcceptedPostsPage {
  getAcceptedPostCount
}
`

export const SEARCH_WORKER = gql `
query SearchWorkerPage($queryText: String!, $page: Int!, $workerPerPage: Int!) {
  searchWorkerPage(queryText: $queryText, page: $page, workerPerPage: $workerPerPage) {
    username
    type
    rating
    profilePic {
      filepath
      fileGetPath
      mimetype
      encoding
    }
    phone
    permissions
    password
    location
    email
    createdAt
  }
}
`

export const SEARCH_WORKER_COUNT = gql `
query Query($queryText: String!) {
  searchWorkerPageCount(queryText: $queryText)
}
`

export const SEARCH_POST = gql`
query SearchPostPage($queryText: String!, $page: Int!, $postPerPage: Int!) {
  searchPostPage(queryText: $queryText, page: $page, postPerPage: $postPerPage) {
    updatedAt
    type
    title
    state
    posterUsername
    location
    posterEmail
    createdAt
    content
    acceptorUsername
    acceptorEmail
    _id
  }
}
`

export const SEARCH_POST_COUNT = gql`
query Query($queryText: String!) {
  searchPostPageCount(queryText: $queryText)
}
`