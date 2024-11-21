import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserFailure, deleteUserSuccess, logoutUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileError, setImageFileError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData1, setFormData1] = useState({})
  const [imageError, setImageError] = useState(null)
  const [profileUpdate, setProfileUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const dispatch = useDispatch()
  const ref = useRef()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageError(null)
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile)
    }
  }, [imageFile])

  const uploadImage = async (imageFile) => {
    setImageFileError(null)
    setImageError(null)
    setProfileUpdate(false)
    if (!imageFile) return;

    if (imageFile) {
      const formData = new FormData()
      formData.append('imageFile', imageFile)

      setIsUploading(true)
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Could not upload image (File must be less than 3MB)')
        }

        const data = await response.json()
        setImageFileUrl(data)
        setFormData1({...formData1, profilePicture: data})
      } catch (error) {
        setImageError(error.message)
        setImageFileUrl(null)
        setImageFile(null)
      } finally {
        setProfileUpdate(false)
        setIsUploading(false)
        setImageFileError(null)
      }
    }
  }

  const handleChange = (e) => {
    setFormData1({...formData1, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setImageFileError(null)
    setImageError(null)
    setProfileUpdate(false)

    if (!isUploading && Object.keys(formData1).length === 0) {
      setImageError('Nothing to update')
      return
    }

    if (isUploading) {
      setImageFileError('Please wait for the image to upload')
      return
    }

    try {
      dispatch(updateUserStart())
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData1)
      })
      
      const data = await response.json()
      if(!response.ok) {
        dispatch(updateUserFailure(data.message))
        setImageError(data.message)
      }
      else {
        dispatch(updateUserSuccess(data))
        setProfileUpdate(true)
      }
    } catch (error) {
      setProfileUpdate(false)
      dispatch(updateUserFailure(error.message))
      setImageError(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        dispatch(deleteUserFailure(res.message))
      }
      else {
        dispatch(deleteUserSuccess(res))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST'
      })

      const data = response.json()

      if (!response.ok) {
        console.log(data.message)
      }
      else {
        dispatch(logoutUserSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='text-3x1 my-7 text-center font-semibold'>Profile</h1>
      <form className='flex flex-col gap-4' encType="multipart/form-data" onSubmit={handleSubmit}>
        <input type="file" accept='image/*' ref={ref} hidden onChange={handleImageChange} name="uploaded_file"/>
        <div className='w-32 h-32 self-center shasdow-md overflow-hidden rounded-full cursor-pointer' onClick={() => ref.current.click()}>
          <img src={imageFileUrl || currentUser.profilePicture} alt="user" name='imageFile' className={`w-full h-full rounded-full border-8 border-[lightgray] ${isUploading ? 'opacity-60' : ''}`} />
        </div>
        {
          isUploading ? <p className='text-sm text-gray-500 text-center'>Uploading...</p> : null
        }
        {imageFileError && (
          <Alert color='failure'>{imageFileError}</Alert>
        )}
        <TextInput 
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput 
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput 
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='purpleToPink' className='w-full' outline disabled={isUploading || loading}>
          {
            loading ? 'Loading..' : 'Update'
          }
        </Button>
        {
          currentUser.isAdmin && 
          <Link to='/create-post'>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        }
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleLogout} className='cursor-pointer'>
          Logout
        </span>
      </div>
      {imageError && (
          <Alert color='failure' className='mt-2'>{imageError}</Alert>
      )}
      {profileUpdate ? (
        <Alert color='success' className='mt-2'>Profile updated successfully</Alert>
      ) : null}
      {error && 
        <Alert color='failure' className='mt-2'>
          {error}
        </Alert>
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
              Are you sure you want to delete your account?
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
