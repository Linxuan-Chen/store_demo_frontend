import { Box, Button } from '@mui/material';
import styles from './TabularNavBar.module.scss';
import { useGetCollectionListQuery } from '../../store/collectionApiSlice';

interface TabularNavBarProps {}

const TabularNavBar: React.FC<TabularNavBarProps> = (props) => {
    const { data: collectionData, isFetching} = useGetCollectionListQuery();
    console.log(isFetching);

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
