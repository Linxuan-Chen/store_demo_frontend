import { useState, useEffect } from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from '@mui/material';
import type { Product } from '../../types/api/productApiTypes';
import placeholderImage from '../../assets/placeholder.webp';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
    useAddCartItemMutation,
    useDeleteCartItemMutation,
    useGetCartInfoQuery,
} from '../../store/cartApiSlice';
import Alert, { ShowAlertType } from '../Alert/Alert';
import { useNavigate } from 'react-router-dom';
interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const cart_id = useSelector((state: RootState) => state.cart.cart_id);
    const { data: cartData } = useGetCartInfoQuery(cart_id);
    const navigate = useNavigate();
    const currentCartItem =
        cartData?.items.filter((item) => item.product.id === product.id)[0] ||
        null;
    const [showAlert, setShowAlert] = useState<ShowAlertType>({
        show: false,
        msg: '',
        severity: 'error',
    });
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [addCartItem] = useAddCartItemMutation();
    const [deleteCartItem] = useDeleteCartItemMutation();
    const handleAddToCart = (productId: number) => {
        addCartItem({
            cart_id: cart_id,
            payload: {
                product_id: productId,
                quantity: 1,
            },
        })
            .unwrap()
            .then(() => {
                setShowAlert({
                    show: true,
                    msg: '1 item is added',
                    severity: 'info',
                });
                setIsItemAdded(true);
            })
            .catch(() => {
                setShowAlert({
                    show: false,
                    msg: 'failed to add the item',
                    severity: 'error',
                });
                setIsItemAdded(true);
            });
    };
    const handleRemoveFromCart = () => {
        if (currentCartItem) {
            deleteCartItem({
                cart_id: cart_id,
                cart_item_id: currentCartItem.id,
            })
                .unwrap()
                .then(() => {
                    setShowAlert({
                        show: true,
                        msg: 'items are removed',
                        severity: 'success',
                    });
                    setIsItemAdded(false);
                })
                .catch(() => {
                    setShowAlert({
                        show: false,
                        msg: 'failed to remove the item',
                        severity: 'error',
                    });
                    setIsItemAdded(true);
                });
        }
    };
    const handleClickImg = () => {
        navigate(
            `/product/${product.id}/${
                product.slug && product.slug !== '-' ? `${product.slug}/` : ''
            }`
        );
    };
    const disableBtn = !cartData;

    const isDevMode = process.env.NODE_ENV;
    const cloudfrontPlaceholderImg = `${process.env.REACT_APP_CLOUDFRONT_URL}/placeholder.webp`;

    return (
        <>
            <Alert
                showAlert={showAlert}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <CardActionArea
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 1 60%',
                        objectFit: 'cover',
                    }}
                    onClick={handleClickImg}
                >
                    <CardMedia
                        component='img'
                        src={product.images[0]?.image || (isDevMode ? placeholderImage : cloudfrontPlaceholderImg)}
                        sx={{
                            maxHeight: '100px',
                            objectFit: 'cover',
                        }}
                    />
                </CardActionArea>
                <CardContent sx={{ width: '90%' }}>
                    <Typography>${product.unit_price}</Typography>
                    <Typography>{product.title}</Typography>
                </CardContent>
                <Button
                    size='small'
                    sx={{ alignSelf: 'end', flex: 1 }}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={disableBtn}
                >
                    Add to cart
                </Button>
                {isItemAdded && (
                    <Box sx={{ alignSelf: 'end', flex: 1 }}>
                        <span>{currentCartItem?.quantity} in cart-</span>
                        <Button
                            size='small'
                            sx={{ alignSelf: 'end', flex: 1 }}
                            onClick={handleRemoveFromCart}
                        >
                            Remove
                        </Button>
                    </Box>
                )}
            </Card>
        </>
    );
};

export default ProductItem;
