import React, { useState } from 'react';
import {
    useLoginMutation,
    useMergeCartMutation,
} from '../../store/accountApiSlice';
import { useNavigate } from 'react-router';
import {
    Box,
    TextField,
    FormControl,
    FormLabel,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    Snackbar,
    IconButton,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Login.module.scss';
import type { UserLoginPayload } from '../../types/api/accountApiTypes';
import { useLazyGetUserStatusQuery } from '../../store/accountApiSlice';
import AuthFormContainer from '../../components/Forms/AuthFormContainer';

const Login: React.FC = (props) => {
    const USER_LOGIN_INIT_DATA: UserLoginPayload = {
        username: '',
        password: '',
        keep_me_signed_in: false,
    };

    const [login] = useLoginMutation();
    const [fetchUserStatus] = useLazyGetUserStatusQuery();
    const [mergeCart] = useMergeCartMutation();
    const navigate = useNavigate();
    const [formData, setFormData] =
        useState<UserLoginPayload>(USER_LOGIN_INIT_DATA);
    const [showNotification, setShowNotification] = useState({
        open: false,
        message: '',
    });

    const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(formData)
            .unwrap()
            .then(() => {
                mergeCart({
                    anonymous_cart_id: localStorage.getItem('cart_id'),
                })
                    .unwrap()
                    .then((data) => {
                        localStorage.setItem('cart_id', data.anonymous_cart_id);
                        fetchUserStatus()
                            .unwrap()
                            .then(() => navigate('/'));
                    });
            })
            .catch((err) => {
                setShowNotification((previousData) => ({
                    ...previousData,
                    message: err.data.detail || 'Failed to log in',
                    open: true,
                }));
            });
    };

    const handleFormDataChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        const { id, value, type, checked } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleResetPassword = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        navigate('/reset-password');
    };

    const handleSnackClose = () => {
        setShowNotification({
            open: false,
            message: '',
        });
    };

    const handleCreateAccount = () => {
        navigate('/sign-up/');
    };
    const action = (
        <IconButton color='inherit' onClick={handleSnackClose}>
            <CloseIcon />
        </IconButton>
    );

    return (
        <>
            <Box className={styles.formContainer}>
                <AuthFormContainer onSubmit={handleSignIn}>
                    <h2>Sign In</h2>
                    <FormControl variant='filled' fullWidth>
                        <FormLabel htmlFor='username'>Username:</FormLabel>
                        <TextField
                            id='username'
                            type='text'
                            onChange={handleFormDataChange}
                        />
                    </FormControl>
                    <FormControl variant='filled' fullWidth sx={{ mt: 1 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <FormLabel htmlFor='password'>Password:</FormLabel>
                            <Link
                                onClick={(e) => handleResetPassword(e)}
                                href=''
                                underline='hover'
                            >
                                Forgot Password
                            </Link>
                        </Box>
                        <TextField
                            id='password'
                            type='password'
                            onChange={handleFormDataChange}
                        />
                    </FormControl>
                    <FormControl variant='filled' fullWidth sx={{ mt: 1 }}>
                        <FormControlLabel
                            sx={{ justifyContent: 'center' }}
                            label='Keep me signed in'
                            control={
                                <Checkbox
                                    id='keep_me_signed_in'
                                    onChange={handleFormDataChange}
                                />
                            }
                        />
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <Button type='submit' variant='contained'>
                            Sign In
                        </Button>
                    </Box>
                </AuthFormContainer>
                <Divider
                    aria-hidden='true'
                    sx={{
                        mt: 4,
                        mb: 2,
                        width: {
                            xs: '100%',
                            sm: '80%',
                            md: '60%',
                            lg: '60%',
                            xl: '40%',
                        },
                    }}
                    textAlign='center'
                    orientation='horizontal'
                >
                    New Customer?
                </Divider>
                <Button onClick={handleCreateAccount}>
                    Create your account
                </Button>
                <Snackbar
                    action={action}
                    open={showNotification.open}
                    message={showNotification.message}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                />
            </Box>
        </>
    );
};

export default Login;
