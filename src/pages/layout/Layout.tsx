import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem, Typography, Box, Link } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import {
    useGetCartItemCountQuery,
    useCreateNewCartMutation,
} from '../../store/cartApiSlice';
import {
    useGetUserStatusQuery,
    useRefreshTokenMutation,
    useLogoutMutation,
} from '../../store/accountApiSlice';
import ShoppingCartIcon from '../../components/Buttons/ShoppingCartIcon/ShoppingCartIcon';
import TabularNavBar from '../../components/TabularNavBar/TabularNavBar';
import storeLogo from '../../assets/logo.webp';
import styles from './Layout.module.scss';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import SearchInput from '../../components/SearchInput/SearchInput';
import { useDispatch } from 'react-redux';
import { setCartId as reduxSetCartId } from '../../store/cartSlice';

/**
 * @description: This component renders the main layout, it includes the top nav bar,
 * main content and footer, to build the page structure.
 */
export default function Layout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cartId, setCartId] = useState(localStorage.getItem('cart_id'));
    const [welcomeMsg, setWelcomeMsg] = useState('Hello, \nplease sign in');
    const { data: countData, refetch: refetchCount } = useGetCartItemCountQuery(
        cartId,
        {
            skip: cartId === null,
        }
    );
    const [
        createNewCart,
        {
            isError: isCreateCartError,
            isLoading: isCreateCartLoading,
            isSuccess: isCreateCartSuccess,
            data: createCartData,
        },
    ] = useCreateNewCartMutation();
    const [refreshToken] = useRefreshTokenMutation();
    const [logout] = useLogoutMutation();
    const {
        data: userStatus,
        error: userStatusError,
        isError: isUserStatusError,
        isSuccess: isUserStatusSuccess,
        isFetching: isUserStatusFetching,
        refetch: refetchUserStatus,
    } = useGetUserStatusQuery();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Profile Menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    /**
     * @description: Check if anonymous cart_id exists
     * if not: create a new one
     * if so: fetch the data of corresponding cart
     */
    useEffect(() => {
        const autoLogin = async () => {
            if (!isUserStatusFetching) {
                if (isUserStatusError) {
                    const errorStatus = (userStatusError as FetchBaseQueryError)
                        .status;
                    const errorData = (userStatusError as FetchBaseQueryError)
                        .data as {
                        detail: string;
                    };
                    if (errorStatus === 401 && errorData) {
                        if (
                            errorData.detail ===
                            'Authentication credentials were not provided.'
                        ) {
                            // try to fresh jwt token first
                            refreshToken()
                                .unwrap()
                                .then(() => {
                                    setIsLoggedIn(true);
                                })
                                .catch(async () => {
                                    setIsLoggedIn(false);
                                    /*  check if anonymous cart id is stored in localstorage,
                                    if not, create a new anonymous cart, and save the id in localstorage*/
                                    const storedCartId =
                                        localStorage.getItem('cart_id');

                                    if (!storedCartId) {
                                        createNewCart();
                                    }
                                });
                        }
                    }
                } else if (isUserStatusSuccess) {
                    setIsLoggedIn(true);
                }
            }
        };
        autoLogin();
    }, [
        createNewCart,
        userStatusError,
        refreshToken,
        isUserStatusError,
        isUserStatusFetching,
        isUserStatusSuccess,
    ]);

    /**
     * @description: Fetch the amount of shopping cart items
     */
    useEffect(() => {
        const storedCartId = localStorage.getItem('cart_id');
        if (storedCartId) {
            refetchCount();
        }
    }, [refetchCount]);

    /**
     * @description: Sync anonymous shopping cart id with local states
     */
    useEffect(() => {
        if (isLoggedIn) {
            const newCartId = userStatus ? String(userStatus.cart_id) : null;
            setCartId(newCartId);
            dispatch(reduxSetCartId(newCartId));
        } else {
            const newCartId = localStorage.getItem('cart_id');
            setCartId(newCartId);
            dispatch(reduxSetCartId(newCartId));
        }
    }, [isLoggedIn, userStatus, dispatch]);

    /**
     * @description: Render welcome message displayed in account menu
     */
    useEffect(() => {
        const getWelcomeMsg = () => {
            setWelcomeMsg(
                `Hello,\n ${
                    userStatus && !userStatusError
                        ? userStatus.first_name || 'Client'
                        : 'please sign in'
                }`
            );
        };
        getWelcomeMsg();
    }, [userStatusError, userStatus]);

    /**
     * @description: Save anonymous cart id everytime a new shopping cart is created
     */
    useEffect(() => {
        if (isCreateCartSuccess && createCartData) {
            const newCartId = createCartData.id;
            localStorage.setItem('cart_id', newCartId);
            setCartId(newCartId);
            dispatch(reduxSetCartId(newCartId));
        }
    }, [isCreateCartSuccess, createCartData, dispatch]);

    const handleClickAccountMenu = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAccountMenu = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        handleCloseAccountMenu();
        logout()
            .unwrap()
            .then(() => {
                setIsLoggedIn(false);
                createNewCart();
                refetchUserStatus();
                navigate('/');
            })
            .catch(() => {});
    };

    const handleSignIn = () => {
        handleCloseAccountMenu();
        navigate('/login/');
    };

    const isDevMode = process.env.NODE_ENV === 'development';

    const CLOUDFRONT_URL = process.env.REACT_APP_CLOUDFRONT_URL;

    return (
        <>
            <Box component='nav' className={styles.navBarTop}>
                <Button
                    className={styles.logoContainer}
                    onClick={() => navigate('/')}
                >
                    <img
                        className={styles.storeLogo}
                        src={
                            isDevMode
                                ? storeLogo
                                : `${CLOUDFRONT_URL}/logo.webp`
                        }
                        alt='store logo'
                    />
                </Button>
                <Box className={styles.search}>
                    <SearchInput />
                </Box>
                <Box className={styles.account}>
                    <Button
                        id='basic-button'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickAccountMenu}
                        className={styles.accountButton}
                    >
                        {welcomeMsg}
                    </Button>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCloseAccountMenu}
                    >
                        {isLoggedIn && (
                            <MenuItem
                                aria-labelledby='your-account'
                                onClick={() => {
                                    handleCloseAccountMenu();
                                    navigate('/my-account/');
                                }}
                            >
                                <PersonOutlineIcon />
                                <Typography sx={{ paddingLeft: 2 }}>
                                    Your Account
                                </Typography>
                            </MenuItem>
                        )}
                        <MenuItem
                            aria-labelledby='login'
                            onClick={handleSignIn}
                        >
                            <LoginIcon />
                            <Typography sx={{ paddingLeft: 2 }}>
                                Sign in
                            </Typography>
                        </MenuItem>
                        {isLoggedIn && (
                            <MenuItem
                                aria-labelledby='logout'
                                onClick={handleSignOut}
                            >
                                <LogoutIcon />
                                <Typography sx={{ paddingLeft: 2 }}>
                                    Sign Out
                                </Typography>
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
                <Button
                    className={styles.clickBox}
                    onClick={() => {
                        navigate(`/cart/${cartId}/`);
                    }}
                    disabled={isCreateCartError || isCreateCartLoading}
                >
                    <div className={styles.cart}>
                        <ShoppingCartIcon itemCount={countData?.count || 0} />
                        <div className={styles.cartTextContainer}>
                            <div className={styles.cartText}>Cart</div>
                        </div>
                    </div>
                </Button>
            </Box>
            <TabularNavBar />
            <Box sx={{ overflowY: 'scroll' }}>
                <Box
                    sx={{
                        width: {
                            xs: '90%',
                            sm: '80%',
                            md: '70%',
                            lg: '60%',
                            xl: '50%',
                        },
                        margin: 'auto',
                    }}
                    className={styles.main}
                >
                    <Outlet />
                </Box>
            </Box>
            <Box component='footer' className={styles.footer}>
                <p>
                    This project is a demo store, you can access front-end
                    source code{' '}
                    <Link
                        href='https://github.com/Linxuan-Chen/store_demo_frontend'
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='hover'
                    >
                        here
                    </Link>
                    , or back-end source code{' '}
                    <Link
                        href='https://github.com/Linxuan-Chen/store_demo_backend'
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='hover'
                    >
                        here
                    </Link>
                    .
                </p>
                <p>
                    {'\u00A0'} To log in to the admin panel, visit {' '}
                    <Link
                        href={`${window.location.origin}/admin/`}
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='hover'
                    >
                        {window.location.origin}/admin/
                    </Link>{' '}
                    using the username and psw: demouser
                </p>
            </Box>
        </>
    );
}
