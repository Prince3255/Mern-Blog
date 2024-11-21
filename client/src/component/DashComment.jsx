import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table, Button, Spinner } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashComment() {

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/getcomment`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json()
        
        if (res.ok) {
          setComment(data.comment)
          if (data.comment.length < 9) {
            setShowMore(false)
          }
        }
        else {
          console.log('Something went wrong')
        }
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.isAdmin) {
      fetchComment()
    }
  }, [])

  if (loading) {
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }

  const handleShowMore = async () => {
    const startIndex = comment.length

    try {
      const res = await fetch(`/api/comment/getcomment?startIndex=${startIndex}`, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await res.json()

      if (res.ok) {
        setComment((prev) => [...prev, ...data?.comment])
        if (data?.comment?.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)

    try {
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      }
      else {
        setComment((prev) => prev.filter((comment1) => comment1._id !== commentIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && comment.length > 0 ? (
          <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
            {comment?.map((comment) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={comment?._id}>
                  <Table.Cell>
                    {new Date(comment?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {comment?.content}
                  </Table.Cell>
                  <Table.Cell>
                    {comment?.numberOfLike}
                  </Table.Cell>
                  <Table.Cell>{comment?.postId}</Table.Cell>
                  <Table.Cell>
                    {comment?.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment?._id)
                    }  
                    }
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
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
        ) : <p>You have no comments yet!</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
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