import React, { useEffect, useState } from 'react'
import DashSidebar from '../component/DashSidebar'
import DashProfile from '../component/DashProfile'
import { useLocation } from 'react-router-dom'
import DashPost from '../component/DashPost'
import DashUser from '../component/DashUser'
import DashComment from '../component/DashComment'
import DashboardComp from '../component/DashboardComp'

export default function Dashboard() {
  const location = useLocation()
  const [ tab, setTab ] = useState('')

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search)
    const tabParam = urlParam.get('tab')

    if (tabParam) {
      setTab(tabParam)
    }
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {
        tab === 'profile' && <DashProfile />
      }
      {
        tab === 'post' && <DashPost />
      }
      {
        tab === 'user' && <DashUser />
      }
      {
        tab === 'comment' && <DashComment />
      }
      {
        tab === 'dash' && <DashboardComp />
      }
    </div>
  )
}
