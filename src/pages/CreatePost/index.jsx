import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../../auth/UserContext';
import { API_URL } from '../../constants';


const CreatePost = () => {
  const {categoryId} = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)

  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [manufactureYear, setManufactureYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const loggedUser = useUser();

  const [brandError, setBrandError] = useState('')
  const [modelError, setModelError] = useState('')
  const [manufactureYearError, setManufactureYearError] = useState('')
  const [priceError, setPriceError] = useState('')

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
            setCategory(data.find(c => c.id === categoryId))
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      }

    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(!validateBrand(brand) |
    !validateModel(model) |
    !validateManufactureYear(manufactureYear) |
    !validatePrice(price)) {
      console.log('There are errors in registration form')
      return
    }


    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('description', description);
    formData.append('manufactureYear', manufactureYear);
    formData.append('price', price);
    if (imageFile) 
      formData.append('image', imageFile);
    if(description !== '')
      formData.append('description', description)
    if(mileage !== '')
      formData.append('mileage', mileage)


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
      const response = await fetch(`${API_URL}/api/posts`, requestOptions);

      if (!response.ok) {
        const result = await response.json();
        console.log(result);
        return;
      }

      navigate(`/categories/${categoryId}/posts`);
  }  catch (error) {
    console.error('Request failed: ', error.message);
  }
}

  const validateBrand = (brand) => {
    if (brand.length == 0) {
      setBrandError('Brand cannot be empty!')
      return false
    } else {
      setBrandError('')
      return true
    }
  }

  const validateModel = (model) => {
    if (model.length == 0) {
      setModelError('Model cannot be empty!')
      return false
    } else {
      setModelError('')
      return true
    }
  }

  const validateManufactureYear = (manufactureYear) => {
    if (manufactureYear === '' || manufactureYear < 1900 || manufactureYear > new Date().getFullYear()) {
      setManufactureYearError(`Manufacture year must be between 1900 and ${new Date().getFullYear()}!`)
      return false
    } else {
      setManufactureYearError('')
      return true
    }
  }

  const validatePrice = (price) => {
    if (price === '' || price < 1) {
      setPriceError('Price must be greater than 0!')
      return false
    } else {
      setPriceError('')
      return true
    }
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex items-center mt-6'>
          <h1 className='main-header'>{`Create ${category !== null ? category.title : ''} Post`}</h1>
          <Link to={`/categories/${categoryId}/posts`} className='absolute left-10 top-15 text-2xl'>
              <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-2/3 gap-4 m-5 '>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="brand" className='input-label'>Brand</label> 
            <input
              type="text"
              name='brand'
              value={brand}
              onChange={e => setBrand(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${brandError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>

          </div>
            {brandError != '' && <p className='text-red-500'>{brandError}</p>}
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="model" className='input-label'>Model</label> 
            <input
              type="text"
              name='model'
              value={model}
              onChange={e => setModel(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${modelError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>

          </div>
            {modelError != '' && <p className='text-red-500'>{modelError}</p>}
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="description" className='input-label'>Description</label> 
            <input
              type="text"
              name='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='w-56 h-8 rounded-md border-2 pl-3 font-semibold border-slate-900 bg-neutral-300'/>
          </div>
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="manufactureYear" className='input-label'>Manufacture year</label> 
            <input
              type="number"
              name='manufactureYear'
              value={manufactureYear}
              min={1900}
              max={new Date().getFullYear()}
              onChange={e => setManufactureYear(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${manufactureYearError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
          {manufactureYearError != '' && <p className='text-red-500'>{manufactureYearError}</p>}
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="mileage" className='input-label'>Mileage</label> 
            <input
              type="number"
              name='mileage'
              value={mileage}
              min={0}
              max={9999999}
              onChange={e => setMileage(e.target.value)}
              className='w-56 h-8 rounded-md border-2 pl-3 font-semibold border-slate-900 bg-neutral-300'/>
          </div>
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="price" className='input-label'>Price</label> 
            <input
              type="number"
              name='price'
              value={price}
              min={1}
              step="any"
              onChange={e => setPrice(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${priceError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
          {priceError != '' && <p className='text-red-500'>{priceError}</p>}
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
}

export default CreatePost;