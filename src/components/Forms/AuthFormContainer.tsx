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
                    xs: '80%',
                    sm: '60%',
                    md: '50%',
                    lg: '30%',
                    xl: '20%',
                },
            }}
            onSubmit={props.onSubmit}
        >
            {props.children}
        </Box>
    );
};

export default AuthFormContainer;
