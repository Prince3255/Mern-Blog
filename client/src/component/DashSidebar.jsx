import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserSuccess } from '../redux/user/userSlice'

export default function DashSidebar() {
  const location = useLocation()
  const [ tab, setTab ] = useState('')
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search)
    const tabParam = urlParam.get('tab')

    if (tabParam) {
      setTab(tabParam)
    }
  }, [location.search])

  const dispatch = useDispatch()

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

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          { currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
            <Sidebar.Item
              active={tab === 'dash'}
              icon={HiChartPie}
              labelColor='dark'
              as='div'
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User' }
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=post'>
            <Sidebar.Item
              active={tab === 'post'}
              icon={HiDocumentText}
              labelColor='dark'
              as='div'
            >
              Post
            </Sidebar.Item>
          </Link>)
          }
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=user'>
            <Sidebar.Item
              active={tab === 'user'}
              icon={HiOutlineUserGroup}
              labelColor='dark'
              as='div'
            >
              User
            </Sidebar.Item>
          </Link>)
          }
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comment'>
            <Sidebar.Item
              active={tab === 'comment'}
              icon={HiAnnotation}
              labelColor='dark'
              as='div'
            >
              Comment
            </Sidebar.Item>
          </Link>)
          }
          <Sidebar.Item
            icon={HiArrowRight}
            className='cursor-pointer'
            onClick={handleLogout}
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
