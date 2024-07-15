import { useCallback, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import styles from './Layout.module.scss';
import storeLogo from '../../assets/logo.png';
import ShoppingCartIcon from '../../components/Buttons/ShoppingCartIcon/ShoppingCartIcon';
import {
    useGetCartItemCountQuery,
    useCreateNewCartMutation,
} from '../../store/cartApiSlice';

export default function Layout() {
    const navigate = useNavigate();
    const cartId = localStorage.getItem('cart_id') || '';
    const { data: countData, refetch } = useGetCartItemCountQuery(cartId, {
        skip: !cartId,
    });
    const [createNewCart, { isError, isLoading }] = useCreateNewCartMutation();

    useEffect(() => {
        const createCart = async () => {
            const storedCartId = localStorage.getItem('cart_id');
            if (!storedCartId) {
                const newCartId = (await createNewCart({}).unwrap()).id;
                localStorage.setItem('cart_id', newCartId);
            }
        };
        
        createCart();
    }, [createNewCart]);

    useEffect(() => {
        const storedCartId = localStorage.getItem('cart_id');
        if (storedCartId) {
            refetch();
        }
    }, [refetch]);
    return (
        <>
            <nav className={styles.navBarTop}>
                <Button
                    className={styles.logoContainer}
                    onClick={() => navigate('/')}
                >
                    <img
                        className={styles.storeLogo}
                        src={storeLogo}
                        alt='store logo'
                    />
                </Button>
                <div className={styles.address}>Address</div>
                <div className={styles.search}>Search</div>
                <Button
                    className={styles.clickBox}
                    onClick={() => navigate(`/cart/${cartId}/`)}
                    disabled={isError || isLoading}
                >
                    <div className={styles.cart}>
                        <ShoppingCartIcon itemCount={countData?.count || 0} />
                        <div className={styles.cartTextContainer}>
                            <div className={styles.cartText}>Cart</div>
                        </div>
                    </div>
                </Button>
            </nav>
            <Outlet />
        </>
    );
}
