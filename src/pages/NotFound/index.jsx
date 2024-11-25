import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1);
      };

  return (
    <div className='flex flex-col w-full justify-center items-center'>
        <div className='flex self-center items-center flex-col mb-5'>
            <h1 className='main-header text-center'>Page Not Found</h1>
              <button
                className='bg-blue-700 px-6 py-3 text-white font-semibold border-2 border-black mt-5 hover:text-yellow-200'
                onClick={() => handleGoBack()}     
              >
                Go Back
              </button>

        </div>
    </div>
  )
}

export default NotFound