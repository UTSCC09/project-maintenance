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