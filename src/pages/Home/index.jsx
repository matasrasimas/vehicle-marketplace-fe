import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

export const Home = () => {
  return (
    <div>
        <div className='main-container'>
           <header>Welcome to vehicle marketplace!</header>
           <Link to='/categories' className='main-container-button'>GET STARTED</Link>
        </div>
    </div>
  )
}
