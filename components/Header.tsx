import React from 'react'
import {
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  Bars4Icon,
} from '@heroicons/react/24/solid'
import {
  BellIcon,
  ChatBubbleBottomCenterIcon,
  GlobeAltIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const Header = () => {
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-50 flex items-center bg-white px-4 py-2 shadow-sm">
      <div className="mx-7 flex items-center xl:min-w-[300px]">
        <Link href="/">
          <div className="flex flex-1 cursor-pointer items-center">
            <HomeIcon className="h-5 w-5" />
            <p className="ml-2 hidden flex-1 lg:inline">Home</p>
          </div>
        </Link>
        <ChevronDownIcon className="h-5 w-5" />
      </div>
      {/* Search Box */}
      <form className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1">
        <MagnifyingGlassCircleIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Topics"
        />
        <button type="submit" hidden />
      </form>
      <div className="mx-5 hidden items-center space-x-2 lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeAltIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatBubbleBottomCenterIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerWaveIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <Bars4Icon className="icon" />
      </div>
      {/* Sign In/ Sign Out button */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">Portal User</p>
          </div>

          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  )
}

export default Header
