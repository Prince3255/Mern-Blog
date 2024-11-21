import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { Button, Textarea, Spinner } from 'flowbite-react'

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({})
  const { currentUser } = useSelector((state) => state.user)
  const [editing, setEditing] = useState(false)
  const [newComment, setNewComment] = useState(comment?.content)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/user/${comment?.userId}`, {
                method: 'GET'
            })

            const data = await response.json()

            if (response.ok) {
                setUser(data)
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    fetchUser()
  }, [comment])

  const handleEdit = () => {
    setEditing(true)
    setNewComment(comment.content)
  }

  const handleSave = async () => {
    try {
        const res = await fetch(`/api/comment/editcomment/${comment?._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newComment
            }),
            credentials: 'include'
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error("Failed to update comment")
        }

        if (res.ok) {
            setEditing(false)
            onEdit(comment, newComment)
        }
    } catch (error) {
        console.error(error.message)
    } 
  }

  return (
    <> {
        loading ? (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        ) :
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img src={user?.profilePicture} alt={user?.username} className='w-10 h-10 rounded-full object-cover' />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-xs truncate'>
                    {user ? `@${user?.username}` : 'anonymus user'}
                </span>
                <span className='text-gray-500 text-xs'>
                    {moment(comment?.createdAt).fromNow()}
                </span>
            </div>
            {
                editing ? (
                    <>
                        <Textarea 
                            className='mb-2'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            />
                        <div className='flex justify-end gap-2 text-xs'>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}
                                >
                                save
                            </Button>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBkue'
                                onClick={() => setEditing(false)}
                            >
                                cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                    <p className='text-gray-500 pb-2'>{comment?.content}</p>
                    <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                        <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${
                            currentUser && comment?.like.includes(currentUser._id) && '!text-blue-500'
                            }`}>
                            <FaThumbsUp className='text-sm'/>
                        </button>
                        <p className='text-gray-500'>
                            {
                                comment?.numberOfLike > 0 && comment?.numberOfLike + ' ' + 
                                (comment?.numberOfLike > 1 ? 'likes' : 'like')
                            }
                        </p>
                        {
                            currentUser && (
                                currentUser?._id === comment?.userId || currentUser?.isAdmin 
                            ) && (
                                <>
                                    <button
                                        type='button'
                                        onClick={handleEdit}
                                        className='text-gray-400 hover:text-blue-500'
                                        >
                                        Edit
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => onDelete(comment?._id)}
                                        className='text-gray-400 hover:text-red-500'
                                        >
                                        Delete
                                    </button>
                                </>
                            )
                        }
                    </div>
                    </>
                )
            }
        </div>
    </div>
} 
    </>
  )
}
