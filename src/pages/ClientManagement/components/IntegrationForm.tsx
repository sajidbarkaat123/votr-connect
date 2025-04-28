import React, { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Box, Card, Typography, TextField, Grid, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FormRefType } from '../CreateClient';

interface IntegrationFormProps {
    onDataChange: (data: IntegrationFormData) => void;
    onValidChange: (isValid: boolean) => void;
    initialData?: IntegrationFormData;
}

export interface IntegrationFormData {
    integrationType?: string;
    baseUrl?: string;
    authMethod?: string;
    dataFormat?: string;
    rateLimit?: string;
}

const IntegrationForm = forwardRef<FormRefType, IntegrationFormProps>(
    ({ onDataChange, onValidChange, initialData = {} }, ref) => {
        const { control, handleSubmit, formState, trigger, getValues, setValue, reset, watch } = useForm<IntegrationFormData>({
            mode: 'onChange',
            defaultValues: {
                integrationType: 'rest',
                baseUrl: '',
                authMethod: 'oauth2',
                dataFormat: 'json',
                rateLimit: '',
                ...initialData
            }
        });

        const { isValid, errors, isDirty } = formState;
        const integrationType = watch('integrationType');

        // Wrap onDataChange in useCallback to prevent recreation on every render
        const handleDataChange = useCallback((data: IntegrationFormData) => {
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

        // Common section styles
        const sectionStyles = {
            p: 4,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            bgcolor: '#FFFFFF',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)'
        };

        // Integration type options
        const integrationTypes = [
            { id: 'rest', label: 'REST API', description: 'Standard REST API integration with comprehensive documentation' },
            { id: 'graphql', label: 'GraphQL', description: 'Flexible queries and mutations for complex data requirements' },
            { id: 'file', label: 'File Upload', description: 'Bulk data processing and automated file synchronization' }
        ];

        // Handler for integration type change
        const handleIntegrationTypeChange = (value: string) => {
            setValue('integrationType', value, {
                shouldDirty: true,
                shouldValidate: true
            });
        };

        return (
            <Box>
                <Card sx={sectionStyles}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
                        Integration Method
                    </Typography>
                    <Controller
                        name="integrationType"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {integrationTypes.map((type) => (
                                    <Card
                                        key={type.id}
                                        onClick={() => handleIntegrationTypeChange(type.id)}
                                        sx={{
                                            p: 3,
                                            flex: 1,
                                            cursor: 'pointer',
                                            bgcolor: field.value === type.id ? '#F8F9FF' : '#FFFFFF',
                                            color: '#1F2937',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: field.value === type.id ? '#5263FF' : '#E5E7EB',
                                            transition: 'all 0.2s ease-in-out',
                                            position: 'relative',
                                            '&:hover': {
                                                borderColor: '#5263FF',
                                                bgcolor: '#F8F9FF',
                                                '& .MuiRadio-root': {
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <input
                                                type="radio"
                                                checked={field.value === type.id}
                                                onChange={() => handleIntegrationTypeChange(type.id)}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    accentColor: '#5263FF',
                                                    marginTop: 4
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: field.value === type.id ? 600 : 500,
                                                        color: field.value === type.id ? '#5263FF' : '#1F2937',
                                                        mb: 1
                                                    }}
                                                >
                                                    {type.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {type.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {type.id === 'rest' && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    bgcolor: '#5263FF',
                                                    color: 'white',
                                                    borderRadius: 1,
                                                    fontSize: '12px',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Recommended
                                            </Box>
                                        )}
                                    </Card>
                                ))}
                            </Box>
                        )}
                    />
                </Card>

                <Card sx={sectionStyles}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
                        API Configuration
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="baseUrl"
                                control={control}
                                rules={{
                                    required: 'Base URL is required',
                                    pattern: {
                                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                        message: 'Please enter a valid URL'
                                    }
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Base URL"
                                        required
                                        placeholder="https://api.example.com/v1"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="authMethod"
                                control={control}
                                rules={{ required: 'Authentication method is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select
                                        label="Authentication Method"
                                        required
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={textFieldStyles}
                                    >
                                        <MenuItem value="oauth2">OAuth 2.0</MenuItem>
                                        <MenuItem value="apikey">API Key</MenuItem>
                                        <MenuItem value="basic">Basic Auth</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="dataFormat"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select
                                        label="Data Format"
                                        sx={textFieldStyles}
                                    >
                                        <MenuItem value="json">JSON</MenuItem>
                                        <MenuItem value="xml">XML</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="rateLimit"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Rate Limit (requests/minute)"
                                        type="number"
                                        placeholder="Enter rate limit"
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

export default IntegrationForm; 