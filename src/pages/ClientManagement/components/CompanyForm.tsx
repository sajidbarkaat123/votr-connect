import React, { forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Box, Card, Typography, TextField, Grid, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FormRefType } from '../CreateClient';

interface CompanyFormProps {
    onDataChange: (data: CompanyFormData) => void;
    onValidChange: (isValid: boolean) => void;
    initialData?: CompanyFormData;
}

export interface CompanyFormData {
    companyName?: string;
    industry?: string;
    companySize?: string;
    address?: string;
    contactName?: string;
    contactEmail?: string;
}

const CompanyForm = forwardRef<FormRefType, CompanyFormProps>(
    ({ onDataChange, onValidChange, initialData = {} }, ref) => {
        const { control, handleSubmit, formState, trigger, getValues, reset } = useForm<CompanyFormData>({
            mode: 'onChange',
            defaultValues: {
                companyName: '',
                industry: '',
                companySize: '',
                address: '',
                contactName: '',
                contactEmail: '',
                ...initialData
            }
        });

        const { isValid, errors, isDirty } = formState;

        // Wrap onDataChange in useCallback to prevent recreation on every render
        const handleDataChange = useCallback((data: CompanyFormData) => {
            onDataChange(data);
        }, [onDataChange]);

        // Expose the validation method to the parent component
        useImperativeHandle(ref, () => ({
            validate: async () => {
                const result = await trigger();
                return result;
            }
        }));

        // Load initial data if provided
        useEffect(() => {
            if (initialData && Object.keys(initialData).length > 0) {
                reset(initialData);
            }
        }, [initialData, reset]);

        // Notify parent about validation status changes
        useEffect(() => {
            onValidChange(isValid);
        }, [isValid, onValidChange]);

        // Update the parent with form data when fields change
        useEffect(() => {
            if (isDirty) {
                const currentValues = getValues();
                handleDataChange(currentValues);
            }
        }, [isDirty, handleDataChange, getValues]);

        // Common text field styles
        const textFieldStyles = {
            '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                backgroundColor: '#F9FAFB',
                height: '48px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: '#F3F4F6',
                },
                '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                        borderColor: '#5263FF',
                        borderWidth: '2px',
                    }
                }
            },
            '& .MuiOutlinedInput-input': {
                padding: '12px 16px',
                fontSize: '15px',
                '&::placeholder': {
                    color: '#9CA3AF',
                    opacity: 1
                }
            },
            '& .MuiInputLabel-root': {
                color: '#4B5563',
                fontSize: '14px',
                transform: 'translate(16px, 14px) scale(1)',
                '&.Mui-focused': {
                    color: '#5263FF',
                    transform: 'translate(16px, -9px) scale(0.75)'
                },
                '&.MuiFormLabel-filled': {
                    transform: 'translate(16px, -9px) scale(0.75)'
                }
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E5E7EB',
                borderWidth: '1px'
            },
            '& .MuiSelect-select': {
                padding: '12px 16px !important'
            },
            '& .Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ef4444',
                borderWidth: '1px'
            },
            '& .Mui-error.MuiFormLabel-root': {
                color: '#ef4444'
            }
        };

        // Multiline text field styles
        const multilineTextFieldStyles = {
            ...textFieldStyles,
            '& .MuiOutlinedInput-root': {
                ...textFieldStyles['& .MuiOutlinedInput-root'],
                height: 'auto',
                '& textarea': {
                    padding: '12px 16px'
                }
            }
        };

        // Common section styles
        const sectionStyles = {
            p: 4,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            bgcolor: '#FFFFFF',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)'
        };

        return (
            <Box>
                <Card sx={sectionStyles}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
                        Company Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="companyName"
                                control={control}
                                rules={{ required: 'Company name is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Company Name"
                                        required
                                        placeholder="Enter company name"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="industry"
                                control={control}
                                rules={{ required: 'Industry is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select
                                        label="Industry"
                                        required
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    >
                                        <MenuItem value="">Select industry</MenuItem>
                                        <MenuItem value="finance">Finance</MenuItem>
                                        <MenuItem value="technology">Technology</MenuItem>
                                        <MenuItem value="healthcare">Healthcare</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="companySize"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select
                                        label="Company Size"
                                        sx={textFieldStyles}
                                    >
                                        <MenuItem value="">Select size</MenuItem>
                                        <MenuItem value="1-50">1-50 employees</MenuItem>
                                        <MenuItem value="51-200">51-200 employees</MenuItem>
                                        <MenuItem value="201-500">201-500 employees</MenuItem>
                                        <MenuItem value="501-1000">501-1000 employees</MenuItem>
                                        <MenuItem value="1000+">1000+ employees</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Address"
                                        multiline
                                        rows={2}
                                        placeholder="Enter company address"
                                        sx={multilineTextFieldStyles}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Card>

                <Card sx={sectionStyles}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Primary Contact
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="contactName"
                                control={control}
                                rules={{ required: 'Contact name is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Full Name"
                                        required
                                        placeholder="Enter full name"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="contactEmail"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email Address"
                                        required
                                        type="email"
                                        placeholder="Enter email address"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        );
    });

export default CompanyForm; 