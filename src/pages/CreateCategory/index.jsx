import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import './styles.css'
import { API_URL } from '../../constants';


const CreateCategory = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [existingCategories, setExistingCategories] = useState([]);
    const [titleError, setTitleError] = useState('');
  
    useEffect(() => {
      const fetchCategories = () => {
          fetch(`${API_URL}/api/categories`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch categories');
              }
              return response.json();
            })
            .then(data => {
              setExistingCategories(data);
            })
            .catch(error => {
              console.error('Error fetching categories:', error);
            });
      }

      fetchCategories()
    }, []);
  
    const handleFileChange = (e) => {
      setImageFile(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (title === '') {
        setTitleError('Title cannot be empty!');
        return;
      }
  
      if (existingCategories.some(c => c.title.toLowerCase() === title.toLowerCase())) {
        setTitleError('Category with this title already exists!');
        return;
      }
  
      // Prepare form data for the request
      const formData = new FormData();
      formData.append('title', title);
      if (imageFile) {
        formData.append('image', imageFile);
      }

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
        const response = await fetch(`${API_URL}/api/categories`, requestOptions);
  
        if (!response.ok) {
          const result = await response.json();
          return;
        }
  
        setTitleError('');
        navigate('/categories');
  
      } catch (error) {
        console.error('Request failed: ', error.message);
      }
    };
  
    return (
      <div className='flex flex-col items-center w-full'>
        <div className='flex items-center mt-6 flex-col'>
          <Link to='/categories' className='text-2xl mb-2 sm:absolute sm:left-10 sm:top-25'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className='main-header'>Create Category</h1>
        </div>
  
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-2/3 gap-4 m-5'>
          <div className='flex flex-col gap-0.5 w-full items-center content-center'>
            <div className='flex flex-col'>
              <label htmlFor="title" className='input-label'>Title</label>
              <input
                type="text"
                name='title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${titleError !== '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}
              />
            </div>
            {titleError !== '' && <p className='text-red-500 text-center'>{titleError}</p>}
          </div>
  
          <div className='flex flex-col gap-0.5 w-full items-center content-center'>
            <div className='flex flex-col'>
                <label htmlFor="image" className='input-label'>Upload Image</label>
                <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className='w-56 h-8 rounded-md border-2 pl-3 bg-neutral-300 h-10 items-center content-center border-slate-900'
                />
            </div>
          </div>
  
          <button type='submit' className='submit-btn'>Create</button>
        </form>
      </div>
    );
  };
  
  export default CreateCategory;