import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/productApiSlice';

export default function Homepage() {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const title = urlParams.get('title');
    const collection = urlParams.get('collection');
    const { data: productsData } = useGetProductsQuery({
        title: title || undefined,
        collection: collection || undefined,
    });
    console.log(productsData);

    return <div>Homepage</div>;
}
