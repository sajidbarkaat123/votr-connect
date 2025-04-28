import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Typography, TextField, Grid, MenuItem } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthenticationRef, AuthFormData, authSchema } from './types';

type AuthenticationProps = {
    initialValues?: AuthFormData | null;
};

const fallbackDefaults: AuthFormData = {
    authMethod: 'oauth2',
    grantType: 'client_credentials',
    scopes: 'read:shareholders',
    tokenUrl: 'https://api.yourplatform.com/oauth/token',
    clientId: '',
    clientSecret: '',
    redirectUri: 'https://portal.yourcompany.com/callback',
    // Add other fields as needed for your form
};

const Authentication = forwardRef<AuthenticationRef, AuthenticationProps>(({ initialValues, ...props }, ref) => {
    const { control, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm<AuthFormData>({
        resolver: yupResolver(authSchema),
        defaultValues: initialValues || fallbackDefaults,
        mode: 'onChange'
    });


    useImperativeHandle(ref, () => ({
        isValid: () => isValid,
        getData: () => watch() as AuthFormData
    }));

    const authMethod = watch('authMethod');
    const grantType = watch('grantType');

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const onSubmit = (data: AuthFormData) => {
        // No need to set local state, react-hook-form manages it
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure REST API Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up authentication for your REST API integration
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="authMethod"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                select
                                label="Authentication Method"
                                error={!!errors.authMethod}
                                helperText={errors.authMethod?.message}
                            >
                                <MenuItem value="oauth2">OAuth 2.0</MenuItem>
                                <MenuItem value="apikey">API Key</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>

                {authMethod === 'oauth2' && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            OAuth 2.0 Settings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="grantType"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            select
                                            label="Grant Type"
                                            error={!!errors.grantType}
                                            helperText={errors.grantType?.message}
                                        >
                                            <MenuItem value="client_credentials">Client Credentials</MenuItem>
                                            <MenuItem value="authorization_code">Authorization Code</MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="scopes"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Scopes (comma-separated)"
                                            error={!!errors.scopes}
                                            helperText={errors.scopes?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="tokenUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Token URL"
                                            required
                                            error={!!errors.tokenUrl}
                                            helperText={errors.tokenUrl?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="clientId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Client ID"
                                            required
                                            error={!!errors.clientId}
                                            helperText={errors.clientId?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="clientSecret"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="password"
                                            label="Client Secret"
                                            required
                                            error={!!errors.clientSecret}
                                            helperText={errors.clientSecret?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {grantType === 'authorization_code' && (
                                <>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="authUrl"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Authorization URL"
                                                    required
                                                    error={!!errors.authUrl}
                                                    helperText={errors.authUrl?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <Controller
                                    name="redirectUri"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Redirect URI"
                                            required={grantType === 'authorization_code'}
                                            error={!!errors.redirectUri}
                                            helperText={errors.redirectUri?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {authMethod === 'apikey' && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            API Key Settings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="headerName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Header Name"
                                            placeholder="e.g., X-API-Key or Authorization"
                                            required
                                            error={!!errors.headerName}
                                            helperText={errors.headerName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="apiKeyValue"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="password"
                                            label="API Key Value"
                                            required
                                            error={!!errors.apiKeyValue}
                                            helperText={errors.apiKeyValue?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
});

export default Authentication; 