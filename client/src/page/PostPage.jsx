import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../component/CallToAction'
import CommentSection from '../component/CommentSection'
import PostCard from '../component/PostCard'

export default function PostPage() {
  const { postSlug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentPost, setRecentPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getpost?slug=${postSlug}`, {
          method: 'POST'
        })

        const data = await res.json()

        if (!res.ok) {
          setError(true)
          return
        }

        if (res.ok) {
          setPost(data.post[0])
          setError(false)
        }
      } catch (error) {
        setError(true)
        console.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postSlug])

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const response = await fetch('/api/post/getpost?limit=3', {
          method: 'POST'
        })

        const data = await response.json()

        if (response.ok) {
          setRecentPost(data.post)
        }
      }

      fetchPost()
    } catch (error) {
      console.error(error.message)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [postSlug])

  if (loading) {
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post?.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {post && post?.category}
        </Button>
      </Link>
      <img src={post && post?.image} alt={post && post?.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
        {post && post.content?.length / 1000 >= 1
        ? `${(post.content.length / 1000).toFixed(0)} mins read`
        : ''}
        </span>
      </div>
      <div className='p-3 mt-10 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>
      </div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <div>
        <CommentSection postId={post?._id} />
      </div>
      <div className='flex flex-col justify-center items-center mb-5'>
          <h1 className='text-xl mt-5'>Recent article</h1>
          <div className='flex flex-wrap gap-5 mt-5 justify-center'>
            {
              recentPost && recentPost.map((post) => 
                <PostCard key={post._id} post={post} />                
              )
            }
          </div>
      </div>
    </main>
  )
}
