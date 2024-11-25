import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faPenToSquare, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './styles.css'
import { useState } from 'react';


const PostCard = ({ post, onDeleteConfirmation, loggedUser, categoryId }) => {
    const navigate = useNavigate()
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)

    return (
        <>
            <div className='flex flex-col w-full transition-transform duration-300 transform hover:scale-105 z-0 justify-self-center'>
                <Link to={`/categories/${categoryId}/posts/${post.id}`}>
                    <div className='flex flex-col items-center border-2 border-gray-500 p-3 gap-3 shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer'>
                    {
                      post.image ? (
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <img 
                                src={`data:image/png;base64,${post.image}`} 
                                alt={`${post.brand} ${post.model}`} 
                                className="w-full h-full" 
                            />
                        </div>
                    ) : (
                        <div
                            className="w-full h-[300px] bg-gray-200 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faCar} className="text-[90px]" />
                        </div>
                    )
                  }
                        <p className='card-text'>{post.brand + ' ' + post.model}</p>
                        <p className='card-text'>{post.price} €</p>
                    </div>
                </Link>

                    <div className='flex flex-row w-full mb-8 h-[35px]'>

                            {loggedUser !== null && loggedUser.id === post.userId && (
                                <button 
                                className='flex items-center justify-center gap-2 bg-blue-500 w-full text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                                onClick={() => navigate(`/categories/${categoryId}/edit-post/${post.id}`)}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    <span className='hidden sm:block'>Edit</span>
                                </button>
                            )}

                            {loggedUser !== null && (loggedUser.role === 'ADMIN' || loggedUser.id === post.userId) && (
                                <button 
                                className='flex items-center justify-center gap-2 bg-red-500 w-full text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                                onClick={() => setShowDeleteConfirmationModal(true)}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    <span className='hidden sm:block'>Delete</span>
                                </button>
                            )}
                    </div>
            </div>
            {showDeleteConfirmationModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='flex flex-col items-center justify-center bg-sky-800 rounded-md w-11/12 sm:w-4/5 md:w-3/5'>
                    <div className='flex flex-row justify-between bg-black w-full px-3 py-1 items-center'>
                    <p className='text-white font-bold font-sans tracking-wide'>Confirmation</p>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setShowDeleteConfirmationModal(false)} className='text-white font-bold text-lg cursor-pointer' />
                    </div>
                    <div className='flex flex-col gap-5 py-5 w-full items-center text-center'>
                    <p className='font-bold text-white font-sans tracking-wide text-lg'>Are you sure you want to delete post {`'${post.brand + ' ' + post.model}'`}?</p>
                    <div className='flex flex-row justify-center gap-10'>
                        <button
                        className='w-20 h-9 bg-red-700 text-white rounded font-bold'
                        onClick={() => {setShowDeleteConfirmationModal(false);onDeleteConfirmation(post.id)}}
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

export default PostCard;