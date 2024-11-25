import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faCircleUser,  } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';


const ProfileCard = ({ user }) => {
    const navigate = useNavigate()

    return (
        <>
            <div className='flex flex-col w-full transition-transform duration-300 transform hover:scale-105 z-0 justify-self-center'>
                <Link to={`/profiles/${user.id}`}>
                    <div className='flex flex-col items-center border-2 border-gray-500 p-3 gap-3 shadow-sm shadow-gray-500 hover:shadow-md hover:shadow-gray-500 cursor-pointer'>
                        <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                            <FontAwesomeIcon icon={faCircleUser} className="text-[90px]" />
                        </div>

                        <p className='card-text'>{user.username}</p>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default ProfileCard;