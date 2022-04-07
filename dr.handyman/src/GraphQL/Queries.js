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
query SearchWorkerPage($queryText: String!, $page: Int!, $workerPerPage: Int!, $coordinates: [Float], $sortByDist: Boolean) {
  searchWorkerPage(queryText: $queryText, page: $page, workerPerPage: $workerPerPage, coordinates: $coordinates, sortByDist: $sortByDist) {
    email
    username
    password
    type
    phone
    rating
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
`

export const SEARCH_WORKER_COUNT = gql `
query Query($queryText: String!, $sortByDist: Boolean) {
  searchWorkerPageCount(queryText: $queryText, sortByDist: $sortByDist)
}
`

export const SEARCH_POST = gql `
query SearchPostPage($queryText: String!, $page: Int!, $postPerPage: Int!, $coordinates: [Float], $sortByDist: Boolean) {
  searchPostPage(queryText: $queryText, page: $page, postPerPage: $postPerPage, coordinates: $coordinates, sortByDist: $sortByDist) {
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
query Query($queryText: String!, $sortByDist: Boolean) {
  searchPostPageCount(queryText: $queryText, sortByDist: $sortByDist)
}
`

export const LOAD_CURRENT_CONVOS = gql `
query Query {
  getCurrentConvos {
    _id
    userEmails
  }
}
`
export const GET_CURRENT_CONVOS_DES = gql `
query GetCurrentConvosWithDescription {
  getCurrentConvosWithDescription {
    username2
    username1
    conversation {
      userEmails
      _id
    }
  }
}
`
export const GET_LATEST_MESSAGE = gql `
query GetLatestMessage($id: String!) {
  getLatestMessage(_id: $id) {
    _id
    conversationId
    email
    content
    createdAt
    username
    updatedAt
  }
}
`

export const GET_UP_COMING_APPOINTMENT = gql `
query GetAppointmentUpComingPage($email: String!, $appointmentPerPage: Int!, $page: Int!) {
  getAppointmentUpComingPage(email: $email, appointmentPerPage: $appointmentPerPage, page: $page) {
    _id
    description
    workerEmail
    userEmail
    startTime
    endTime
    isCommented
  }
}
`

export const GET_UP_COMING_APPOINTMENT_COUNT = gql `
query Query($email: String!) {
  getAppointmentUpComingCount(email: $email)
}
`

export const GET_HISTORY_COMING_APPOINTMENT = gql `
query GetAppointmentHistoryPage($email: String!, $page: Int!, $appointmentPerPage: Int!) {
  getAppointmentHistoryPage(email: $email, page: $page, appointmentPerPage: $appointmentPerPage) {
    _id
    description
    workerEmail
    userEmail
    startTime
    endTime
    isCommented
  }
}
`

export const GET_HISTORY_COMING_APPOINTMENT_COUNT = gql `
query Query($email: String!) {
  getAppointmentHistoryCount(email: $email)
}`

export const GET_COMMENT_BY_USER = gql `
query GetCommentByUserPage($email: String!, $page: Int!, $commentPerPage: Int!) {
  getCommentByUserPage(email: $email, page: $page, commentPerPage: $commentPerPage) {
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
`

export const GET_COMMENT_BY_USER_COUNT = gql `
query Query($email: String!) {
  getCommentByUserCount(email: $email)
}`

export const GET_COMMENT_BY_WORKER = gql `
query GetCommentByWorkerPage($email: String!, $page: Int!, $commentPerPage: Int!) {
  getCommentByWorkerPage(email: $email, page: $page, commentPerPage: $commentPerPage) {
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
`

export const GET_COMMENT_BY_WORKER_COUNT = gql `
query Query($email: String!) {
  getCommentByWokerCount(email: $email)
}`

export const GET_COMMENT_ON_WORKER_PAGE = gql `
query GetCommentOnWorkerPage($email: String!, $commentPerPage: Int!, $page: Int!) {
  getCommentOnWorkerPage(email: $email, commentPerPage: $commentPerPage, page: $page) {
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
`

export const GET_COMMENT_COUNT_ON_WORKER_PAGE = gql `
query Query($email: String!) {
  getCommentOnWorkerCount(email: $email)
}
`