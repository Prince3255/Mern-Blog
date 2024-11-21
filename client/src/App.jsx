import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import SignIn from './page/SignIn'
import SignUp from './page/SignUp'
import Dashboard from './page/Dashboard'
import Project from './page/Project'
import Header from './component/Header'
import About from './page/About'
import Footerc from './component/Footerc'
import PrivateRoute from './component/PrivateRoute'
import OnlyAdminPrivateRoute from './component/OnlyAdminPrivateRoute'
import CreatePost from './page/CreatePost'
import UpdatePost from './page/UpdatePost'
import PostPage from './page/PostPage'
import ScrollToTop from './component/ScrollToTop'
import Search from './page/Search'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />}/>
          <Route path='/update-post/:postId' element={<UpdatePost />}/>
        </Route>
        <Route path='/project' element={<Project />}/>
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footerc />
    </BrowserRouter>
  )
}
