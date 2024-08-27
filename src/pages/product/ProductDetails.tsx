import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import PlaceHolderImg from '../../assets/placeholder-images-image_large.webp';
import { useGetAProductQuery } from '../../store/productApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryMsgMap, INVENTORY_COLOR_MAP } from '../../utils/constant';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useAddCartItemMutation } from '../../store/cartApiSlice';
import Alert, { ShowAlertType } from '../../components/Alert/Alert';

interface ProductDetailsProps {}

const ProductDetails: React.FC<ProductDetailsProps> = (props) => {
    const { product_id: productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState<ShowAlertType>({
        show: false,
        msg: '',
        severity: 'error',
    });
    const navigate = useNavigate();
    const cart_id = useSelector((state: RootState) => state.cart.cart_id);
    const [addCartItem] = useAddCartItemMutation();
    const { data: productData } = useGetAProductQuery(productId as string, {
        skip: !productId,
    });
    const parseInventory = (inventory: number) => {
        const INVENTORY_MSG_MAP = getInventoryMsgMap(inventory);

        let level = INVENTORY_COLOR_MAP[0];
        let msg = INVENTORY_MSG_MAP[0];

        if (inventory === 0) {
            level = INVENTORY_COLOR_MAP[0];
            msg = INVENTORY_MSG_MAP[0];
        } else if (inventory < 10 && inventory > 0) {
            level = INVENTORY_COLOR_MAP[1];
            msg = INVENTORY_MSG_MAP[1];
        } else {
            level = INVENTORY_COLOR_MAP[2];
            msg = INVENTORY_MSG_MAP[2];
        }
        return (
            <Typography
                sx={{
                    color: (theme) => {
                        return alpha(theme.palette[level].main, 1);
                    },
                    flex: '1 1',
                }}
            >
                {msg}
            </Typography>
        );
    };
    const handleAddToCart = () => {
        if (productId) {
            addCartItem({
                cart_id: cart_id,
                payload: {
                    product_id: Number(productId),
                    quantity: quantity,
                },
            })
                .then(() => {
                    setShowAlert({
                        show: true,
                        msg: 'Add to card successfully',
                        severity: 'success',
                    });
                    navigate(`/cart/${cart_id}/`);
                })
                .catch(() =>
                    setShowAlert({
                        show: true,
                        msg: 'Failed to add the product',
                        severity: 'error',
                    })
                );
        }
    };
    const handleRemoveClick = () => {
        setQuantity((prev) => (prev > 1 ? (prev -= 1) : 1));
    };

    const handleAddClick = () => {
        setQuantity((prev) => {
            if (productData) {
                return prev < productData?.inventory ? (prev += 1) : prev;
            }
            return prev;
        });
    };
    const handleQuantityChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        const value = Number(e.target.value);
        if (productData) {
            if (value > productData?.inventory) {
                setQuantity(productData?.inventory);
            } else if (value === 0) {
                setQuantity(1);
            } else {
                setQuantity(value);
            }
        }
    };
    return (
        <>
            <Alert
                showAlert={showAlert}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
            {productData && (
                <Card sx={{ display: 'flex', marginTop: 3 }}>
                    <CardMedia
                        component='img'
                        src={productData.images[0]?.image || PlaceHolderImg}
                        sx={{ flexBasis: '30%', height: '300px', maxWidth: '400px', objectFit: 'cover' }}
                    />
                    <CardContent
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <CardHeader title={productData.title} />
                        {parseInventory(productData.inventory)}
                        <Typography variant='h5'>
                            ${productData.unit_price}
                        </Typography>
                        <Typography>{productData.description}</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginTop: 2,
                            }}
                        >
                            <Typography>Quantity:</Typography>
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                flexItem
                            />
                            <Box>
                                <IconButton
                                    onClick={handleRemoveClick}
                                    disabled={quantity === 1}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <TextField
                                    size='small'
                                    value={quantity.toString()}
                                    onChange={handleQuantityChange}
                                />
                                <IconButton onClick={handleAddClick}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                flexItem
                            />
                            <Button color='warning' onClick={handleAddToCart}>
                                Add to cart
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default ProductDetails;
