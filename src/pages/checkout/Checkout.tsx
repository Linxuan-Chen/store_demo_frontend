import { useState } from 'react';
import { Box } from '@mui/material';

import Address from './Address';
import OrderDetails from './OrderDetails';

const Checkout: React.FC = () => {
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
                gap: '30px',
            }}
        >
            <Address
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
            />
            <OrderDetails selectedAddress={selectedAddress} />
        </Box>
    );
};

export default Checkout;
