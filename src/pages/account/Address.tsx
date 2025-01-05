import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    useGetAddressesQuery,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
} from '../../store/addressApiSlice';
import {
    useCurrentCustomerQuery,
    useUpdateCurrentCustomerMutation,
} from '../../store/customerApiSlice';
import { useForm, FieldValues } from 'react-hook-form';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    Button,
    CardActionArea,
} from '@mui/material';
import Popover from '../../components/Popover/Popover';
import Alert, { ShowAlertType } from '../../components/Alert/Alert';
import GenericFormModal from '../../components/Generic/GenericFormModal';
import {
    AddressesResponse,
    UpdateAddressPayload,
} from '../../types/api/addressApiTypes';
import AddIcon from '@mui/icons-material/Add';

const Address: React.FC = (props) => {
    const schema = yup.object<FieldValues>({
        street: yup.string().required('Street is required'),
        city: yup.string().required('City is required'),
        zip: yup.string().required('Zip is required'),
    });

    const FORM_INIT_VALUES = {
        street: '',
        city: '',
        zip: '',
        is_default: false,
    };
    const { data: currentCustomer } = useCurrentCustomerQuery();
    const { data: currentAddress } = useGetAddressesQuery();
    const [updateAddress] = useUpdateAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();
    const [updateCurrentCustomer] = useUpdateCurrentCustomerMutation();
    const [asDefaultAnchorEl, setAsDefaultAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const form = useForm<FieldValues>({
        defaultValues: FORM_INIT_VALUES,
        resolver: yupResolver(schema),
    });
    const asDefaultOpen = Boolean(asDefaultAnchorEl);
    const deleteOpen = Boolean(deleteAnchorEl);
    const [showAlert, setShowAlert] = useState<ShowAlertType>({
        show: false,
        msg: '',
        severity: 'success',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        null
    );
    const getFormFields = () => {
        return [
            {
                label: 'Street',
                field: 'street',
            },
            {
                label: 'City',
                field: 'city',
            },
            {
                label: 'Zip',
                field: 'zip',
            },
            {
                label: 'Set as Default',
                field: 'is_default',
                type: 'checkbox' as 'checkbox',
            },
        ];
    };
    const handleAsDefault = (
        event: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        setAsDefaultAnchorEl(event.currentTarget);
        setSelectedAddressId(id);
    };
    const handleAsDefaultConfirm = () => {
        setAsDefaultAnchorEl(null);
        if (selectedAddressId) {
            updateAddress({
                address_id: selectedAddressId,
                payload: {
                    is_default: true,
                },
            })
                .unwrap()
                .then(() => {
                    setShowAlert({
                        show: true,
                        msg: 'Address is successfully set as default',
                        severity: 'success',
                    });
                })
                .catch(() => {
                    setShowAlert({
                        show: true,
                        msg: 'Failed to set as default',
                        severity: 'error',
                    });
                })
                .then(() => setSelectedAddressId(null));
        }
    };
    const handleAsDefaultClose = () => {
        setSelectedAddressId(null);
        setAsDefaultAnchorEl(null);
    };
    const handleClickDeleteAddress = (
        event: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedAddressId(id);
    };
    const handleConfirmDeleteAddress = () => {
        setDeleteAnchorEl(null);
        if (selectedAddressId) {
            deleteAddress(selectedAddressId)
                .unwrap()
                .then(() =>
                    setShowAlert({
                        show: true,
                        severity: 'success',
                        msg: 'The address is deleted successfully',
                    })
                )
                .catch(() =>
                    setShowAlert({
                        show: true,
                        severity: 'error',
                        msg: 'Failed to delete the address',
                    })
                );
        }
    };
    const handleAlertClose = () => {
        setShowAlert((prev) => ({ ...prev, show: false }));
    };
    const handleDeleteAddressClose = () => {
        setDeleteAnchorEl(null);
        setSelectedAddressId(null);
    };
    const handleAddAddress = (value: UpdateAddressPayload['payload']) => {
        updateCurrentCustomer({
            address: {
                ...value,
            },
        })
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                setShowAlert({
                    show: true,
                    severity: 'success',
                    msg: 'Address is successfully added',
                });
            })
            .catch(() => {
                setIsModalOpen(false);
                setShowAlert({
                    show: false,
                    severity: 'error',
                    msg: 'Failed to add the address',
                });
            });
    };
    const handleCloseModal = () => {
        setSelectedAddressId(null);
        setIsModalOpen(false);
    };
    const handleClickAddAddress = () => {
        form.reset(FORM_INIT_VALUES);
        setIsModalOpen(true);
    };
    const handleClickEdit = (address: AddressesResponse[number]) => {
        form.reset({
            street: address.street,
            city: address.city,
            zip: address.zip,
            is_default: address.is_default,
        });
        setSelectedAddressId(address.id);
        setIsModalOpen(true);
    };
    const handleUpdateAddress = (value: UpdateAddressPayload['payload']) => {
        setIsModalOpen(false);
        if (selectedAddressId) {
            updateAddress({
                address_id: selectedAddressId,
                payload: value,
            })
                .unwrap()
                .then(() => {
                    setShowAlert({
                        show: true,
                        severity: 'success',
                        msg: 'Address is successfully updated',
                    });
                })
                .catch(() =>
                    setShowAlert({
                        show: false,
                        severity: 'error',
                        msg: 'Failed to udpate address',
                    })
                )
                .then(() => setSelectedAddressId(null));
        }
    };

    return (
        <>
            <Typography variant='h3' sx={{ marginTop: 3 }}>
                Your Addresses
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: 3,
                }}
            >
                {currentAddress &&
                    currentCustomer &&
                    currentAddress.map((address) => (
                        <Card
                            key={address.id}
                            sx={{ flexBasis: 'calc(50% - 10px)' }}
                        >
                            <CardHeader
                                title={
                                    address.is_default
                                        ? 'Default Address'
                                        : 'Address'
                                }
                            />
                            <CardContent>
                                <Typography>
                                    {currentCustomer?.first_name}{' '}
                                    {currentCustomer?.last_name}
                                </Typography>
                                <Typography>{address.street}</Typography>
                                <Typography>
                                    {address.city} {address.zip}
                                </Typography>
                                <Typography>
                                    Phone number:{' '}
                                    {currentCustomer.customer_details?.phone}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                }}
                            >
                                <Button
                                    color='warning'
                                    onClick={(e) =>
                                        handleClickDeleteAddress(e, address.id)
                                    }
                                >
                                    Remove
                                </Button>
                                <Button
                                    onClick={() => handleClickEdit(address)}
                                >
                                    Edit
                                </Button>
                                {!address.is_default && (
                                    <Button
                                        onClick={(e) =>
                                            handleAsDefault(e, address.id)
                                        }
                                    >
                                        Set as Default
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    ))}
                <Card
                    sx={{ flexBasis: 'calc(50% - 10px)', minHeight: '228px' }}
                >
                    <CardActionArea
                        sx={{
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                        }}
                        onClick={handleClickAddAddress}
                    >
                        <AddIcon />
                    </CardActionArea>
                </Card>
            </Box>
            <Popover
                open={asDefaultOpen}
                anchorEl={asDefaultAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                title='Set Address as Default?'
                body='Are you sure you want to set the address as default?'
                onConfirm={() => handleAsDefaultConfirm()}
                onClose={handleAsDefaultClose}
            />
            <Popover
                open={deleteOpen}
                anchorEl={deleteAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                title='Delete Address?'
                body='Are you sure you want to delete the address?'
                onConfirm={() => handleConfirmDeleteAddress()}
                onClose={handleDeleteAddressClose}
            />
            <Alert
                showAlert={showAlert}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
            <GenericFormModal
                onClose={handleCloseModal}
                open={isModalOpen}
                formConfigs={{
                    fields: getFormFields(),
                    title: `${selectedAddressId ? 'Edit' : 'Add'} Address`,
                    form: form,
                    onSubmit: (value) => {
                        if (selectedAddressId) {
                            handleUpdateAddress(value);
                        } else {
                            handleAddAddress(value);
                        }
                    },
                    size: 'small',
                    onClose: handleCloseModal,
                }}
            />
        </>
    );
};

export default Address;
