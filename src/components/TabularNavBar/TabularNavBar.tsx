import { Box, Button } from '@mui/material';
import styles from './TabularNavBar.module.scss';
import { useGetCollectionListQuery } from '../../store/collectionApiSlice';
import { useNavigate } from 'react-router-dom';

interface TabularNavBarProps {}

const TabularNavBar: React.FC<TabularNavBarProps> = (props) => {
    const { data: collectionData } = useGetCollectionListQuery();
    const navigate = useNavigate();
    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        collection: string
    ) => {
        navigate(`/?collection=${collection}`);
    };
    return (
        <Box className={styles.tabNav}>
            {collectionData &&
                collectionData.map((data) => (
                    <Button
                        className={styles.btn}
                        variant='outlined'
                        key={data.id}
                        onClick={(e) => handleClick(e, data.title)}
                    >
                        {data.title}
                    </Button>
                ))}
        </Box>
    );
};

export default TabularNavBar;
