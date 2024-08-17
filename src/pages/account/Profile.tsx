import { useState, useEffect } from 'react';
import {
    useCurrentCustomerQuery,
    useUpdateCurrentCustomerMutation,
} from '../../store/customerApiSlice';
import { useGetUserStatusQuery } from '../../store/accountApiSlice';
import { useForm } from 'react-hook-form';
import GenericForm from '../../components/Generic/GenericForm';
import type { GenericFormFieldsType } from '../../components/Generic/GenericForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { UpdateCurrentCustomerPayload } from '../../types/api/customerApiTypes';
import lodash from 'lodash';
import Alert from '../../components/Alert/Alert';
import type { ShowAlertType } from '../../components/Alert/Alert';
import {
    PROFILE_CHANGE_SUCCESS_MSG,
    PROFILE_CHANGE_FAILURE_MSG,
    PROFILE_CHANGE_NOTHING_MSG,
} from './constants';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

dayjs.extend(utc);

interface FieldValues {
    [index: string]: string | 'G' | 'S' | 'B' | undefined;
    first_name?: string;
    last_name?: string;
    membership?: 'G' | 'S' | 'B';
    email?: string;
    phone?: string;
    birth_date?: string;
}

const Profile: React.FC = (props) => {
    const { data: currentCustomer, isSuccess } = useCurrentCustomerQuery();
    const navigate = useNavigate();
    const { isSuccess: isUserStatusSuccess } = useGetUserStatusQuery();
    const [updateCurrentCustomer, { isLoading: isUpdating }] =
        useUpdateCurrentCustomerMutation();
    const schema = yup.object<FieldValues>({
        email: yup.string().email('Invalid email address'),
    });
    const [showAlert, setShowAlert] = useState<ShowAlertType>({
        show: false,
        severity: 'success',
        msg: PROFILE_CHANGE_SUCCESS_MSG,
    });

    const form = useForm<FieldValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            membership: 'B',
            email: '',
            phone: '',
            birth_date: '',
        },
    });

    const formFields: GenericFormFieldsType = [
        {
            label: 'First Name',
            field: 'first_name',
        },
        {
            label: 'Last Name',
            field: 'last_name',
        },
        {
            label: 'Birth Date',
            field: 'birth_date',
            disableFuture: true,
            type: 'date',
        },
        {
            label: 'Email',
            field: 'email',
        },
        {
            label: 'Phone',
            field: 'phone',
        },
        {
            label: 'Membership',
            field: 'membership',
            disabled: true,
        },
    ];

    const handleFormSubmit = (value: FieldValues) => {
        const customerDetails = ['email', 'birth_date', 'phone'];

        if (currentCustomer && isSuccess) {
            let patchData: UpdateCurrentCustomerPayload = {};
            Object.keys(value).forEach((key) => {
                const isDirty = form.getFieldState(key).isDirty;
                if (isDirty) {
                    if (customerDetails.includes(key)) {
                        if (!patchData.customer_details) {
                            patchData.customer_details = {};
                        }
                        patchData.customer_details[key] =
                            key === 'birth_date'
                                ? dayjs(value.birth_date)
                                      .utc()
                                      .format('YYYY-MM-DD')
                                : value[key];
                    } else {
                        patchData[key] = value[key];
                    }
                }
            });

            if (!lodash.isEmpty(patchData)) {
                updateCurrentCustomer(patchData)
                    .unwrap()
                    .then(() =>
                        setShowAlert({
                            show: true,
                            severity: 'success',
                            msg: PROFILE_CHANGE_SUCCESS_MSG,
                        })
                    )
                    .catch(() =>
                        setShowAlert({
                            show: true,
                            severity: 'error',
                            msg: PROFILE_CHANGE_FAILURE_MSG,
                        })
                    );
            } else {
                setShowAlert({
                    show: true,
                    severity: 'info',
                    msg: PROFILE_CHANGE_NOTHING_MSG,
                });
            }
        }
    };

    const closeAlert = () => {
        setShowAlert((prev) => ({
            ...prev,
            show: false,
        }));
    };

    useEffect(() => {
        if (currentCustomer && isSuccess) {
            const FORM_INIT_VALUES = {
                first_name: currentCustomer?.first_name || '',
                last_name: currentCustomer?.last_name || '',
                membership: currentCustomer?.membership || 'B',
                email: currentCustomer?.customer_details?.email || '',
                phone: currentCustomer?.customer_details?.phone || '',
                birth_date: currentCustomer?.customer_details?.birth_date || '',
            };
            form.reset(FORM_INIT_VALUES);
        }
    }, [currentCustomer, form, isSuccess]);

    useEffect(() => {
        if (!isUserStatusSuccess) {
            navigate('/login');
        }
    }, [isUserStatusSuccess, navigate]);

    return (
        <>
            <Typography variant='h3' sx={{ marginTop: 3 }}>
                Your Profile
            </Typography>
            <Alert
                showAlert={showAlert}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={closeAlert}
            />
            <GenericForm
                form={form}
                size='small'
                fields={formFields}
                onSubmit={handleFormSubmit}
                disabled={isUpdating}
            />
        </>
    );
};

export default Profile;
