import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import styles from './TabularNavBar.module.scss';
import { useGetCollectionListQuery } from '../../store/collectionApiSlice';

interface TabularNavBarProps {}

const TabularNavBar: React.FC<TabularNavBarProps> = (props) => {
    const { data: collectionData } = useGetCollectionListQuery();
    return (
        <Box className={styles.tabNav}>
            {collectionData &&
                collectionData.map((data) => (
                    <Button
                        className={styles.btn}
                        variant='outlined'
                        key={data.id}
                    >
                        {data.title}
                    </Button>
                ))}
        </Box>
    );
};

export default TabularNavBar;
