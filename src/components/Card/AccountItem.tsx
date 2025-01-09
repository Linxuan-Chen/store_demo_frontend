import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';

export interface AccountItemProps {
    title: string;
    img: string;
    tagetPageUrl: string;
    description: string;
}

const AccountItem: React.FC<AccountItemProps> = ({
    title,
    img,
    tagetPageUrl,
    description,
}) => {
    const navigate = useNavigate();
    const handleClickCard = () => {
        navigate(tagetPageUrl);
    };
    return (
        <Card sx={{ height: '100%', marginTop: 3 }}>
            <CardActionArea
                sx={{ height: '100%', display: 'flex' }}
                onClick={handleClickCard}
            >
                <CardMedia component='img' src={img} sx={{ width: '30%' }} />
                <CardContent sx={{ flex: 1, height: '100%' }}>
                    <CardHeader title={title} />
                    <Typography>{description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default AccountItem;
