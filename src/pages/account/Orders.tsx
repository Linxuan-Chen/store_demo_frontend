import React, { useState, useEffect } from 'react';
import { useGetOrderQuery } from '../../store/orderApiSlice';
import ReadOnlyCartItem from '../../components/Card/ReadOnlyCartItem';
import { Box, Card, CardContent, Typography, Pagination } from '@mui/material';
import placeHolderImg from '../../assets/placeholder.webp';
import moment from 'moment';

const Orders: React.FC = (props) => {
    const [page, setPage] = useState(1);
    const { data: orderData, refetch: refetchOrder } = useGetOrderQuery(page);
    const handleClickProduct = (id: number) => {};
    const handlePaginationChange = (
        event: React.ChangeEvent<unknown>,
        page: number
    ) => {
        setPage(page);
    };

    useEffect(() => {
        refetchOrder();
    }, [page, refetchOrder]);

    const isDevMode = process.env.NODE_ENV;
    const cloudfrontPlaceholderImg = `${process.env.REACT_APP_CLOUDFRONT_URL}/placeholder.webp`;

    return (
        <>
            <Typography variant='h3' sx={{ marginTop: 3 }}>
                Your Orders
            </Typography>
            {orderData &&
                orderData.results.length > 0 &&
                orderData.results.map((order) => (
                    <Card key={order.id} sx={{ marginTop: 3 }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Order Placed
                                    </Typography>
                                    <Typography>
                                        {moment(order.created_at).format(
                                            'MMMM DD,YYYY HH:mm:ss'
                                        )}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Customer
                                    </Typography>
                                    <Typography>{order.customer}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        To
                                    </Typography>
                                    <Typography>{order.address}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Total Price
                                    </Typography>
                                    <Typography>
                                        ${order.total_price}
                                    </Typography>
                                </Box>
                            </Box>
                            {order.items.map((item) => (
                                <ReadOnlyCartItem
                                    key={item.id}
                                    id={item.id}
                                    title={item.product_title}
                                    onClick={() => handleClickProduct(item.id)}
                                    image={item.image.image || (isDevMode ? placeHolderImg : cloudfrontPlaceholderImg)}
                                    quantity={item.quantity}
                                />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            {orderData && orderData.results.length > 0 && (
                <Pagination
                    count={Math.ceil((orderData?.count || 0) / 3)}
                    onChange={(e, page) => handlePaginationChange(e, page)}
                />
            )}
            {!orderData?.results.length && (
                <Card sx={{ marginTop: 3 }}>No order</Card>
            )}
        </>
    );
};

export default Orders;
