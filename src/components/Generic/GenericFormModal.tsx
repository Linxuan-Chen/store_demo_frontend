import { useState, useEffect } from 'react';
import { Dialog, Paper } from '@mui/material';
import GenericForm, { GenericFormProps } from './GenericForm';

interface GenericFormModalProps {
    formConfigs: GenericFormProps;
    open: boolean;
    onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

const GenericFormModal: React.FC<GenericFormModalProps> = ({
    formConfigs,
    open,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <GenericForm {...formConfigs} />
        </Dialog>
    );
};

export default GenericFormModal;
