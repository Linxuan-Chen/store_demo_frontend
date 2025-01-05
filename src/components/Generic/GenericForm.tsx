import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Paper,
    TextField,
    Typography,
    Checkbox,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    Controller,
    FieldValues,
    UseFormReturn,
    SubmitHandler,
} from 'react-hook-form';
import dayjs from 'dayjs';
export type GenericFormFieldsType = Array<{
    label: string;
    field: string;
    disabled?: boolean;
    defaultValue?: any;
    type?: 'date' | 'checkbox';
    disableFuture?: boolean;
}>;

export interface GenericFormProps {
    fields: GenericFormFieldsType;
    size?: 'medium' | 'small';
    title?: string;
    form: UseFormReturn<FieldValues, any, undefined>;
    confirmText?: string;
    onSubmit: SubmitHandler<FieldValues>;
    onClose?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

/**
 * @description: Generic form component
 * @param {GenericFormFieldsType} fields form fields
 * @param {string} size form text field size
 * @param {string} title form title
 * @param {UseFormReturn<FieldValues, any, undefined>} form react-hook-form form object
 * @param {string} confirmText confirmation button text
 * @param {boolean} disabled confirmation button disabled
 */
const GenericForm: React.FC<GenericFormProps> = ({
    fields,
    form,
    size,
    title,
    confirmText,
    onSubmit,
    disabled,
    onClose,
}) => {
    return (
        <Box sx={{ padding: 3 }}>
            {title && (
                <Typography variant='h3' sx={{ marginTop: 3 }}>
                    {title}
                </Typography>
            )}
            <Paper component='form' sx={{ marginTop: 3, marginBottom: 3 }}>
                {fields &&
                    fields.map((formField) => {
                        return (
                            <FormControl
                                fullWidth={formField.type !== 'checkbox'}
                                key={formField.field}
                            >
                                {formField.type !== 'checkbox' && (
                                    <FormLabel>{formField.label}:</FormLabel>
                                )}
                                <Controller
                                    name={formField.field}
                                    control={form.control}
                                    render={({ field, fieldState }) => {
                                        let element;
                                        switch (formField.type) {
                                            case 'date':
                                                element = (
                                                    <LocalizationProvider
                                                        dateAdapter={
                                                            AdapterDayjs
                                                        }
                                                    >
                                                        <DatePicker
                                                            value={
                                                                field.value
                                                                    ? dayjs(
                                                                          field.value
                                                                      )
                                                                    : null
                                                            }
                                                            onChange={(date) =>
                                                                field.onChange(
                                                                    date
                                                                )
                                                            }
                                                            slotProps={{
                                                                textField: {
                                                                    size: 'small',
                                                                },
                                                            }}
                                                            disableFuture={
                                                                formField.disableFuture
                                                            }
                                                        />
                                                    </LocalizationProvider>
                                                );
                                                break;
                                            case 'checkbox':
                                                element = (
                                                    <span>
                                                        <FormLabel>
                                                            {formField.label}:
                                                        </FormLabel>
                                                        <Checkbox
                                                            {...field}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    </span>
                                                );
                                                break;
                                            default:
                                                element = (
                                                    <TextField
                                                        {...field}
                                                        disabled={
                                                            formField.disabled
                                                        }
                                                        size={size}
                                                        type='text'
                                                        error={
                                                            !!fieldState.error
                                                        }
                                                        helperText={
                                                            fieldState.error
                                                                ?.message
                                                        }
                                                    />
                                                );
                                        }
                                        return element;
                                    }}
                                />
                            </FormControl>
                        );
                    })}
            </Paper>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    disabled={disabled}
                    variant='contained'
                    type='submit'
                    onClick={form.handleSubmit(onSubmit)}
                >
                    {confirmText || 'Submit'}
                </Button>
                {onClose && (
                    <Button color='warning' onClick={onClose}>
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default GenericForm;
