import React, { forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Box, Card, Typography, Grid, Divider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FormRefType } from '../CreateClient';
import { CompanyFormData } from './CompanyForm';
import { IntegrationFormData } from './IntegrationForm';

interface ApprovalFormProps {
    onDataChange: (data: ApprovalFormData) => void;
    onValidChange: (isValid: boolean) => void;
    initialData?: ApprovalFormData;
    companyData?: CompanyFormData;
    integrationData?: IntegrationFormData;
}

export interface ApprovalFormData {
    autoApprove?: boolean;
    sendWelcomeEmail?: boolean;
}

const ApprovalForm = forwardRef<FormRefType, ApprovalFormProps>(
    ({ onDataChange, onValidChange, initialData = {}, companyData = {}, integrationData = {} }, ref) => {
        const { control, handleSubmit, formState, trigger, getValues, setValue, reset, watch } = useForm<ApprovalFormData>({
            mode: 'onChange',
            defaultValues: {
                autoApprove: false,
                sendWelcomeEmail: false,
                ...initialData
            }
        });

        const { isValid, isDirty } = formState;
        const autoApprove = watch('autoApprove');
        const sendWelcomeEmail = watch('sendWelcomeEmail');

        // Wrap onDataChange in useCallback to prevent recreation on every render
        const handleDataChange = useCallback((data: ApprovalFormData) => {
            onDataChange(data);
        }, [onDataChange]);

        // Expose the validation method to the parent component
        useImperativeHandle(ref, () => ({
            validate: async () => {
                // This form is always valid since there are no required fields
                return true;
            }
        }));

        // Load initial data if provided
        useEffect(() => {
            if (initialData && Object.keys(initialData).length > 0) {
                reset(initialData);
            }
        }, [initialData, reset]);

        // Notify parent this form is always valid
        useEffect(() => {
            onValidChange(true);
        }, [onValidChange]);

        // Update the parent with form data when fields change
        useEffect(() => {
            if (isDirty) {
                const currentValues = getValues();
                handleDataChange(currentValues);
            }
        }, [isDirty, handleDataChange, getValues]);

        // Handler for checkbox changes
        const handleCheckboxChange = (name: 'autoApprove' | 'sendWelcomeEmail', value: boolean) => {
            setValue(name, value, {
                shouldDirty: true,
                shouldValidate: true
            });
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
                        Account Summary
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: '#F8F9FF', borderRadius: 2, border: '1px solid #E6E6E9' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Company Information</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Company Name</Typography>
                                        <Typography fontWeight={500}>{companyData.companyName || 'Not specified'}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Industry</Typography>
                                        <Typography fontWeight={500}>{companyData.industry || 'Not specified'}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Size</Typography>
                                        <Typography fontWeight={500}>{companyData.companySize || 'Not specified'}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Contact</Typography>
                                        <Typography fontWeight={500}>{companyData.contactName || 'Not specified'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: '#F8F9FF', borderRadius: 2, border: '1px solid #E6E6E9' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Integration Details</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Integration Type</Typography>
                                        <Typography fontWeight={500}>
                                            {integrationData.integrationType === 'rest' ? 'REST API' :
                                                integrationData.integrationType === 'graphql' ? 'GraphQL' :
                                                    integrationData.integrationType === 'file' ? 'File Upload' : 'Not specified'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Authentication</Typography>
                                        <Typography fontWeight={500}>
                                            {integrationData.authMethod === 'oauth2' ? 'OAuth 2.0' :
                                                integrationData.authMethod === 'apikey' ? 'API Key' :
                                                    integrationData.authMethod === 'basic' ? 'Basic Auth' : 'Not specified'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Data Format</Typography>
                                        <Typography fontWeight={500}>
                                            {integrationData.dataFormat === 'json' ? 'JSON' :
                                                integrationData.dataFormat === 'xml' ? 'XML' : 'Not specified'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography color="text.secondary">Rate Limit</Typography>
                                        <Typography fontWeight={500}>{integrationData.rateLimit ? `${integrationData.rateLimit} req/min` : 'Not specified'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                <Card sx={sectionStyles}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
                        Approval Settings
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Controller
                            name="autoApprove"
                            control={control}
                            render={({ field }) => (
                                <Card
                                    onClick={() => handleCheckboxChange('autoApprove', !field.value)}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: field.value ? '#5263FF' : '#E5E7EB',
                                        bgcolor: field.value ? '#F8F9FF' : '#FFFFFF',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            borderColor: '#5263FF',
                                            bgcolor: '#F8F9FF',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0px 2px 8px rgba(82, 99, 255, 0.1)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) => handleCheckboxChange('autoApprove', e.target.checked)}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                accentColor: '#5263FF',
                                                cursor: 'pointer',
                                                marginTop: 4
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: field.value ? 600 : 500,
                                                    color: field.value ? '#5263FF' : '#1F2937',
                                                    mb: 0.5
                                                }}
                                            >
                                                Auto-approve for production
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Automatically generate and provide API credentials
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            )}
                        />
                        <Controller
                            name="sendWelcomeEmail"
                            control={control}
                            render={({ field }) => (
                                <Card
                                    onClick={() => handleCheckboxChange('sendWelcomeEmail', !field.value)}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: field.value ? '#5263FF' : '#E5E7EB',
                                        bgcolor: field.value ? '#F8F9FF' : '#FFFFFF',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            borderColor: '#5263FF',
                                            bgcolor: '#F8F9FF',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0px 2px 8px rgba(82, 99, 255, 0.1)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) => handleCheckboxChange('sendWelcomeEmail', e.target.checked)}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                accentColor: '#5263FF',
                                                cursor: 'pointer',
                                                marginTop: 4
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: field.value ? 600 : 500,
                                                    color: field.value ? '#5263FF' : '#1F2937',
                                                    mb: 0.5
                                                }}
                                            >
                                                Send welcome email
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Include account details and getting started guide
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            )}
                        />
                    </Box>
                </Card>
            </Box>
        );
    });

export default ApprovalForm; 