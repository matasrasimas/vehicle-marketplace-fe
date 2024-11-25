import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Home } from './pages/Home'
import Categories from './pages/Categories'
import Navbar from './Navbar'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import CreateCategory from './pages/CreateCategory'
import EditCategory from './pages/EditCategory'
import Login from './pages/Login'
import Register from './pages/Register'
import Posts from './pages/Posts'
import PostCard from './pages/Posts/PostCard'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Post from './pages/Post'
import NotFound from './pages/NotFound'
import AdminProtectedRoutes from './auth/AdminProtectedRoutes'
import AuthRoutes from './auth/AuthRoutes'
import UserProtectedRoutes from './auth/UserProtectedRoutes'
import GuestProtectedRoutes from './auth/GuestProtectedRoutes'
import Profile from './pages/Profile'
import Profiles from './pages/Profiles'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>

      <Routes>

        <Route path='/' element={<Home/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>

        <Route element={<AuthRoutes/>}>

            <Route path='/categories' element={<Categories/>}></Route>
            <Route path='categories/:categoryId/posts' element={<Posts/>}></Route>
            <Route path='/categories/:categoryId/posts/:postId' element={<Post/>}></Route>

            <Route element={<GuestProtectedRoutes/>}>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<Register/>}></Route>
            </Route>

            <Route element={<UserProtectedRoutes/>}>
                <Route path='/categories/:categoryId/create-post' element={<CreatePost/>}></Route>
                <Route path='/categories/:categoryId/edit-post/:postId' element={<EditPost/>}></Route>
                <Route path='/profiles/:userId' element={<Profile/>}></Route>
            </Route>

            <Route element={<AdminProtectedRoutes/>}>
                <Route path='/create-category' element={<CreateCategory/>}></Route>
                <Route path='/edit-category/:id' element={<EditCategory/>}></Route>
                <Route path='/profiles' element={<Profiles/>}></Route>
            </Route>

        </Route>

      </Routes>


    </>
  )
}

export default App
