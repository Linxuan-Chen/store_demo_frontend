import { useState, useEffect, useMemo } from 'react';
import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import AuthFormContainer from '../../components/Forms/AuthFormContainer';
import styles from './SignUp.module.scss';
import { useNavigate } from 'react-router-dom';
import type {
    UserSignUpPayload,
    CheckUsernameAvailabilityResponse,
} from '../../types/api/accountApiTypes';
import { useForm, Controller } from 'react-hook-form';
import {
    useLazyCheckUsernameAvailablilityQuery,
    useUserSignUpMutation,
} from '../../store/accountApiSlice';
import { debounce } from 'lodash';

const SignUp: React.FC = (props) => {
    const FORM_INIT_DATA: UserSignUpPayload = {
        username: '',
        password: '',
        repeat_password: '',
        first_name: '',
        last_name: '',
        email: '',
    };

    const [check] = useLazyCheckUsernameAvailablilityQuery();
    const navigate = useNavigate();
    const [userSignUp] = useUserSignUpMutation();
    const [isUsernameAvailable, setIsUsernameAvailable] =
        useState<CheckUsernameAvailabilityResponse>({
            is_available: true,
            message: '',
        });

    const submitLogics = (data: UserSignUpPayload) => {
        userSignUp(data)
            .unwrap()
            .then(() => {
                navigate('/login/');
            });
    };
    const { handleSubmit, watch, getValues, setError, clearErrors, control } =
        useForm<UserSignUpPayload>({ defaultValues: FORM_INIT_DATA });

    const username = watch('username');

    const debouncedCheckUsername = useMemo(() => {
        return debounce((username: string) => {
            check(username)
                .unwrap()
                .then((data) => setIsUsernameAvailable(data));
        }, 500);
    }, [check]);

    useEffect(() => {
        if (!isUsernameAvailable.is_available) {
            setError('username', {
                type: 'unavailable',
                message: isUsernameAvailable.message,
            });
        } else {
            clearErrors('username');
        }
    }, [isUsernameAvailable, setError, clearErrors]);

    useEffect(() => {
        if (username) {
            debouncedCheckUsername(username);
        } else {
            clearErrors('username');
        }
    }, [username, check, debouncedCheckUsername, clearErrors]);

    return (
        <Box className={styles.formContainer}>
            <AuthFormContainer
                onSubmit={handleSubmit((data) => submitLogics(data))}
            >
                <h2>Sign Up</h2>
                <Controller
                    name='username'
                    control={control}
                    defaultValue=''
                    rules={{
                        required: 'Username is required',
                    }}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel>Username: </FormLabel>
                            <TextField
                                {...field}
                                id='username'
                                type='text'
                                size='small'
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error
                                        ? fieldState.error.message
                                        : ''
                                }
                            />
                        </FormControl>
                    )}
                />
                <Controller
                    name='password'
                    control={control}
                    rules={{
                        required: 'Password is required',
                    }}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel>Password: </FormLabel>
                            <TextField
                                {...field}
                                id='password'
                                type='password'
                                size='small'
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error
                                        ? fieldState.error.message
                                        : ''
                                }
                            />
                        </FormControl>
                    )}
                />
                <Controller
                    name='repeat_password'
                    control={control}
                    rules={{
                        required: 'Repeat password is required',
                        validate: (value) => {
                            const { password } = getValues();
                            if (value) {
                                return (
                                    password === value ||
                                    'Password do not match'
                                );
                            }
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel>Password again: </FormLabel>
                            <TextField
                                {...field}
                                id='repeat-password'
                                type='password'
                                size='small'
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error
                                        ? fieldState.error.message
                                        : ''
                                }
                            />
                        </FormControl>
                    )}
                />
                <Controller
                    name='first_name'
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel>First name: </FormLabel>
                            <TextField
                                {...field}
                                id='first-name'
                                type='text'
                                size='small'
                            />
                        </FormControl>
                    )}
                />
                <Controller
                    name='last_name'
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel>Last name: </FormLabel>
                            <TextField
                                {...field}
                                id='last-name'
                                type='text'
                                size='small'
                            />
                        </FormControl>
                    )}
                />
                <Controller
                    control={control}
                    name='email'
                    rules={{
                        required: 'Email is required',
                    }}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth variant='filled'>
                            <FormLabel required aria-required>
                                Email:{' '}
                            </FormLabel>
                            <TextField
                                {...field}
                                id='email'
                                type='email'
                                size='small'
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error
                                        ? fieldState.error.message
                                        : ''
                                }
                            />
                        </FormControl>
                    )}
                />
                <Button type='submit' sx={{ mt: 3 }} variant='contained'>
                    Create Account
                </Button>
            </AuthFormContainer>
        </Box>
    );
};

export default SignUp;
