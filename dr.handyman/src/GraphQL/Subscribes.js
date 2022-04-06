import { gql } from "@apollo/client";

export const GET_CHAT_SUBSCRIBE = gql`
subscription GetChat($conversationId: String!, $count: Int!) {
  getChat(conversationId: $conversationId, count: $count) {
    conversationId
    _id
    email
    username
    content
    createdAt
    updatedAt
  }
}`