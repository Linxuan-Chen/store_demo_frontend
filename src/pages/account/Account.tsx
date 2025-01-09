import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Paper, Typography, Box, Grid } from '@mui/material';
import AccountItem from '../../components/Card/AccountItem';
import accountOrderIcon from '../../assets/account_order_icon.webp';
import accountAddressesIcon from '../../assets/account_addresses_icon.webp';
import accountProfileIcon from '../../assets/account_profile_icon.webp';
import type { AccountItemProps } from '../../components/Card/AccountItem';

const Profile: React.FC = () => {
    const isDevMode = process.env.NODE_ENV;
    const cloudfrontaccountOrderIcon = `${process.env.REACT_APP_CLOUDFRONT_URL}/account_order_icon.webp`;
    const cloudfrontaccountAddressesIcon = `${process.env.REACT_APP_CLOUDFRONT_URL}/account_addresses_icon.webp`;
    const cloudfrontaccountProfileIcon = `${process.env.REACT_APP_CLOUDFRONT_URL}/account_profile_icon.webp`;

    const MENU_ITEM_META: AccountItemProps[] = [
        {
            title: 'Your Orders',
            img: isDevMode ? accountOrderIcon : cloudfrontaccountOrderIcon,
            tagetPageUrl: 'orders/',
            description: 'Review your orders'
        },
        {
            title: 'Your Profile',
            img: isDevMode ? accountAddressesIcon : cloudfrontaccountAddressesIcon,
            tagetPageUrl: 'profile/',
            description: 'Manage password, email, birth date or mobile phone'
        },
        {
            title: 'Your Addresses',
            img: isDevMode ? accountProfileIcon : cloudfrontaccountProfileIcon,
            tagetPageUrl: 'address/',
            description: 'Manage addresses'
        },
    ];
    return (
        <Box>
            <Typography variant='h3' sx={{ marginTop: 3 }}>Your Account</Typography>
            <Grid container spacing={2}>
                {MENU_ITEM_META.map((item, index) => (
                    <Grid
                        key={index}
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ height: '200px' }}
                    >
                        <AccountItem {...item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Profile;
