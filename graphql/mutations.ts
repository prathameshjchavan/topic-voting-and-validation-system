import { gql } from '@apollo/client'

export const ADD_VOTE = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
      created_at
      post_id
      upvote
      username
    }
  }
`

export const ADD_COMMENT = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      created_at
      id
      post_id
      text
      username
    }
  }
`

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $topic_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      topic_id: $topic_id
      title: $title
      username: $username
    ) {
      body
      created_at
      id
      image
      topic_id
      title
      username
    }
  }
`

export const ADD_TOPIC = gql`
  mutation MyMutation($topic: String!) {
    insertTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`
