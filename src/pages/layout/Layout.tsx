import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import storeLogo from '../../assets/logo.png';
import ShoppingCartIcon from '../../components/Buttons/ShoppingCartIcon/ShoppingCartIcon';

type Props = {};

export default function Layout() {
    const handleOnClick = () => {
        
    }
    return (
        <div>
        <header className={styles.navBarTop}>
            <img className={styles.storeLogo} src={storeLogo} alt='store logo' />
            <div className={styles.address}>Address</div>
            <div className={styles.search}>Search</div>
            <div className={styles.clickBox} onClick={handleOnClick}>
            <div className={styles.cart}>
                <ShoppingCartIcon itemCount={2}/>
                <div className={styles.cartTextContainer}>
                <div className={styles.cartText}>Cart</div>
                </div>
            </div>
            </div>
        </header>
        <Outlet />
        </div>
    );
}
