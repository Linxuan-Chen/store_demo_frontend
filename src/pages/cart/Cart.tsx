import React, { useState } from 'react';
import { useGetCartInfoQuery } from '../../store/cartApiSlice';
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
    TableFooter,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CartItem from '../../components/CartItem/CartItem';

export default function Cart() {
    const { cart_id: cartId } = useParams();
    const [selected, setSelected] = useState<readonly number[]>([]);
    const { data: cartInfo } = useGetCartInfoQuery(cartId || '');

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

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && cartInfo) {
            setSelected(cartInfo.items.map((data) => data.id));
        } else {
            setSelected([]);
        }
    };

    const handleBulkDelete = () => {
        console.log(selected);
    };

    return (
        <Paper
            sx={{
                width: {
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                },
                margin: 'auto',
                marginTop: '30px',
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
                            <Tooltip title='Delete'>
                                <IconButton
                                    onClick={handleBulkDelete}
                                    color='warning'
                                >
                                    <DeleteIcon />
                                    <Typography>Delete Selected</Typography>
                                </IconButton>
                            </Tooltip>
                        )}
                    </Toolbar>
                    <TableContainer>
                        <Table>
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
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} align='right'>
                                        <Typography variant='h5'>
                                            Subtotal(
                                            {cartInfo?.items.length || 0}{' '}
                                            items): $
                                            {cartInfo?.cart_total_price || 0}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>
            )}
            {cartInfo?.items.length === 0 && (
                <Typography variant='h6'>Your cart is empty</Typography>
            )}
        </Paper>
    );
}
