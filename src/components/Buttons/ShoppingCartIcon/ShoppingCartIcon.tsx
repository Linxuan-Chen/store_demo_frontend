import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import styles from './ShoppingCartIcon.module.scss';
type Props = {
    itemCount: Number;
};

/**
 * @description: This component renders the shopping cart icon with cart item count displayed in top
 * nav bar
 * @param {Props} itemCount number displayed above cart icon to indicate item count
 */
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
