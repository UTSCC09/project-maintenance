import { gql } from "@apollo/client";

export const LOAD_USERS = gql`
  query {
    getAllUsers {
      id
      firstName
      email
      password
    }
  }
`;

export const GET_POSTS_QUERY = gql`
query GetPostPage($postPerPage: Int!, $page: Int!) {
  getPostPage(postPerPage: $postPerPage, page: $page) {
    posterUsername
    title
    content
    type
    state
    posterEmail
    createdAt
  }
}
`;

export const GET_COUNT = gql`
query GetPostCount {
  getPostCount 
}
`;

export const GET_WORKER = gql`
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

export const WORKER_COUNT = gql`
query Query {
  getWorkerCount
}
`;