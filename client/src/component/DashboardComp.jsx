import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table, Spinner } from 'flowbite-react'

export default function DashboardComp() {
  const [user, setUser] = useState([])
  const [comment, setComment] = useState([])
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPost, setTotalPost] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [totalComment, setTotalComment] = useState(0)
  const [lastMonthUser, setLastMonthUser] = useState(0)
  const [lastMonthPost, setLastMonthPost] = useState(0)
  const [lastMonthComment, setLastMonthComment] = useState(0)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user/getuser?limit=5', {
                method: 'POST',
                credentials: 'include'
            })

            const data = await response.json()

            if (response.ok) {
                setUser(data.user)
                setTotalUser(data.totalUser)
                setLastMonthUser(data.lastMonthUser)
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    const fetchComment = async () => {
        try {
            const response = await fetch('/api/comment/getcomment?limit=5', {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()

            if (response.ok) {
                setComment(data.comment)
                setLastMonthComment(data.lastMonthcomment)
                setTotalComment(data.totalComment)
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    const fetchPost = async () => {
        try {
            const response = await fetch('/api/post/getpost?limit=5', {
                method: 'POST'
            })

            const data = await response.json()

            if (response.ok) {
                setPost(data.post)
                setLastMonthPost(data.lastMonthPost)
                setTotalPost(data.totalPost)
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (currentUser.isAdmin) {
        fetchUser()
        fetchComment()
        fetchPost()
    }
  }, [currentUser])

  if (loading) {
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }

  return (
    <div className='p-3 md:mx-auto'>
        <div className='flex-wrap flex gap-4 justify-center'>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h3 className='uppercase text-gray-500 text-md'>Total User</h3>
                        <p className='text-2xl'>{totalUser}</p>
                    </div>
                    <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthUser}
                    </span>
                    <div className='text-gray-500'>Last Month</div>
                </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h3 className='uppercase text-gray-500 text-md'>Total Comment</h3>
                        <p className='text-2xl'>{totalComment}</p>
                    </div>
                    <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthComment}
                    </span>
                    <div className='text-gray-500'>Last Month</div>
                </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h3 className='uppercase text-gray-500 text-md'>Total Post</h3>
                        <p className='text-2xl'>{totalPost}</p>
                    </div>
                    <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthPost}
                    </span>
                    <div className='text-gray-500'>Last Month</div>
                </div>
            </div>
        </div>
        <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent user</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to={'/dashboard?tab=user'}>
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>User image</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className='divide-y'>
                        {
                            user && user.map((user1) => 
                            (
                                <Table.Row key={user1._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img src={user1.profilePicture} alt='user' className='rounded-full w-10 h-10 object-cover bg-gray-500' />
                                    </Table.Cell>
                                    <Table.Cell>{user1.username}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent comment</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to={'/dashboard?tab=comment'}>
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell>Like</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className='divide-y'>
                        {
                            comment && comment.map((comment1) => (
                                <Table.Row key={comment1._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell className='w-96'>
                                        <p className='line-clamp-2'>{comment1.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>{comment1.numberOfLike}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent post</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to={'/dashboard?tab=post'}>
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Post image</Table.HeadCell>
                        <Table.HeadCell>Post Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className='divide-y'>
                        {
                            post && post.map((post1) => (
                                <Table.Row key={post1._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img src={post1.image} alt='user' className='rounded-full w-14 h-10 object-cover bg-gray-500' />
                                    </Table.Cell>
                                    <Table.Cell>{post1.title}</Table.Cell>
                                    <Table.Cell>{post1.category}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>
        </div>
    </div>
  )
}
