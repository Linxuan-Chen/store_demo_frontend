import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import styles from './Layout.module.scss';
import storeLogo from '../../assets/logo.png';
import ShoppingCartIcon from '../../components/Buttons/ShoppingCartIcon/ShoppingCartIcon';
import {
    useGetCartItemCountQuery,
    useCreateNewCartMutation,
} from '../../store/cartApiSlice';
import {
    useGetUserStatusQuery,
    useRefreshTokenMutation,
    useLogoutMutation,
} from '../../store/accountApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Box, Link } from '@mui/material';
import TabularNavBar from '../../components/TabularNavBar/TabularNavBar';

export default function Layout() {
    const navigate = useNavigate();
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

    useEffect(() => {
        const storedCartId = localStorage.getItem('cart_id');
        if (storedCartId) {
            refetchCount();
        }
    }, [refetchCount]);

    useEffect(() => {
        if (isLoggedIn) {
            const newCartId = userStatus ? String(userStatus.cart_id) : null;
            setCartId(newCartId);
        } else {
            const newCartId = localStorage.getItem('cart_id');
            setCartId(newCartId);
        }
    }, [isLoggedIn, userStatus]);

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
     * @description: Get welcome message
     * @return {string} welcome message displayed in account menu
     */
    // Menu trigger methods
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSignOut = async () => {
        handleClose();
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
        handleClose();
        navigate('/login/');
    };

    useEffect(() => {
        if (isCreateCartSuccess && createCartData) {
            const newCartId = createCartData.id;
            localStorage.setItem('cart_id', newCartId);
            setCartId(newCartId);
        }
    }, [isCreateCartSuccess, createCartData]);

    return (
        <>
            <Box component='nav' className={styles.navBarTop}>
                <Button
                    className={styles.logoContainer}
                    onClick={() => navigate('/')}
                >
                    <img
                        className={styles.storeLogo}
                        src={storeLogo}
                        alt='store logo'
                    />
                </Button>
                <div className={styles.address}>Address</div>
                <div className={styles.search}>Search</div>
                <div className={styles.account}>
                    <Button
                        id='basic-button'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        className={styles.accountButton}
                    >
                        {welcomeMsg}
                    </Button>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleSignIn}>Sign in</MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </Menu>
                </div>
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
            <Box className={styles.main}>
                <Outlet />
            </Box>
            <Box component='footer' className={styles.footer}>
                <p>
                    This project is a demo store, you can view front-end source
                    code{' '}
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
                </p>
            </Box>
        </>
    );
}
