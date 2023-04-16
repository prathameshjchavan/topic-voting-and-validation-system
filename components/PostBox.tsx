import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_TOPIC } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_TOPIC_BY_NAME } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  topic: string
}

type Props = {
  topic?: string
}

function PostBox({ topic }: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addTopic] = useMutation(ADD_TOPIC)
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)
    const notification = toast.loading('Creating new post...')

    try {
      // Query for the topic
      const {
        data: { getTopicListByName },
      } = await client.query({
        query: GET_TOPIC_BY_NAME,
        variables: {
          name: topic || formData.topic,
        },
      })

      const topicExists = getTopicListByName.length > 0

      if (!topicExists) {
        // create topic
        console.log('Topic is new! -> creating a NEW topic!')

        const {
          data: { insertTopic: newTopic },
        } = await addTopic({
          variables: {
            topic: formData.topic,
          },
        })

        console.log('Creating post...', formData)
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            topic_id: newTopic.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log('New post added: ', newPost)
      } else {
        // use existing topic
        console.log('Using existing topic!')
        console.log(getTopicListByName)

        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            topic_id: getTopicListByName[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log('New post added: ', newPost)
      }

      // After post has been added!
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('topic', '')

      toast.success('New Post created!', {
        id: notification,
      })
    } catch (error) {
      toast.error('Whoops, something went wrong', {
        id: notification,
      })
      console.log(error)
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar />

        <input
          {...register('postTitle', { required: true })}
          type="text"
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          disabled={!session}
          placeholder={
            session
              ? topic
                ? `Create a post in t/${topic}`
                : 'Create a post by entering a title'
              : 'Sign in to post'
          }
        />

        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && 'text-blue-400'
          }`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              type="text"
              placeholder="Text (Optional)"
            />
          </div>

          {!topic && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Topic:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('topic', { required: true })}
                type="text"
                placeholder="i.e. reactjs"
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>- A Post Title is required</p>
              )}
              {errors.topic?.type === 'required' && (
                <p>- A Topic is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}
export default PostBox
