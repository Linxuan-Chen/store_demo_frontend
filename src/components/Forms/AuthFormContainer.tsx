import { ReactNode } from 'react';
import { Box } from '@mui/material';
import styles from './AuthFormContainer.module.scss';

interface AuthFormContainerProps {
    children?: ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = (props) => {
    return (
        <Box
            component='form'
            autoComplete='off'
            className={styles.authForm}
            sx={{
                p: 1,
                width: {
                    xs: '100%',
                    sm: '80%',
                    md: '60%',
                    lg: '60%',
                    xl: '40%',
                },
            }}
            onSubmit={props.onSubmit}
        >
            {props.children}
        </Box>
    );
};

export default AuthFormContainer;
