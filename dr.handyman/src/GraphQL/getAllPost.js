import { gql } from "@apollo/client";

export const GET_POSTS_QUERY = gql `
query GetAllPost {
  getAllPost {
    title
    content
    posterUsername
    type
    createdAt
    acceptorUsername
    state
  }
}
`;