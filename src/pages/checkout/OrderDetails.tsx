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
import ReadOnlyCartItem from '../../components/Card/ReadOnlyCartItem';
import { SimpleProduct } from '../../types/api/cartApiTypes';

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

    const handleClickProduct = (product: SimpleProduct) => {
        const slug = product.slug;
        const id = product.id;
        navigate(`/product/${id}/${slug && slug !== '-' ? `${slug}/` : ''}`);
    };

    const handlePlaceOrder = () => {
        placeOrder({
            cart_id: cartId || '',
            address_id: Number(selectedAddress),
        })
            .unwrap()
            .then((res) => navigate('/my-account/orders/'))
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
                width: '100%',
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
                        onClose={handleAlertClose}
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
                                    <ReadOnlyCartItem
                                        key={item.id}
                                        id={item.id}
                                        onClick={() =>
                                            handleClickProduct(item.product)
                                        }
                                        quantity={item.quantity}
                                        title={item.product.title}
                                        image={item.product.images[0]?.image || productPlaceHolderImg}
                                    />
                                ))}
                        </Box>
                    </Paper>
                    <Button
                        onClick={handlePlaceOrder}
                        sx={{ alignSelf: 'flex-end' }}
                        variant='contained'
                        size='large'
                        disabled={selectedAddress === ''}
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
