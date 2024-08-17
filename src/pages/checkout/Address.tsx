import { useState, useEffect } from 'react';
import {
    Paper,
    FormControl,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormLabel,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
} from '@mui/material';
import Alert from '../../components/Alert/Alert';
import {
    useUpdateCustomerMutation,
    useCurrentCustomerQuery,
} from '../../store/customerApiSlice';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateAddressMutation } from '../../store/addressApiSlice';
import lodash from 'lodash';

interface ShowAlertTypes {
    show: boolean;
    msg: string;
    severity: 'success' | 'error';
}

interface AddressFormData {
    street: string;
    city: string;
    zip: string;
}

interface AddressProps {
    selectedAddress: string;
    setSelectedAddress: React.Dispatch<React.SetStateAction<string>>;
}

type FormModeOpts = 'edit' | 'add';

const Address: React.FC<AddressProps> = ({
    selectedAddress,
    setSelectedAddress,
}) => {
    const ADDRESS_UPDATE_SUCCESS_MSG = 'Address updated successfully';
    const ADDRESS_UPDATE_FAILURE_MSG = 'Failed to update address';
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<ShowAlertTypes>({
        show: false,
        msg: ADDRESS_UPDATE_SUCCESS_MSG,
        severity: 'success',
    });
    const [formMode, setFormMode] = useState<FormModeOpts>('edit');

    const ADDRESS_FORM_INIT_DATA = {
        street: '',
        city: '',
        zip: '',
    };

    const { control, handleSubmit, reset } = useForm<AddressFormData>({
        defaultValues: ADDRESS_FORM_INIT_DATA,
    });

    const [updateCustomer] = useUpdateCustomerMutation();
    const [updateAddress] = useUpdateAddressMutation();

    const { data: currentCustomerInfo, refetch: refetchCustomerInfo } =
        useCurrentCustomerQuery();

    useEffect(() => {
        refetchCustomerInfo();
    }, [refetchCustomerInfo]);

    useEffect(() => {
        if (
            currentCustomerInfo &&
            !lodash.isEmpty(currentCustomerInfo.addresses)
        ) {
            setSelectedAddress(currentCustomerInfo.addresses[0].id.toString());
        }
    }, [setSelectedAddress, currentCustomerInfo]);

    const handleRadioGroupChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        value: string
    ) => {
        setSelectedAddress(value);
    };
    const populateAddressRadioGroup = () => {
        if (currentCustomerInfo && currentCustomerInfo.addresses) {
            const addresses = currentCustomerInfo.addresses;
            return (
                <FormControl sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-labelledby='address-radio-buttons-group-label'
                        defaultValue={1}
                        name='delivery-address-radio-buttons-group'
                        row
                        onChange={handleRadioGroupChange}
                        value={selectedAddress}
                        sx={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        {addresses.map((address) => (
                            <Box
                                sx={{
                                    flexBasis: '50%',
                                    boxSizing: 'border-box',
                                }}
                                key={address.id}
                            >
                                <FormControlLabel
                                    value={String(address.id)}
                                    control={<Radio />}
                                    label={
                                        <>
                                            <Typography
                                                variant='body1'
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {
                                                    currentCustomerInfo?.first_name
                                                }{' '}
                                                {
                                                    currentCustomerInfo?.last_name
                                                }
                                            </Typography>
                                            <Typography>
                                                {address.street},{' '}
                                                {address.city},{' '}
                                                {address.zip}
                                            </Typography>
                                            <Button
                                                variant='text'
                                                size='small'
                                                onClick={() => {
                                                    setSelectedAddress(
                                                        String(address.id)
                                                    );
                                                    handleAddressModalOpen(
                                                        'edit',
                                                        address.id
                                                    );
                                                }}
                                            >
                                                Edit Address
                                            </Button>
                                        </>
                                    }
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>
            );
        }
    };
    /**
     * @description: open address form modal
     * @param {FormModeOpts} mode
     * @param {string} selectedAddressId it is optional, and it provides updated selectedAddress to ensure the
     * form can get the updated address id
     */
    const handleAddressModalOpen = (
        mode: FormModeOpts,
        selectedAddressId?: number
    ) => {
        setFormMode(mode);
        const initValues: AddressFormData = {
            street:
                mode === 'edit'
                    ? currentCustomerInfo?.addresses?.filter(
                          (address) => address.id === selectedAddressId
                      )[0]?.street || ''
                    : '',
            city:
                mode === 'edit'
                    ? currentCustomerInfo?.addresses?.filter(
                          (address) => address.id === selectedAddressId
                      )[0]?.city || ''
                    : '',
            zip:
                mode === 'edit'
                    ? currentCustomerInfo?.addresses?.filter(
                          (address) => address.id === selectedAddressId
                      )[0]?.zip || ''
                    : '',
        };
        reset(initValues);
        setOpenEditModal(true);
    };
    const showEmptyAddressPlaceholder = () => {
        return <Box>No Addresses</Box>;
    };

    const handleAddressModalClose = () => {
        setOpenEditModal(false);
        setFormMode('edit');
        reset(ADDRESS_FORM_INIT_DATA);
    };
    const handleFormSubmit = async (data: AddressFormData) => {
        if (currentCustomerInfo) {
            if (formMode === 'add') {
                const customerId = currentCustomerInfo.id;
                const response = await updateCustomer({
                    customer_id: customerId,
                    payload: {
                        address: data,
                    },
                });
                if (response) {
                }
            } else {
                const addressId = Number(selectedAddress);
                const response = await updateAddress({
                    address_id: addressId,
                    payload: data,
                });
                if (response) {
                    showSuccessAlert();
                } else {
                    showErrorAlert();
                }
            }
        }
        handleAddressModalClose();
    };
    const showSuccessAlert = () => {
        setShowAlert({
            show: true,
            msg: ADDRESS_UPDATE_SUCCESS_MSG,
            severity: 'success',
        });
    };
    const showErrorAlert = () => {
        setShowAlert({
            show: true,
            msg: ADDRESS_UPDATE_FAILURE_MSG,
            severity: 'error',
        });
    };

    const handleAlertClose = () => {
        setShowAlert((prev) => ({ ...prev, show: false }));
    };
    return (
        <Paper sx={{ width: '100%' }}>
            <Alert
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                showAlert={showAlert}
            />
            <FormLabel
                id='address-radio-buttons-group-label'
                sx={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                }}
            >
                Delivery addresses
            </FormLabel>
            <Box sx={{ marginTop: 2 }}>
                {!lodash.isEmpty(currentCustomerInfo?.addresses)
                    ? populateAddressRadioGroup()
                    : showEmptyAddressPlaceholder()}
            </Box>
            <Button onClick={() => handleAddressModalOpen('add')}>
                Add Address
            </Button>
            <Dialog
                open={openEditModal}
                onClose={handleAddressModalClose}
                aria-labelledby='edit or add address'
                aria-describedby='display edit or add address form depending on what button you clicked'
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit(handleFormSubmit),
                }}
            >
                <DialogTitle>
                    {formMode === 'edit' ? 'Edit' : 'Add'} Address
                </DialogTitle>
                <DialogContent>
                    <Controller
                        name='street'
                        control={control}
                        rules={{
                            required: 'This field is required',
                        }}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth>
                                <FormLabel>Street: </FormLabel>
                                <TextField
                                    {...field}
                                    id='street'
                                    type='text'
                                    size='small'
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            </FormControl>
                        )}
                    />
                    <Controller
                        name='city'
                        control={control}
                        rules={{
                            required: 'This field is required',
                        }}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth>
                                <FormLabel>City: </FormLabel>
                                <TextField
                                    {...field}
                                    id='city'
                                    type='text'
                                    size='small'
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            </FormControl>
                        )}
                    />
                    <Controller
                        name='zip'
                        control={control}
                        rules={{
                            required: 'This field is required',
                        }}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth>
                                <FormLabel>Zip Code: </FormLabel>
                                <TextField
                                    {...field}
                                    id='zip'
                                    type='text'
                                    size='small'
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            </FormControl>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddressModalClose}>Cancel</Button>
                    <Button type='submit'>Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Address;
