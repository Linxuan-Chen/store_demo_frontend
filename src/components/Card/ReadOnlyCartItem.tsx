import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Typography,
} from '@mui/material';
interface ReadOnlyCartItemProps {
    id: number;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    image: string;
    title: string;
    quantity: number;
}

const ReadOnlyCartItem: React.FC<ReadOnlyCartItemProps> = ({
    id,
    onClick,
    image,
    title,
    quantity,
}) => {
    return (
        <Card key={id} sx={{ display: 'flex' }}>
            <CardActionArea
                onClick={onClick}
                sx={{
                    maxWidth: '100px',
                    flex: '1 1',
                }}
            >
                <CardMedia image={image} component='img' />
            </CardActionArea>
            <CardContent
                sx={{
                    flex: '1 1 60%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardActionArea sx={{ flexBasis: '20%' }}>
                    <Typography variant='h5'>{title}</Typography>
                </CardActionArea>
                <Box
                    sx={{
                        flexBasis: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography>Quantity: {quantity}</Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Divider orientation='vertical' variant='middle' flexItem />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReadOnlyCartItem;
