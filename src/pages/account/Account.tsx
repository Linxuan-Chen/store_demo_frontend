import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Paper, Typography, Box, Grid } from '@mui/material';
import AccountItem from '../../components/Card/AccountItem';
import AccountOrderIcon from '../../assets/account_order_icon.png';
import AccountAddressesIcon from '../../assets/account_addresses_icon.png';
import AccountProfileIcon from '../../assets/account_profile_icon.png';
import type { AccountItemProps } from '../../components/Card/AccountItem';

const Profile: React.FC = () => {
    const MENU_ITEM_META: AccountItemProps[] = [
        {
            title: 'Your Orders',
            img: AccountOrderIcon,
            tagetPageUrl: 'orders/',
            description: 'Review your orders'
        },
        {
            title: 'Your Profile',
            img: AccountProfileIcon,
            tagetPageUrl: 'profile/',
            description: 'Manage password, email, birth date or mobile phone'
        },
        {
            title: 'Your Addresses',
            img: AccountAddressesIcon,
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
