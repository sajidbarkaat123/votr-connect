import { Box, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton, FormHelperText, OutlinedInput, InputAdornment } from '@mui/material';
import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface SecurityFormValues {
    authMethod: string;
    apiKey?: string;
    bearerToken?: string;
    oauthClientId?: string;
    oauthClientSecret?: string;
    maxQueryDepth: number;
    maxQueryCost: number;
    rateLimit: number;
    timeout: number;
}

export interface SecurityRef {
    validate: () => Promise<boolean>;
    isValid: () => boolean;
}

interface SecurityProps {
    formData: SecurityFormValues;
    updateFormData: (data: SecurityFormValues) => void;
}

const Security = forwardRef<SecurityRef, SecurityProps>(({ formData, updateFormData }, ref) => {
    const [showToken, setShowToken] = useState(false);

    // Add refs to track state changes
    const prevFormDataRef = useRef(formData);
    const isInitialMount = useRef(true);
    const skipParentUpdate = useRef(false);

    const { control, formState: { errors, isValid }, trigger, watch, setValue } = useForm<SecurityFormValues>({
        defaultValues: formData,
        mode: 'onChange'
    });

    // Watch form values and update parent with proper guards
    const formValues = watch();
    useEffect(() => {
        // Skip the first render and when updating from parent
        if (isInitialMount.current || skipParentUpdate.current) {
            skipParentUpdate.current = false;
            return;
        }

        // Check if values actually changed before updating parent
        if (JSON.stringify(formValues) !== JSON.stringify(prevFormDataRef.current)) {
            updateFormData(formValues);

            // Update the ref with new values
            prevFormDataRef.current = { ...formValues };
        }
    }, [formValues, updateFormData]);

    // Set initial values from props with proper guards
    useEffect(() => {
        // Skip updates on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Check if formData has actually changed
        if (JSON.stringify(formData) !== JSON.stringify(prevFormDataRef.current)) {
            // Mark that we're updating from parent props
            skipParentUpdate.current = true;

            // Apply each changed field
            Object.entries(formData).forEach(([key, value]) => {
                setValue(key as keyof SecurityFormValues, value);
            });

            // Update the ref with current props for next comparison
            prevFormDataRef.current = { ...formData };
        }
    }, [formData, setValue]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        validate: async () => {
            const result = await trigger();
            return result;
        },
        isValid: () => {
            return isValid;
        }
    }));

    const handleToggleTokenVisibility = () => {
        setShowToken(prev => !prev);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up security for your GraphQL endpoint
            </Typography>
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Authentication
                    <Tooltip
                        title="Select the authentication method to secure your GraphQL API"
                        arrow
                        placement="right"
                    >
                        <IconButton size="small">
                            <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Controller
                    name="authMethod"
                    control={control}
                    rules={{ required: 'Authentication method is required' }}
                    render={({ field }) => (
                        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.authMethod}>
                            <InputLabel>Authentication Method</InputLabel>
                            <Select
                                {...field}
                                label="Authentication Method"
                            >
                                <MenuItem value="Bearer Token">Bearer Token</MenuItem>
                                <MenuItem value="API Key">API Key</MenuItem>
                                <MenuItem value="OAuth 2.0">OAuth 2.0</MenuItem>
                            </Select>
                            {errors.authMethod && (
                                <FormHelperText error>{errors.authMethod.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Show appropriate authentication field based on selected method */}
                <Controller
                    name="authMethod"
                    control={control}
                    render={({ field }) => (
                        <>
                            {field.value === 'Bearer Token' && (
                                <Controller
                                    name="bearerToken"
                                    control={control}
                                    rules={{ required: 'Bearer token is required' }}
                                    render={({ field: tokenField }) => (
                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.bearerToken}>
                                            <InputLabel>Bearer Token</InputLabel>
                                            <OutlinedInput
                                                {...tokenField}
                                                type={showToken ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleToggleTokenVisibility}
                                                            edge="end"
                                                        >
                                                            {showToken ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Bearer Token"
                                            />
                                            {errors.bearerToken && (
                                                <FormHelperText error>{errors.bearerToken.message}</FormHelperText>
                                            )}
                                            <FormHelperText>
                                                Enter your authentication token to secure API access
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            )}

                            {field.value === 'API Key' && (
                                <Controller
                                    name="apiKey"
                                    control={control}
                                    rules={{ required: 'API Key is required' }}
                                    render={({ field: keyField }) => (
                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.apiKey}>
                                            <InputLabel>API Key</InputLabel>
                                            <OutlinedInput
                                                {...keyField}
                                                type={showToken ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleToggleTokenVisibility}
                                                            edge="end"
                                                        >
                                                            {showToken ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="API Key"
                                            />
                                            {errors.apiKey && (
                                                <FormHelperText error>{errors.apiKey.message}</FormHelperText>
                                            )}
                                            <FormHelperText>
                                                Enter your API key for authentication
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            )}

                            {field.value === 'OAuth 2.0' && (
                                <>
                                    <Controller
                                        name="oauthClientId"
                                        control={control}
                                        rules={{ required: 'Client ID is required' }}
                                        render={({ field: clientIdField }) => (
                                            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.oauthClientId}>
                                                <InputLabel>Client ID</InputLabel>
                                                <OutlinedInput
                                                    {...clientIdField}
                                                    label="Client ID"
                                                />
                                                {errors.oauthClientId && (
                                                    <FormHelperText error>{errors.oauthClientId.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="oauthClientSecret"
                                        control={control}
                                        rules={{ required: 'Client Secret is required' }}
                                        render={({ field: clientSecretField }) => (
                                            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.oauthClientSecret}>
                                                <InputLabel>Client Secret</InputLabel>
                                                <OutlinedInput
                                                    {...clientSecretField}
                                                    type={showToken ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleToggleTokenVisibility}
                                                                edge="end"
                                                            >
                                                                {showToken ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Client Secret"
                                                />
                                                {errors.oauthClientSecret && (
                                                    <FormHelperText error>{errors.oauthClientSecret.message}</FormHelperText>
                                                )}
                                                <FormHelperText>
                                                    OAuth 2.0 credentials for secure authentication
                                                </FormHelperText>
                                            </FormControl>
                                        )}
                                    />
                                </>
                            )}
                        </>
                    )}
                />
            </Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Query Complexity Management
                    <Tooltip
                        title="Configure limits to prevent abuse and resource exhaustion"
                        arrow
                        placement="right"
                    >
                        <IconButton size="small">
                            <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Controller
                            name="maxQueryDepth"
                            control={control}
                            rules={{
                                required: 'Max Query Depth is required',
                                min: { value: 1, message: 'Depth must be at least 1' },
                                max: { value: 10, message: 'Depth should not exceed 10' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    label="Max Query Depth"
                                    error={!!errors.maxQueryDepth}
                                    helperText={errors.maxQueryDepth?.message || 'Limit how deep queries can nest'}
                                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="maxQueryCost"
                            control={control}
                            rules={{
                                required: 'Max Query Cost is required',
                                min: { value: 100, message: 'Cost must be at least 100' },
                                max: { value: 5000, message: 'Cost should not exceed 5000' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    label="Max Query Cost"
                                    error={!!errors.maxQueryCost}
                                    helperText={errors.maxQueryCost?.message || 'Maximum complexity of a single query'}
                                    InputProps={{ inputProps: { min: 100, max: 5000 } }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="rateLimit"
                            control={control}
                            rules={{
                                required: 'Rate Limit is required',
                                min: { value: 10, message: 'Rate limit must be at least 10' },
                                max: { value: 1000, message: 'Rate limit should not exceed 1000' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    label="Rate Limit (per minute)"
                                    error={!!errors.rateLimit}
                                    helperText={errors.rateLimit?.message || 'Maximum requests per minute'}
                                    InputProps={{ inputProps: { min: 10, max: 1000 } }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="timeout"
                            control={control}
                            rules={{
                                required: 'Timeout is required',
                                min: { value: 5, message: 'Timeout must be at least 5 seconds' },
                                max: { value: 120, message: 'Timeout should not exceed 120 seconds' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    label="Timeout (seconds)"
                                    error={!!errors.timeout}
                                    helperText={errors.timeout?.message || 'Maximum execution time for queries'}
                                    InputProps={{ inputProps: { min: 5, max: 120 } }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
});

export default Security; 