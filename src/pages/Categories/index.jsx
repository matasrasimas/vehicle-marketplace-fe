import React, { useEffect, useState } from 'react'
import CategoryCard from './CategoryCard';
import { Link } from 'react-router-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { API_URL } from '../../constants';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loggedUser, setLoggedUser] = useState(null);
  
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
            setCategories(data);
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      }

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

      getLoggedUser()
      fetchCategories()
    }, []);

    const handleDeleteConfirmation = async (categoryId) => {
        try {
            const jwt = Cookies.get('jwt')
            const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
                console.log('Category removed successfully');
            } else {
                console.error('Error removing category:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing category:', error);
        }
    };
  
    return (
      <div className='flex flex-col items-center w-full'>
        <h1 className='main-header'>Select a category</h1>

        {loggedUser !== null && loggedUser !== undefined && loggedUser.role === 'ADMIN' && (
          <Link to='/create-category'>
              <button className='bg-blue-700 px-6 py-3 text-white font-semibold border-2 border-black mt-5 hover:text-yellow-200'>
                  Create category
              </button>
          </Link>
        )}

        <div className='flex flex-col items-center w-full'>
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} onDeleteConfirmation={handleDeleteConfirmation} loggedUser={loggedUser}/>
          ))}
        </div>
      </div>
    );
  };
  
  export default Categories;