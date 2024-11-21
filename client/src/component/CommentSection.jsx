import { Alert, Button, Textarea, Spinner, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({postId}) {
  const { currentUser } = useSelector((state) => state.user)
  const [ comment, setComment ] = useState('')
  const [ commentError, setCommentError ] = useState(null)
  const [allComment, setAllComment] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const onLike = async (commentId) => {
    try {
        if (!currentUser) {
            navigate('/sign-in')
            return
        }

        const response = await fetch(`/api/comment/likecomment/${commentId}`, {
            method: 'PUT',
            credentials: 'include'
        })

        const data = await response.json()

        setAllComment(
            allComment.map((comment) => 
                comment._id === commentId ? {
                    ...comment,
                    like: data.like,
                    numberOfLike: data.like.length
                } : comment
            )
        )
    } catch (error) {
        console.error(error.message)
    }
  }

  useEffect(() => {
    const fetchComment = async () => {
        try {
            const res = await fetch(`/api/comment/getcomment/${postId}`, {
                method: 'GET'
            })

            if(!res.ok) {
                throw new Error('Failed to fetch comment')
            }
    
            if (res.ok) {
                const data = await res.json()
                setAllComment(data)
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    fetchComment()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200) {
        return
    }

    try {
        const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: comment,
                postId,
                userId: currentUser._id
            }),
            credentials: 'include'
        })
        const data = await res.json()
        
        if (!res.ok) {
            setCommentError(data.message)
        }

        if (res.ok) {
            setCommentError(null)
            setComment('')
            setAllComment([data, ...allComment])
        }
    } catch (error) {
        setCommentError(error.message)
    }
  }

  const handleEdit = async (comment, editcomment) => {
    setAllComment(
        allComment.map((c) => 
            c._id === comment._id ? {...c, content: editcomment} : c
        )
    )
  }

  const handleDelete = async (commentId) => {
    setShowModal(false)
    try {
        if (!currentUser) {
            navigate('/sign-in')
        }

        const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (res.ok) {
            setAllComment(allComment.filter((c) => c._id !== commentId))
        }
    } catch (error) {
        console.error(error.message)
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {
            currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as: &nbsp;</p>
                    <img className='h-5 w-5 rounded-full object-cover' src={currentUser?.profilePicture} alt='' />
                    <Link to={'/dashboard?tab=profile'}>
                        <p className='text-blue-500 hover:text-blue-700'>@{currentUser?.username}</p>
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                        Sign In
                    </Link>
                </div>
            )
        }
        {
            currentUser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add a comment..'
                        maxLength='200'
                        rows='3'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment} />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>
                            {200 - comment.length} character remaining
                        </p>
                        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                            Submit
                        </Button>
                    </div>
                    {
                        commentError && (
                            <Alert color='failure' className='mt-5'>
                                {commentError}
                            </Alert>
                        )
                    }
                </form>
            )
        }
        {
            loading ? (
                <div className='flex justify-center items-center min-h-screen'>
                    <Spinner size='sm' />
                </div>
            ) :
            allComment?.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comment</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{allComment?.length}</p>
                        </div>
                    </div>
                    {
                        allComment?.map((comment1) => (
                            <Comment 
                                key={comment1?._id}
                                comment={comment1}
                                onLike={onLike}
                                onEdit={handleEdit}
                                onDelete={(commentId) => {setShowModal(true)
                                    setCommentIdToDelete(commentId)}}
                            />
                        ))
                    }
                </>
            )
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
              <Button color='failure' onClick={() => handleDelete(commentIdToDelete)}>
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
