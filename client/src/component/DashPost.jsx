import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPost() {

  const { currentUser } = useSelector((state) => state.user)
  const [userPost, setUserPost] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`, {
          method: 'POST'
        });

        const data = await res.json()

        if (res.ok) {
          setUserPost(data.post)
          if (data.post.length < 9) {
            setShowMore(false)
          }
        }
        else {
          console.log('Something went wrong')
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if (currentUser?.isAdmin) {
      fetchPost()
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = userPost.length

    try {
      const res = await fetch(`/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`, {
        method: 'POST'
      })

      const data = await res.json()

      if (res.ok) {
        setUserPost((prev) => [...prev, ...data?.post])
        if (data?.post?.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false)

    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      }
      else {
        setUserPost((prev) => prev.filter((userPost) => userPost._id !== postIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPost.length > 0 ? (
          <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>
                  Edit
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
            {userPost?.map((post) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={post._id}>
                  <Table.Cell>
                    {new Date(post?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
          </Table>
          {
            showMore && (
              <button className='w-full text-teal-500 text-sm py-7 self-center' onClick={handleShowMore}>
                Show More
              </button>
            )
          }
          </>
        ) : <p>You have no post</p>
      }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size='md'
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='text-lg mb-5 text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
