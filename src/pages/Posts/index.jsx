import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostCard from './PostCard';
import Cookies from 'js-cookie';
import { API_URL } from '../../constants';

const Posts = () => {
    const navigate = useNavigate()
    const {categoryId} = useParams()

    const [posts, setPosts] = useState([])
    const [loggedUser, setLoggedUser] = useState(null)
    const [category, setCategory] = useState(null)

    const handleDeleteConfirmation = async (postId) => {
        try {
            const jwt = Cookies.get('jwt')
            const response = await fetch(`${API_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
                console.log('Post removed successfully');
            } else {
                console.error('Error removing post:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };

    useEffect(() => {

        const getLoggedUser = async() => {
            const jwt = Cookies.get("jwt")
            if(jwt == undefined) return
            try {
              const response = await fetch(`${API_URL}/api/auth`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwt}`
                },
                credentials: 'include'
              });
        
              if (response.ok) {
                const user = await response.json()
                setLoggedUser(user)
              }
        
            } catch (error) {
              console.error('Error fetching data:', error.message);
            }
          }

          const fetchCategory = () => {
            fetch(`${API_URL}/api/categories`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to fetch categories');
                }
                return response.json();
              })
              .then(data => {
                setCategory(data.find(c => c.id === categoryId))
              })
              .catch(error => {
                console.error('Error fetching categories:', error);
              });
          }

        const fetchPosts = async () => {
            try {
                    const response = await fetch(`${API_URL}/api/categories/${categoryId}/posts`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const posts = await response.json();
                        setPosts(posts);
                    } else {
                        navigate('/categories')
                    }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        getLoggedUser();
        fetchCategory();
        fetchPosts();
    }, []);

    return (
        <div className='flex flex-col w-full'>

            <div className='flex self-center items-center mt-6'>
                <h1 className='main-header text-center'>{`${category !== null ? category.title : ''} Posts`}</h1>
                <Link to='/categories/' className='absolute left-10 top-15 text-2xl'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
            </div>

            {loggedUser && (
                <div className='flex gap-5 flex-col items-center justify-center self-center w-full my-5 '>
                    <Link to={`/categories/${categoryId}/create-post`}>
                        <button className='bg-blue-700 px-6 py-3 text-white font-semibold border-2 border-black'>
                            Create post
                        </button>
                    </Link>
                </div>
            )}

            <div className='grid grid-cols-1 w-7/12 custom1:grid-cols-2 custom1:w-10/12 custom2:grid-cols-3 custom2:w-11/12 gap-6 mx-auto my-5 justify-center items-center'>
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} onDeleteConfirmation={handleDeleteConfirmation} loggedUser={loggedUser} categoryId={categoryId}/>
                ))}
            </div>

        </div>

    );
};
export default Posts;