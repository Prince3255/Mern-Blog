import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table, Button, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashPost() {

  const { currentUser } = useSelector((state) => state.user)
  const [user, setUser] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getuser`, {
          method: 'POST'
        });

        const data = await res.json()
        
        if (res.ok) {
          setUser(data.user)
          if (data.user.length < 9) {
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
      fetchUser()
    }
  }, [])

  if (loading) {
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }

  const handleShowMore = async () => {
    const startIndex = user.length

    try {
      const res = await fetch(`/api/user/getuser?startIndex=${startIndex}`, {
        method: 'POST'
      })

      const data = await res.json()

      if (res.ok) {
        setUser((prev) => [...prev, ...data?.user])
        if (data?.user?.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)

    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      }
      else {
        setUser((prev) => prev.filter((user) => user._id !== userIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && user.length > 0 ? (
          <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
            {user?.map((user1) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={user1?._id}>
                  <Table.Cell>
                    {new Date(user1?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img src={user1?.profilePicture} alt={user1?.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                  </Table.Cell>
                  <Table.Cell>
                    {user1?.username}
                  </Table.Cell>
                  <Table.Cell>{user1?.email}</Table.Cell>
                  <Table.Cell>
                    {
                      user1?.isAdmin ? (
                        <FaCheck className='text-green-500' />
                      ) : (<FaTimes className='text-red-500' />)
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user1?._id)
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
        ) : <p>You have no user yet!</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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