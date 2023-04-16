import React, { Fragment, ReactElement, useEffect, useState } from 'react'
import {
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  EllipsisHorizontalCircleIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useRouter } from 'next/router'
import Comments from './Comments'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'

type Props = {
  post: Post
}

type PostWrapperProps = {
  children: ReactElement
}

function Post({ post }: Props) {
  const router = useRouter()
  const onPostPage = router.pathname.includes('/post')

  const PostWrapper = ({ children }: PostWrapperProps) => {
    return onPostPage ? (
      <Fragment>{children}</Fragment>
    ) : (
      <Link href={`/post/${post.id}`}>{children}</Link>
    )
  }

  const { data: session } = useSession()
  const [vote, setVote] = useState<boolean>()
  const { data, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  })
  const [addVote] = useMutation(ADD_VOTE, {
    // refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostID'],
    refetchQueries: [
      { query: GET_ALL_VOTES_BY_POST_ID, variables: { post_id: post?.id } },
    ],
  })

  const upVote = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    isUpvote: boolean
  ) => {
    e.stopPropagation()
    if (!session) return toast("You'll need to sign in to Vote!")

    if (vote && isUpvote) return
    if (vote === false && !upVote) return

    await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUpvote,
      },
    })
  }

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostID
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? total + 1 : total - 1),
      0
    )

    if (votes?.length === 0) return 0

    if (displayNumber === 0) return votes[0]?.upvote ? 1 : -1

    return displayNumber
  }

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostID

    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote

    setVote(vote)
  }, [data])

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )

  return (
    <PostWrapper>
      <div
        className={`flex ${
          !onPostPage ? 'cursor-pointer' : ''
        } flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600`}
      >
        <div className="flex">
          {/* Votes */}
          <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
            <ArrowUpIcon
              onClick={(e) => upVote(e, true)}
              className={`voteButtons hover:text-blue-400 ${
                vote && 'text-blue-400'
              }`}
            />
            <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
            <ArrowDownIcon
              onClick={(e) => upVote(e, false)}
              className={`voteButtons hover:text-red-400 ${
                vote === false && 'text-red-400'
              }`}
            />
          </div>

          {/* Body */}
          <div className="p-3 pb-1">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <Avatar seed={post.topic.topic} />
              <p className="text-xs text-gray-400">
                <Link href={`/topic/${post.topic.topic}`}>
                  <span className="font-bold text-black hover:text-blue-400 hover:underline">
                    t/{post.topic.topic}
                  </span>
                </Link>
                &nbsp;&bull; Posted by u/{post?.username}&nbsp;
                <TimeAgo date={post?.created_at} />
              </p>
            </div>

            {/* Body */}
            <div className="py-4">
              <h2 className="text-xl font-semibold">{post?.title}</h2>
              <p className="mt-2 text-sm font-light">{post?.body}</p>
            </div>

            {/* Image */}
            <img className="w-full" src={post?.image} alt="" />

            {/* Footer */}
            <div className="flex space-x-4 text-gray-400">
              <div className="postButtons">
                <ChatBubbleBottomCenterIcon className="h-6 w-6" />
                <p className="">
                  {post.comments?.length}&nbsp;
                  {post.comments?.length > 1 ? 'Comments' : 'Comment'}
                </p>
              </div>
              <div className="postButtons">
                <GiftIcon className="h-6 w-6" />
                <p className="hidden sm:inline">Award</p>
              </div>
              <div className="postButtons">
                <ShareIcon className="h-6 w-6" />
                <p className="hidden sm:inline">Share</p>
              </div>
              <div className="postButtons">
                <BookmarkIcon className="h-6 w-6" />
                <p className="hidden sm:inline">Save</p>
              </div>
              <div className="postButtons">
                <EllipsisHorizontalCircleIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        {onPostPage && <Comments />}
      </div>
    </PostWrapper>
  )
}

export default Post
