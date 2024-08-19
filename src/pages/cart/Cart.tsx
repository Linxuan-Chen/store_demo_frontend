import React, { useState } from 'react';
import {
    useGetCartInfoQuery,
    useBulkDeleteCartItemMutation,
} from '../../store/cartApiSlice';
import { useParams } from 'react-router-dom';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    Typography,
    Toolbar,
    IconButton,
    Tooltip,
    Button,
    Divider,
    Box,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CartItem from '../../components/Card/CartItem';
import { useNavigate } from 'react-router-dom';
import Popover from '../../components/Popover/Popover';

export default function Cart() {
    const { cart_id: cartId } = useParams();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const { data: cartInfo } = useGetCartInfoQuery(cartId || '');
    const [bulkDelete] = useBulkDeleteCartItemMutation();
    const navigate = useNavigate();

    const handleTableCellCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) => {
        setSelected((prev) => {
            return prev.includes(id)
                ? prev.filter((data) => data !== id)
                : [...prev, id];
        });
    };

    const renderCartItems = () => {
        if (cartInfo) {
            return cartInfo.items.map((info) => (
                <TableRow key={info.id}>
                    <TableCell padding='checkbox'>
                        <Checkbox
                            onChange={(e) =>
                                handleTableCellCheckboxChange(e, info.id)
                            }
                            checked={selected.includes(info.id)}
                        />
                    </TableCell>
                    <TableCell>
                        <CartItem itemInfo={info} />
                    </TableCell>
                </TableRow>
            ));
        }
    };

    const handleSelectAll: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.checked && cartInfo) {
            setSelected(cartInfo.items.map((data) => data.id));
        } else {
            setSelected([]);
        }
    };

    const handleBulkDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleBulkDeleteConfirm = () => {
        bulkDelete({ cart_id: cartId || '', item_ids: selected });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper
            sx={{
                paddingTop: '30px',
                margin: 'auto',
            }}
        >
            <Typography variant='h4'>Shopping Cart</Typography>
            {cartInfo?.items.length !== 0 && (
                <>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                        }}
                    >
                        <Typography
                            color='inherit'
                            variant='subtitle1'
                            component='div'
                            sx={{ flex: '1 1 100%' }}
                        >
                            {selected.length} Selected
                        </Typography>
                        {selected.length > 0 && (
                            <IconButton
                                onClick={handleBulkDelete}
                                color='warning'
                            >
                                <DeleteIcon />
                                <Typography>Delete Selected</Typography>
                            </IconButton>
                        )}
                        <Popover
                            anchorEl={anchorEl}
                            open={open}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            onConfirm={handleBulkDeleteConfirm}
                            onClose={handleClose}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            title='Bulk Delete Products?'
                            body='Are you sure you want to bulk delete all selected products?'
                        />
                    </Toolbar>
                    <TableContainer sx={{ height: '800px', overflow: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            indeterminate={
                                                selected.length !== 0 &&
                                                selected.length !==
                                                    cartInfo?.items.length
                                            }
                                            checked={
                                                selected.length ===
                                                cartInfo?.items.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Typography variant='h6'>
                                            Price
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderCartItems()}</TableBody>
                        </Table>
                    </TableContainer>
                    <Divider></Divider>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography
                            variant='h5'
                            sx={{ paddingTop: 1, paddingBottom: 1 }}
                        >
                            Subtotal(
                            {cartInfo?.items.length || 0} items): $
                            {cartInfo?.cart_total_price || 0}
                        </Typography>
                    </Box>
                    <Divider></Divider>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            paddingTop: 1,
                            paddingBottom: 1,
                        }}
                    >
                        <Button
                            variant='contained'
                            onClick={() => navigate(`/checkout/${cartId}/`)}
                        >
                            Proceed to Checkout
                        </Button>
                    </Box>
                </>
            )}
            {cartInfo?.items.length === 0 && (
                <Typography variant='h6'>Your cart is empty</Typography>
            )}
        </Paper>
    );
}
