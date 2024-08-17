import { Outlet } from 'react-router-dom';
import { useGetUserStatusQuery } from '../../store/accountApiSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @description: Redirect user to login page if user is not logged in and wants to enter account related pages
 */
const AccountRouter: React.FC = () => {
    const { isSuccess: isUserLoggedIn } = useGetUserStatusQuery();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isUserLoggedIn) {
            navigate('/login');
        }
    }, [isUserLoggedIn, navigate]);
    return <Outlet />;
};

export default AccountRouter;
