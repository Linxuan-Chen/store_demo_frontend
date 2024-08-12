import { useState, useEffect } from 'react';
import {
    Paper,
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Divider,
    FormLabel,
    Button,
} from '@mui/material';
import Alert from '../../components/Alert/Alert';
import { useGetCartInfoQuery } from '../../store/cartApiSlice';
import { useParams } from 'react-router-dom';
import { usePlaceOrderMutation } from '../../store/orderApiSlice';
import productPlaceHolderImg from '../../assets/placeholder-images-image_large.webp';
import { useNavigate } from 'react-router-dom';

interface OrderDetailsProps {
    selectedAddress: string;
}

interface ShowAlertTypes {
    show: boolean;
    msg: string;
    severity: 'success' | 'error';
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ selectedAddress }) => {
    const PLACE_ORDER_FAILURE_MSG = 'Failed to place order';
    const { cart_id: cartId } = useParams();
    const { data: cartInfo } = useGetCartInfoQuery(cartId || '');
    const [placeOrder] = usePlaceOrderMutation();
    const [showAlert, setShowAlert] = useState<ShowAlertTypes>({
        show: false,
        msg: PLACE_ORDER_FAILURE_MSG,
        severity: 'error',
    });
    const navigate = useNavigate();

    const handleClickProduct = () => {
        // navigate()
    };

    const handlePlaceOrder = () => {
        placeOrder({
            cart_id: cartId || '',
            address_id: Number(selectedAddress),
        })
            .unwrap()
            .then((res) => navigate('/'))
            .catch((err) => showErrorAlert());
    };

    const handleAlertClose = () => {
        setShowAlert((prev) => ({ ...prev, show: false }));
    };

    const showErrorAlert = () => {
        setShowAlert((prev) => ({ ...prev, show: true }));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {cartInfo && cartInfo.items.length > 0 && (
                <>
                    <Alert
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        autoHideDuration={3000}
                        handleAlertClose={handleAlertClose}
                        showAlert={showAlert}
                    />
                    <Paper sx={{ marginBottom: 2 }}>
                        <FormLabel
                            id='address-radio-buttons-group-label'
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.25rem',
                                padding: 1,
                            }}
                        >
                            Order Details
                        </FormLabel>
                        <Box sx={{ overflowY: 'scroll' }}>
                            {cartInfo &&
                                cartInfo.items.map((item) => (
                                    <Card
                                        key={item.id}
                                        sx={{ display: 'flex' }}
                                    >
                                        <CardActionArea
                                            onClick={handleClickProduct}
                                            sx={{
                                                maxWidth: '100px',
                                                flex: '1 1',
                                            }}
                                        >
                                            <CardMedia
                                                image={productPlaceHolderImg}
                                                component='img'
                                            />
                                        </CardActionArea>
                                        <CardContent
                                            sx={{
                                                flex: '1 1 60%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardActionArea
                                                sx={{ flexBasis: '20%' }}
                                            >
                                                <Typography variant='h5'>
                                                    {item.product.title}
                                                </Typography>
                                            </CardActionArea>
                                            <Box
                                                sx={{
                                                    flexBasis: '20%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Typography>
                                                    Quantity:
                                                </Typography>
                                                <Divider
                                                    orientation='vertical'
                                                    variant='middle'
                                                    flexItem
                                                />
                                                <Divider
                                                    orientation='vertical'
                                                    variant='middle'
                                                    flexItem
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                        </Box>
                    </Paper>
                    <Button
                        onClick={handlePlaceOrder}
                        sx={{ alignSelf: 'flex-end' }}
                        variant='contained'
                        size='large'
                    >
                        Place Order
                    </Button>
                </>
            )}
            {!(cartInfo && cartInfo.items.length > 0) && (
                <Box>Your cart is empty</Box>
            )}
        </Box>
    );
};

export default OrderDetails;
