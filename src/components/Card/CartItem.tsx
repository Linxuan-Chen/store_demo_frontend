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
import Popover from '../Popover/Popover';
import { getInventoryMsgMap, INVENTORY_COLOR_MAP } from '../../utils/constant';

interface CartItemProps {
    itemInfo: CartItemTypes;
}

const CartItem: React.FC<CartItemProps> = ({ itemInfo }) => {
    const navigate = useNavigate();
    const { cart_id: cartId } = useParams();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [deleteCartItem] = useDeleteCartItemMutation();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const [quantity, setQuantity] = useState(itemInfo.quantity);
    const handleClickProduct = () => {
        console.log(itemInfo);
        navigate(
            `/product/${itemInfo.product.id}/${`${
                itemInfo.product.slug && itemInfo.product.slug !== '-'
                    ? `${itemInfo.product.slug}/`
                    : ''
            }`}`
        );
    };
    const parseInventory = () => {
        const inventory = itemInfo.product.inventory;
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
    const handleQuantityChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
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
                    cart_item_id: itemInfo.id,
                    payload: { quantity: newQuantity },
                }),
            500
        );
    }, [cartId, itemInfo.id, updateCartItem]);

    useEffect(() => {
        if (quantity !== itemInfo.quantity) {
            debouncedUpdateCart(quantity);
        }
    }, [quantity, debouncedUpdateCart, itemInfo.quantity]);

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleConfirm = () => {
        deleteCartItem({
            cart_id: cartId || '',
            cart_item_id: itemInfo.id,
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ display: 'flex' }}>
            <CardActionArea
                onClick={handleClickProduct}
                sx={{ minWidth: '100px', height: '250px' , flex: '1 1 20%' }}
            >
                <CardMedia image={itemInfo.product.images[0]?.image || productPlaceHolderImg} component='img' />
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
                        {itemInfo.product.title}
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
                        onConfirm={handleConfirm}
                        onClose={handleClose}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        title='Delete Product?'
                        body='Are you sure you want to delete the product?'
                    />
                </Box>
            </CardContent>
            <Typography variant='h6' sx={{ flex: '1 1 10%' }}>
                ${itemInfo.total_price}
            </Typography>
        </Card>
    );
};

export default CartItem;
