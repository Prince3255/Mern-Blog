import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Select, TextInput, Spinner } from 'flowbite-react'
import PostCard from '../component/PostCard'

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState([])
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParam.get('searchTerm')
    const sortFromUrl = urlParam.get('sort')
    const categoryFromUrl = urlParam.get('category')

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
        setSidebarData((prevData) => ({
            ...prevData,
            searchTerm: searchTermFromUrl || prevData.searchTerm,
            sort: sortFromUrl || prevData.sort,
            category: categoryFromUrl || prevData.category
        }))
    }

    const fetchPost = async () => {
        setLoading(true)
        try {
            const queryTerm = urlParam.toString()

            const response = await fetch(`/api/post/getpost?${queryTerm}`, {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }
            
            if (response.ok) {
                const data = await response.json()
                setPost(data.post)

                if (data.post.length === 9) {
                    setShowMore(true)
                }
                else {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    fetchPost()

  }, [location.search])

  const handleChange = (e) => {
    const { id, value } = e.target

    setSidebarData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParam = new URLSearchParams(location.search)
    if (!sidebarData.searchTerm && sidebarData.sort === 'desc' && sidebarData.category === 'uncategorized') {
        navigate('/search')
    }
    else {
        urlParam.set('searchTerm', sidebarData.searchTerm)
        urlParam.set('sort', sidebarData.sort)
        urlParam.set('category', sidebarData.category)
        const queryTerm = urlParam.toString()
        navigate(`/search?${queryTerm}`)
    }
  }

  const handleShowMore = async () => {
    const startIndex = post.length
    const urlParam = new URLSearchParams(location.search)
    urlParam.set('startIndex', startIndex)
    const queryTerm = urlParam.toString()
    setLoading(true)
    try {
        const res = await fetch(`/api/post/getpost?${queryTerm}`, {
            method: 'POST'
        });
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        if (res.ok) {
            const data = await res.json();
            setPost([...post, ...data.post]);
            if (data.post.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    } catch (error) {
        console.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex gap-2 items-center'>
                    <label htmlFor="searchTerm" className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput placeholder='Search..' id='searchTerm' value={sidebarData.searchTerm} type='text' onChange={handleChange} />
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor="sort" className='font-semibold'>Sort:</label>
                    <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                        <option value="desc">Latest</option>
                        <option value="asc">Oldest</option>
                    </Select>
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor="category" className='font-semibold'>Category:</label>
                    <Select onChange={handleChange} value={sidebarData.category} id='category'>
                        <option value="uncategorized">Uncategorized</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                        <option value="javascript">JavaScript</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>
                    Apply Filter
                </Button>
            </form>
        </div>
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post results:</h1>
            <div className='flex flex-wrap gap-4 p-7'>
                {
                    !loading && post.length === 0 && (
                        <p className='text-xl text-gray-500'>No post found</p>
                    )
                }
                {
                    loading && (
                        <div className='flex justify-center items-center min-h-screen'>
                          <Spinner size='xl' />
                        </div>
                    )
                }
                {
                    !loading && post && post.map((post1) => (
                        <PostCard key={post1._id} post={post1} />
                    ))
                }
                {
                    showMore && (
                        <button className='text-teal-500 text-lg p-7 cursor-default w-full' onClick={handleShowMore}>
                            <span className='hover:underline cursor-pointer'>
                            Show More
                            </span>
                        </button>
                    )
                }
            </div>
        </div>
    </div>
  )
}
