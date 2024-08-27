import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/productApiSlice';
import ProductItem from '../../components/Card/ProductItem';
import { Box, Button, Pagination, Typography, Link, Grid } from '@mui/material';
import { useGetCollectionListQuery } from '../../store/collectionApiSlice';

export default function Homepage() {
    const PAGE_SIZE = 12;
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const urlParams = new URLSearchParams(location.search);
    const title = urlParams.get('title');
    const collection = urlParams.get('collection');
    const page = urlParams.get('page');
    const navigate = useNavigate();
    const { data: productsData } = useGetProductsQuery(
        {
            title: title || undefined,
            collection: collection || undefined,
            page: page || undefined,
        },
        { skip: !title && !collection }
    );
    const { data: collectionData } = useGetCollectionListQuery();
    const handleShowMore = (collection: string) => {
        if (collection) {
            navigate(`/?collection=${collection}`);
        }
    };

    const handlePageChange: (
        event: React.ChangeEvent<unknown>,
        page: number
    ) => void = (event, page) => {
        setCurrentPage(page);
        urlParams.set('page', String(page));
        const newUrl = `/?${urlParams.toString()}`;
        navigate(newUrl);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                paddingTop: 3,
                boxSizing: 'border-box',
            }}
        >
            {/* Homepage */}
            {!title &&
                !collection &&
                collectionData &&
                collectionData.map((collection) => (
                    <Box key={collection.id}>
                        {collection.featured_products.length > 0 && (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant='h4'>
                                        {collection.title}
                                    </Typography>
                                    <Button
                                        component={Link}
                                        sx={{ alignSelf: 'end' }}
                                        onClick={() =>
                                            handleShowMore(collection.title)
                                        }
                                    >
                                        Show More
                                    </Button>
                                </Box>
                                <Grid container spacing={2}>
                                    {collection.featured_products &&
                                        collection.featured_products.map(
                                            (product) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={3}
                                                    lg={3}
                                                    xl={3}
                                                    key={`product-${product.id}`}
                                                    sx={{
                                                        height: '300px',
                                                    }}
                                                >
                                                    <ProductItem
                                                        product={product}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                            </>
                        )}
                    </Box>
                ))}

            {/* Collection Page */}
            {(title || collection) &&
            productsData &&
            productsData.results.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                    }}
                >
                    <Box>
                        <Typography variant='h3'>
                            {collection || 'Results'}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                marginTop: 3,
                            }}
                        >
                            {productsData &&
                                productsData.results.length > 0 &&
                                productsData.results.map((product) => (
                                    <Box
                                        key={product.id}
                                        sx={{
                                            flexBasis: 'calc(25% - 10px)',
                                            height: '300px',
                                        }}
                                    >
                                        <ProductItem product={product} />
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                    <Box sx={{ alignSelf: 'end' }}>
                        <Pagination
                            count={Math.ceil(productsData.count / PAGE_SIZE)}
                            color='primary'
                            showFirstButton
                            showLastButton
                            onChange={handlePageChange}
                            page={currentPage}
                        />
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Typography variant='h3'>{collection}</Typography>
                    <Typography>No Product</Typography>
                </Box>
            )}
        </Box>
    );
}
