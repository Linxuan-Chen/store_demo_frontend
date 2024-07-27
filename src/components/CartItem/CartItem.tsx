import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
    TextField,
    Divider,
    Button,
    IconButton,
    Popover,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import productPlaceHolderImg from '../../assets/placeholder-images-image_large.webp';
import type { CartItem as CartItemTypes } from '../../types/api/cartApiTypes';
import { alpha } from '@mui/material/styles';
import {
    useUpdateCartItemMutation,
    useDeleteCartItemMutation,
} from '../../store/cartApiSlice';
import { debounce } from 'lodash';

interface CartItemProps {
    itemInfo: CartItemTypes;
}

const CartItem: React.FC<CartItemProps> = (props) => {
    const navigate = useNavigate();
    const { cart_id: cartId } = useParams();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [deleteCartItem] = useDeleteCartItemMutation();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const [quantity, setQuantity] = useState(props.itemInfo.quantity);
    const handleClickProduct = () => {
        console.log(props.itemInfo);
        // navigate()
    };
    const parseInventory = () => {
        const inventory = props.itemInfo.product.inventory;
        const INVENTORY_COLOR_MAP: Array<'error' | 'warning' | 'success'> = [
            'error',
            'warning',
            'success',
        ];
        const INVENTORY_MSG_MAP = [
            'Out of stock',
            `Only ${inventory} left in stock`,
            'In stock',
        ];

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
    console.log(props.itemInfo);
    const handleQuantityChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const rawValue = e.target.value;
        // Remove non-number values
        const numberOnlyValue = rawValue.replace(/[^\d]/g, '');
        // Remove leading 0
        const quantity = Number(numberOnlyValue.replace(/^0+(?!$)/, ''));

        if (quantity !== 0) {
            setQuantity(quantity);
        } else {
            setQuantity(1);
        }
    };
    const handleRemoveClick = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddClick = () => {
        setQuantity(quantity + 1);
    };
    const debouncedUpdateCart = useMemo(() => {
        return debounce(
            (newQuantity: number) =>
                updateCartItem({
                    cart_id: String(cartId),
                    cart_item_id: props.itemInfo.id,
                    payload: { quantity: newQuantity },
                }),
            500
        );
    }, [cartId, props.itemInfo.id, updateCartItem]);

    useEffect(() => {
        if (quantity !== props.itemInfo.quantity) {
            debouncedUpdateCart(quantity);
        }
    }, [quantity, debouncedUpdateCart, props.itemInfo.quantity]);

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleConfirm = () => {
        deleteCartItem({ cart_id: cartId || '', cart_item_id: props.itemInfo.id });
    };

    return (
        <Card sx={{ display: 'flex' }}>
            <CardActionArea
                onClick={handleClickProduct}
                sx={{ minWidth: '100px', flex: '1 1 20%' }}
            >
                <CardMedia image={productPlaceHolderImg} component='img' />
            </CardActionArea>
            <CardContent
                sx={{
                    flex: '1 1 60%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardActionArea sx={{ flexBasis: '20%' }}>
                    <Typography variant='h5'>
                        {props.itemInfo.product.title}
                    </Typography>
                </CardActionArea>
                {parseInventory()}
                <Box
                    sx={{
                        flexBasis: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography>Quantity:</Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
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
                            sx={{ width: '60%' }}
                        />
                        <IconButton onClick={handleAddClick}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Button color='warning' onClick={handleDeleteClick}>
                        Delete
                    </Button>
                    <Popover
                        anchorEl={anchorEl}
                        open={open}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Typography sx={{ p: 1 }} variant='h4'>
                            Warning
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
                            <Typography>
                                Are you sure you want to delete the product?
                            </Typography>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Button
                                    color='warning'
                                    size='small'
                                    variant='text'
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </Box>
            </CardContent>
            <Typography variant='h6' sx={{ flex: '1 1 10%' }}>
                ${props.itemInfo.total_price}
            </Typography>
        </Card>
    );
};

export default CartItem;
