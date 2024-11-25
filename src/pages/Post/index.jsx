import React, { useEffect, useState } from 'react';
import './styles.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarDays, faRoad, faMoneyBill, faCar } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons'
import Comments from './Comments';
import { API_URL } from '../../constants';

const Post = () => {

    const navigate = useNavigate()
    const {categoryId, postId} = useParams();

    const [post, setPost] = useState(null)
    const [category, setCategory] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
      
          try {
          
                  const postsResponse = await fetch(`${API_URL}/api/posts`);
                  if (!postsResponse.ok) throw new Error('Failed to fetch posts');
                  const posts = await postsResponse.json();
          
                  const post = posts.find(p => p.id === postId);
                  if (!post) {
                    console.error(`Post with id ${postId} not found`);
                    navigate('/categories');
                    return;
                  }
          
                  setPost(post);
          
                  const categoriesResponse = await fetch(`${API_URL}/api/categories`);
                  if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                  const categories = await categoriesResponse.json();
          
                  if(categories.find(c => c.id === categoryId) == null) navigate('/categories')
                  setCategory(categories.find(c => c.id === categoryId));

                } catch (error) {
                        console.error('Error fetching data:', error.message);
                    }
        };
      
        fetchData();
      }, [postId, categoryId, navigate]);


  return (

    <div className='flex flex-col w-full items-center'>
        <Link to={`/categories/${categoryId}/posts`} className='absolute left-10 top-15 text-2xl'>
            <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      <div className='flex flex-col w-11/12 sm:w-3/5 md:w-2/5 my-8 py-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner'>

        <div className='flex flex-col items-center justify-center gap-5'>
            {
                    post && post.image ? (
                        <div className="w-11/12 h-[250px] flex justify-center items-center">
                            <img 
                                src={`data:image/png;base64,${post.image}`} 
                                alt={`${post.brand} ${post.model}`} 
                                className="w-full h-full" 
                            />
                        </div>
                    ) : (
                        <div
                            className="w-11/12 h-[250px] flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faCar} className="text-[90px]" />
                        </div>
                    )
                  }
          <h2 className='font-sans font-bold uppercase text-2xl'>{post ? `${post.brand} ${post.model}` : ''}</h2>
          
        </div>

        <div className='flex flex-col w-full items-center justify-center gap-5'>

            <div className='flex flex-row gap-3 justify-center'>
              <div className='flex flex-row justify-center items-center gap-2'>
              <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-gray-800 ' />
              <p className='font-sans'>Manufacture year:</p>
              </div>
              {post && <p className='font-sans font-bold'>{post.manufactureYear}</p>}
            </div>

            {post && post.mileage != null && (
                <div className='flex flex-row gap-3 justify-center'>
                <div className='flex flex-row justify-center items-center gap-2'>
                <FontAwesomeIcon icon={faRoad} className='text-xl text-gray-800 ' />
                <p className='font-sans'>Mileage:</p>
                </div>
                {post && <p className='font-sans font-bold'>{post.mileage} km</p>}
                </div>
            )}

            <div className='flex flex-row gap-3 justify-center'>
              <div className='flex flex-row justify-center items-center gap-2'>
              <FontAwesomeIcon icon={faMoneyBill} className='text-xl text-gray-800 ' />
              <p className='font-sans'>Price:</p>
              </div>
              {post && <p className='font-sans font-bold'>{post.price} €</p>}
            </div>

        </div>

        <div className='w-11/12 h-[3px] bg-gray-600'></div>

        {post && post.description != null && (
                <div className='flex flex-row gap-3 justify-center'>
                {post && <p className='font-sans font-bold'>{post.description}</p>}
                </div>
            )}

      </div>

      <Comments postId={postId}/>

    </div>


  );
}
export default Post;