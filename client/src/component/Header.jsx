import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { logoutUserSuccess } from '../redux/user/userSlice'

export default function Header() {
    const path = useLocation().pathname
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.user)
    const { theme } = useSelector((state) => state.theme)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const urlParam = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParam.get('searchTerm')

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/user/logout', {
            method: 'POST'
          })
    
          const data = await response.json()
    
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

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParam = new URLSearchParams(location.search)
        urlParam.set('searchTerm', searchTerm)
        const searchQuery = urlParam.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handleButtonClick = () => {
        navigate('/search')
    }

  return (
    <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Prince</span>
            Blog
        </Link>
        <form onSubmit={handleSubmit}>
            <TextInput 
                type='text'
                placeholder='Search..'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
                value={searchTerm}
                onChange={(e) => (setSearchTerm(e.target.value))}
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill onClick={handleButtonClick}>
            <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' onClick={() => dispatch(toggleTheme())}>
                {
                    theme === 'light' ? <FaSun /> : <FaMoon />
                }
            </Button>
            {
                currentUser ? (
                    <Dropdown
                        inline
                        arrowIcon={false}
                        label={
                            <Avatar alt='user' img={currentUser.profilePicture} rounded />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to='/dashboard?tab=profile'>
                            <Dropdown.Item>
                                Profile
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )
            }
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/project'} as={'div'}>
                <Link to='/project'>Project</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
