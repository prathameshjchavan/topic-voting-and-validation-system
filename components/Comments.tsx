import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import TimeAgo from 'react-timeago'
import { ADD_COMMENT } from '../graphql/mutations'
import { GET_POST_LIST_BY_POST_ID } from '../graphql/queries'
import Avatar from './Avatar'

type FormData = {
  comment: String
}

function Comments() {
  const router = useRouter()
  const { data: session } = useSession()
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_LIST_BY_POST_ID, 'getPost'],
  })
  const { data } = useQuery(GET_POST_LIST_BY_POST_ID, {
    variables: { post_id: router.query.postId },
  })
  const post: Post = data?.getPost

  const { register, handleSubmit, setValue } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Button Clicked')

    const notification = toast.loading('Posting your comment...')

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment,
      },
    })

    setValue('comment', '')

    toast.success('Comment Successfully Posted!', {
      id: notification,
    })
  }

  return (
    <div>
      <div className="bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <textarea
            {...register('comment')}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? 'What are your thoughts?' : 'Please sign in to comment'
            }
          />

          <button
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>

      <div className="bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.comments.map(({ id, username, created_at, text }, i) => (
          <div
            className="relative flex items-center space-x-2 space-y-5"
            key={id}
          >
            <div
              className={`absolute top-10 left-7 h-16 w-[1px] bg-gray-200 ${
                i === post.comments.length - 1 && 'h-14'
              }`}
            ></div>
            <div className="z-50">
              <Avatar seed={username} />
            </div>

            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">{username}</span>{' '}
                <TimeAgo date={created_at} />
              </p>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments
