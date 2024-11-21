import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../component/CallToAction'
import PostCard from '../component/PostCard'
import { Spinner } from 'flowbite-react'

export default function Home() {
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
    try {
        const response = await fetch('/api/post/getpost', {
          method: 'POST'
        }) 
        const data = await response.json()
        if (response.ok) {
          setPost(data.post)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [])

  if (loading) {
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Here you can find my latest posts and variety of article</p>
        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline max-w-fit'>
          View all post
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          post && post.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Recent Post</h2>
              <div className='flex flex-wrap gap-4 justify-center'>
                {
                  post.map((post1) => (
                    <PostCard key={post1._id} post={post1} />
                  ))
                }
              </div>
              <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center max-w-fit mx-auto'>
                View all post
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
