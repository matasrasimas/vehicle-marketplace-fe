import { faCircleUser, faPenToSquare, faStar, faStarAndCrescent, faTrashCan, faX, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

const CommentCard = ({ postId, comment, author, loggedUser, onDeleteConfirmation, onCommentEdit}) => {
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [showEditCommentModal, setShowEditCommentModal] = useState(false)

    const [commentContent, setCommentContent] = useState('')
    const [commentRating, setCommentRating] = useState('')

    const [commentContentError, setCommentContentError] = useState('')
    const [commentRatingError, setCommentRatingError] = useState('')

    const validateCommentContent = (commentContent) => {
        if (commentContent === '') {
          setCommentContentError('Comment cannot be empty!');
          return false;
        }
        setCommentContentError('')
        return true;
      }
  
    const validateCommentRating = (commentRating) => {
        if (commentRating === '') {
          setCommentRatingError('Please select a rating!');
          return false;
        }
        setCommentRatingError('')
        return true;
      }

    const handleCommentEdit = async (e) => {
        e.preventDefault();
    
        if(!validateCommentContent(commentContent) |
           !validateCommentRating(commentRating)) {
             return
           }
    
    
        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('content', commentContent);
        formData.append('rating', commentRating)

        onCommentEdit(formData, comment.id)

        setCommentContent('')
        setCommentRating('')
        setCommentContentError('')
        setCommentRatingError('')
        setShowEditCommentModal(false)
      };

    function formatDateTime(input) {
        // Replace space with 'T' to make it ISO 8601 compatible
        let isoString = input.replace(' ', 'T');

        // Parse the string into a Date object
        let date = new Date(isoString);

        // Check if the date is valid
        if (isNaN(date)) {
            throw new Error("Invalid date string");
        }

        // Extract components
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');

        // Format to 'YYYY-MM-DD-HH-MM'
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    useEffect(() => {
        setCommentContent(comment.content)
        setCommentRating(comment.rating)
    }, [showEditCommentModal])

    return (
        <>
            {showEditCommentModal ? (
            <div className='flex flex-col w-11/12 sm:w-3/5 md:w-2/5 mt-5 pb-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner justify-center items-center relative'>
              <FontAwesomeIcon
                icon={faX}
                className='absolute top-2 right-2 cursor-pointer text-lg'
                onClick={() => {setCommentContent('');setCommentRating('');setCommentContentError('');setCommentRatingError('');setShowEditCommentModal(false)}}
                />
                  <form onSubmit={handleCommentEdit} className='flex flex-col items-center justify-center w-full items-center justify-center gap-4 m-5 '>
                     <div className='flex flex-col w-full justify-center items-center gap-0.5'>
                      <div className='flex flex-col w-full justify-center items-center'>
                        <label htmlFor="comment-content" className='input-label'>Comment:</label> 
                        <textarea
                          type="text"
                          name='comment-content'
                          value={commentContent}
                          onChange={e => setCommentContent(e.target.value)}
                          className={`w-11/12 h-[150px] bg-white rounded-md border-2 pl-3 ${commentContentError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>

                     </div>
                      {commentContentError != '' && <p className='text-red-500'>{commentContentError}</p>}
                    </div>

            <div className='flex flex-col w-full justify-center items-center gap-0.5 mb-5'>
              <label htmlFor="comment-rating" className='input-label'>Rating:</label>
              <select
                name='comment-rating'
                value={commentRating}
                onChange={e => setCommentRating(e.target.value)} 
                className={`w-[20%] h-10 rounded-md border-2 pl-3 font-semibold bg-white ${commentRatingError !== '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}
              >
                <option value="" disabled>-</option>
                {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                ))}
             </select>
            {commentRatingError !== '' && <p className='text-red-500'>{commentRatingError}</p>}
        </div>

        <button type='submit' className='submit-btn'>Edit</button>

      </form>
    </div>
        ) : (
        
            <div className='flex flex-col w-full items-center justify-center'>
                <div className='flex flex-col w-11/12 sm:w-3/5 md:w-2/5 mt-5 py-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner'>
                    {author && (
                        <div className='flex w-full gap-5 pl-5 items-center justify-start'>
                            <div className='flex gap-2'>
                                <FontAwesomeIcon icon={faCircleUser} className='text-3xl' />
                                <h3 className='font-bold font-sans text-lg'>{author.firstName} {author.lastName}</h3>
                            </div>
                            <p className='font-sans text-gray-500'>Created at: {formatDateTime(comment.createdAt)}</p>
                        </div>)}

                    {comment && comment.content != null && (
                        <div className='flex flex-row gap-3 justify-center'>
                            {comment && <p className='font-sans font-semibold'>{comment.content}</p>}
                        </div>
                    )}

                    {comment && comment.rating != null && (
                        <div className='flex w-full justify-end items-center text-lg pr-5'>
                            {[...Array(comment.rating)].map((_, index) => (
                                <FontAwesomeIcon 
                                    key={index} 
                                    icon={faStar}  
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex flex-row mb-8 h-[35px] w-11/12 sm:w-3/5 md:w-2/5'>
                {loggedUser !== null && loggedUser.id === comment.userId && (
                    <button 
                    className='flex items-center justify-center gap-2 bg-blue-500 w-full text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                    onClick={() => setShowEditCommentModal(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <span className='hidden sm:block'>Edit</span>
                    </button>
                )}

                {loggedUser !== null && (loggedUser.role === 'ADMIN' || loggedUser.id === comment.userId) && (
                    <button 
                    className='flex items-center justify-center gap-2 bg-red-500 w-full text-white font-bold text-lg shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer hover:text-black'
                    onClick={() => setShowDeleteConfirmationModal(true)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span className='hidden sm:block'>Delete</span>
                    </button>
                )}
                </div>

            </div>
        )}

                {showDeleteConfirmationModal && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='flex flex-col items-center justify-center bg-sky-800 rounded-md w-11/12 sm:w-4/5 md:w-3/5'>
                        <div className='flex flex-row justify-between bg-black w-full px-3 py-1 items-center'>
                        <p className='text-white font-bold font-sans tracking-wide'>Confirmation</p>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setShowDeleteConfirmationModal(false)} className='text-white font-bold text-lg cursor-pointer' />
                        </div>
                        <div className='flex flex-col gap-5 py-5 w-full items-center text-center'>
                        <p className='font-bold text-white font-sans tracking-wide text-lg'>Are you sure you want to delete this comment?</p>
                        <div className='flex flex-row justify-center gap-10'>
                            <button
                            className='w-20 h-9 bg-red-700 text-white rounded font-bold'
                            onClick={() => {setShowDeleteConfirmationModal(false);onDeleteConfirmation(comment.id)}}
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
    )
}

export default CommentCard