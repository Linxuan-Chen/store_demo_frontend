import {
    Snackbar,
    Alert as MuiAlert,
    SnackbarOrigin,
    AlertColor,
} from '@mui/material';

interface AlertProps {
    anchorOrigin?: SnackbarOrigin;
    showAlert: {
        show: boolean;
        severity: AlertColor;
        msg: string;
    };
    handleAlertClose?: (event: React.SyntheticEvent<any> | Event) => void;
    autoHideDuration: number;
}

const Alert: React.FC<AlertProps> = ({
    showAlert,
    handleAlertClose,
    autoHideDuration,
    anchorOrigin,
}) => {
    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={showAlert.show}
            onClose={handleAlertClose}
            autoHideDuration={autoHideDuration}
        >
            <MuiAlert severity={showAlert.severity} onClose={handleAlertClose}>
                {showAlert.msg}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
