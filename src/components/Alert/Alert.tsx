import {
    Snackbar,
    Alert as MuiAlert,
    SnackbarOrigin,
    AlertColor,
} from '@mui/material';

export type ShowAlertType = {
    show: boolean;
    severity: AlertColor;
    msg: string;
};
interface AlertProps {
    anchorOrigin?: SnackbarOrigin;
    showAlert: ShowAlertType;
    onClose?: (event: React.SyntheticEvent<any> | Event) => void;
    autoHideDuration: number;
}

const Alert: React.FC<AlertProps> = ({
    showAlert,
    onClose,
    autoHideDuration,
    anchorOrigin,
}) => {
    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={showAlert.show}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
        >
            <MuiAlert severity={showAlert.severity} onClose={onClose}>
                {showAlert.msg}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
