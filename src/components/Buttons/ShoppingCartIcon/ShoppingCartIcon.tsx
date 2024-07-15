import React from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import styles from './ShoppingCartIcon.module.scss';
type Props = {
    itemCount: Number;
};

export default function ShoppingCartIcon({ itemCount }: Props) {
    return (
        <>
            <ShoppingCartOutlinedIcon
                className={styles.shoppingCartIcon}
                fontSize='large'
            />
            <div className={styles.shoppingCartNumber}>
                {itemCount.toString()}
            </div>
        </>
    );
}
