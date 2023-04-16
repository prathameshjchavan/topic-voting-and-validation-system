import { gql } from '@apollo/client'

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostID(post_id: $post_id) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`

export const GET_POST_LIST_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPost(id: $post_id) {
      body
      comments {
        created_at
        id
        post_id
        text
        username
      }
      created_at
      id
      image
      topic {
        created_at
        id
        topic
      }
      title
      topic_id
      username
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      comments {
        created_at
        id
        post_id
        text
        username
      }
      created_at
      id
      image
      topic {
        created_at
        id
        topic
      }
      title
      topic_id
      username
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`

export const GET_TOPIC_BY_NAME = gql`
  query MyQuery($name: String!) {
    getTopicListByName(name: $name) {
      id
      topic
      created_at
    }
  }
`
export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      topic_id
      title
      username
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      topic {
        id
        created_at
        topic
      }
      comments {
        created_at
        id
        post_id
        text
        username
      }
    }
  }
`
