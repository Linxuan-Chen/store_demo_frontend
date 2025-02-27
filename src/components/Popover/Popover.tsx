import {
    Popover as MUIPopover,
    Typography,
    Divider,
    Box,
    Button,
    PopoverOrigin,
} from '@mui/material';

interface PopoverProps {
    anchorEl: HTMLButtonElement | null;
    open: boolean;
    onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
    onClose?: React.MouseEventHandler<HTMLButtonElement>;
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    title?: string;
    body?: string;
}

const Popover: React.FC<PopoverProps> = ({
    anchorEl,
    open,
    onConfirm,
    onClose,
    transformOrigin,
    anchorOrigin,
    title,
    body,
}) => {
    return (
        <MUIPopover
            anchorEl={anchorEl}
            open={open}
            anchorOrigin={anchorOrigin}
            onClose={onClose}
            transformOrigin={transformOrigin}
        >
            <Typography sx={{ p: 1 }} variant='h6'>
                {title}
            </Typography>
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 1,
                }}
            >
                <Typography>{body}</Typography>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        color='primary'
                        size='small'
                        variant='text'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color='warning'
                        size='small'
                        variant='text'
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        </MUIPopover>
    );
};

export default Popover;
