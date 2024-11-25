import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentCard from './CommentCard';
import Cookies from 'js-cookie';
import { useUser } from '../../../auth/UserContext';
import { API_URL } from '../../../constants';

const Comments = ({postId}) => {
    const navigate = useNavigate()

    const [comments, setComments] = useState([])
    const [users, setUsers] = useState([])
    const loggedUser = useUser()

    const [commentContent, setCommentContent] = useState('')
    const [commentRating, setCommentRating] = useState('')

    const [commentContentError, setCommentContentError] = useState('')
    const [commentRatingError, setCommentRatingError] = useState('')

    const [showCreateCommentModal, setShowCreateCommentModal] = useState(false)

    const fetchComments = () => {
      fetch(`${API_URL}/api/posts/${postId}/comments`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          return response.json();
        })
        .then(data => {
          const sortedComments = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComments(sortedComments)
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    }

    const handleCommentDeletion = async (commentId) => {
      try {
        const jwt = Cookies.get('jwt')
        const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            credentials: 'include',
        });

        if (response.ok) {
            setComments(prevComments => prevComments.filter(c => c.id !== commentId));
            console.log('Post removed successfully');
        } else {
            console.error('Error removing post:', response.statusText);
        }
        } catch (error) {
            console.error('Error removing post:', error);
        }
    }

    const onCommentEdit = async (formData, commentId) => {
      const jwt = Cookies.get('jwt')
      const requestOptions = {
        method: 'PUT',
        credentials: 'include',
        body: formData,
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
      };
  
      try {
        const response = await fetch(`${API_URL}/api/comments/${commentId}`, requestOptions);
  
        if (!response.ok) {
          const result = await response.json();
          console.log(result);
          return;
        }
  
        fetchComments()
  
      } catch (error) {
        console.error('Request failed: ', error.message);
      }
    }

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                    const response = await fetch(`${API_URL}/api/users`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const users = await response.json();
                        setUsers(users)
                    } else {
                        navigate('/categories')
                    }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        fetchComments()
        fetchUsers()
    }, []);

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


    const handleCommentCreation = async (e) => {
      e.preventDefault();
  
      if(!validateCommentContent(commentContent) |
         !validateCommentRating(commentRating)) {
           return
         }
  
  
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('content', commentContent);
      formData.append('rating', commentRating)


      const jwt = Cookies.get('jwt')
      const requestOptions = {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
      };
  
      try {
        const response = await fetch(`${API_URL}/api/comments`, requestOptions);
  
        if (!response.ok) {
          const result = await response.json();
          console.log(result);
          return;
        }
  
        setCommentContent('')
        setCommentRating('')
        setCommentContentError('')
        setCommentRatingError('')
        setShowCreateCommentModal(false)
        fetchComments()
  
      } catch (error) {
        console.error('Request failed: ', error.message);
      }
    };

    return (
      <div className='flex flex-col w-full justify-center items-center'>
        <div className='flex self-center items-center flex-col mb-5'>
            <h1 className='main-header text-center'>{comments.length <= 0 ? 'There are no comments' : 'Comments:'}</h1>
            {loggedUser && (
              <button
                className='bg-blue-700 px-6 py-3 text-white font-semibold border-2 border-black mt-5 hover:text-yellow-200'
                onClick={() => setShowCreateCommentModal(true)}
                >
                    Add comment
              </button>
            )}
        </div>

        {showCreateCommentModal && (
            <div className='flex flex-col w-11/12 sm:w-3/5 md:w-2/5 mt-5 pb-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner justify-center items-center relative'>
              <FontAwesomeIcon
                icon={faX}
                className='absolute top-2 right-2 cursor-pointer text-lg'
                onClick={() => {setCommentContent('');setCommentRating('');setCommentContentError('');setCommentRatingError('');setShowCreateCommentModal(false)}}
                />
                  <form onSubmit={handleCommentCreation} className='flex flex-col items-center justify-center w-full items-center justify-center gap-4 m-5 '>
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

        <button type='submit' className='submit-btn'>Create</button>

      </form>
    </div>
        )}
        
        {comments.map((comment, index) => {
         return <CommentCard
                  key={index}
                  postId={postId}
                  comment={comment}
                  author={users.find(u => u.id == comment.userId)}
                  loggedUser={loggedUser}
                  onDeleteConfirmation={handleCommentDeletion}
                  onCommentEdit={onCommentEdit}
                  />
        })}
      </div>

    );
};
export default Comments;