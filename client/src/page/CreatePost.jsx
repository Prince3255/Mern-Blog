import React, { useEffect, useState, useRef } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
    const [image1, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [imageError, setImageError] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [formData1, setFormData] = useState(null)
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()

    const quillRef = useRef(null)
  const handleImage = (e) => {
    const file = e.target.files[0]

    if (file) {
        setImageError(null)
        setImage(file)
        setImageUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (image1) => {
    if (!image1) {
        setImageError('Please select a image')
        return
    }

    setImageError(null)

    if (image1) {
        setUploading(true)

        const formData = new FormData()
        formData.append('imageFile', image1)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Could not upload image')
            }

            const data = await response.json()
            setImageUrl(data)
            setFormData({
                ...formData1, image: data
            })
        } catch (error) {
            setImageError(error.message)
            setImageUrl(null)
            setImage(null)
        } finally {
            setUploading(false)
        }
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await fetch('/api/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData1),
            credentials: 'include'
        })

        const data = await res.json()

        if (!res.ok) {
            setPublishError(data.message)
        }

        if (res.ok) {
            setPublishError(null)
            navigate(`/post/${data.slug}`)
        }
    } catch (error) {
        setPublishError('Something went wrong')
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-3xl text-center font-semibold my-7'>Create Post</h1>
        <form className='flex flex-col gap-4' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput 
                    type='text'
                    placeholder='Title'
                    className='flex-1'
                    id='title'
                    onChange={(e) => setFormData({ ...formData1, title: e.target.value })}
                />
                <Select onChange={(e) => setFormData({ ...formData1, category: e.target.value })}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nodejs">Node.js</option>
                    <option value="mongodb">Mongo DB</option>
                    <option value="other">Other</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-dotted border-teal-500 p-3'>
                <FileInput 
                    type='file'
                    accept='image/*'
                    name='imageFile'
                    onChange={handleImage}
                />
                <Button
                    type='button'
                    gradientDuoTone='purpleToBlue'
                    size='sm'
                    outline
                    onClick={() => uploadImage(image1)}
                    disabled={uploading}
                >
                    {
                        uploading ? 'Uploading...' : 'Upload'
                    }
                </Button>
            </div>
            {
                imageError && <Alert color='failure'>
                    {imageError}
                </Alert>
            }
            {
                formData1?.image && (
                    <img src={formData1?.image} alt="upload" className='w-full h-72 object-cover' />
                )
            }
            <ReactQuill ref={quillRef} theme="snow" placeholder='Write something..' className='h-72 mb-12' required onChange={(e) => setFormData({ ...formData1, content: e })} />
            <Button gradientDuoTone='purpleToPink' type='submit'>
                Publish
            </Button>
            {
                publishError && (
                    <Alert color='failure' className='mt-5'>
                        {publishError}
                    </Alert>
                )
            }
        </form>
    </div>
  )
}
