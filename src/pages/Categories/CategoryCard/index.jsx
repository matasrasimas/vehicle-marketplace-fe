import { faPenToSquare, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CategoryCard = ({ category, onDeleteConfirmation, loggedUser }) => {
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            <div className='flex flex-col w-4/5 transition-transform duration-300 transform hover:scale-105 z-0 mb-5'>
                <Link to={`/categories/${category.id}/posts`}
                        className='flex flex-col items-center border-2 border-gray-500 shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer h-[200px] mt-8 w-full'>
                    <div
                        className='relative flex items-center justify-center h-full w-full bg-cover bg-center'
                        style={{
                        backgroundImage: category.image
                            ? `url(data:image/png;base64,${category.image})`
                            : 'none',
                        }}
                    >
                        {category.image && (
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        )}
            
                        <p className='absolute text-white text-3xl font-bold bg-black/50 px-2 py-1 rounded'>
                        {category.title}
                        </p>
                    </div>
                </Link>

                {loggedUser !== undefined && loggedUser !== null && loggedUser.role === 'ADMIN' && (
                    <div className='flex flex-row w-full mb-8'>
                            <button 
                            className='flex items-center justify-center gap-2 bg-blue-500 w-full text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                            onClick={() => navigate(`/edit-category/${category.id}`)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span className='hidden sm:block'>Edit</span>
                            </button>
                            <button 
                            className='flex items-center justify-center gap-2 bg-red-500 w-full h-10 text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                            onClick={() => setShowDeleteConfirmationModal(true)}>
                                <FontAwesomeIcon icon={faTrashCan} />
                                <span className='hidden sm:block'>Delete</span>
                            </button>
                    </div>
                )}
            </div>
            {showDeleteConfirmationModal && (
            <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='flex flex-col items-center justify-center bg-sky-800 rounded-md w-11/12 sm:w-4/5 md:w-3/5'>
                <div className='flex flex-row justify-between bg-black w-full px-3 py-1 items-center'>
                <p className='text-white font-bold font-sans tracking-wide'>Confirmation</p>
                <FontAwesomeIcon icon={faXmark} onClick={() => setShowDeleteConfirmationModal(false)} className='text-white font-bold text-lg cursor-pointer' />
                </div>
                <div className='flex flex-col gap-5 py-5 w-full items-center text-center'>
                <p className='font-bold text-white font-sans tracking-wide text-lg'>Are you sure you want to delete category {`'${category.title}'`}?</p>
                <div className='flex flex-row justify-center gap-10'>
                    <button
                    className='w-20 h-9 bg-red-700 text-white rounded font-bold'
                    onClick={() => {setShowDeleteConfirmationModal(false);onDeleteConfirmation(category.id)}}
                    >
                    Yes
                    </button>
                    <button
                    className='w-20 bg-gray-300 text-gray-800 rounded font-bold'
                    onClick={() => setShowDeleteConfirmationModal(false)}
                    >
                    No
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </>
    );
  };
  
  export default CategoryCard;