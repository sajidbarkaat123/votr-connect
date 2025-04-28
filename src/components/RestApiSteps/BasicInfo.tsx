import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Typography, TextField, Grid, MenuItem, FormControlLabel, Checkbox, FormGroup, FormLabel, FormControl } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BasicInfoRef, BasicInfoFormData, basicInfoSchema } from './types';

type BasicInfoProps = {
    initialValues?: BasicInfoFormData | null;
};

const fallbackDefaults: BasicInfoFormData = {
    integrationName: '',
    dataFormat: 'JSON',
    updateFrequency: '',
    baseUrl: '',
    restMethod: '',
    environment: '',
    isActive: false,
    queryParams: {
        limit: { enabled: false, value: 10 },
        offset: { enabled: false, value: 0 }
    }
};

const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>(({ initialValues, ...props }, ref) => {
    const { control, handleSubmit, formState: { errors, isValid }, trigger, watch, reset } = useForm<BasicInfoFormData>({
        resolver: yupResolver(basicInfoSchema),
        defaultValues: initialValues || fallbackDefaults,
        mode: 'onChange'
    });
    // Watch the enabled state of queryParams to control TextField visibility
    const limitEnabled = watch('queryParams.limit.enabled');
    const offsetEnabled = watch('queryParams.offset.enabled');

    // // Validate the form whenever it changes
    // useEffect(() => {
    //     trigger();
    // }, [trigger]);

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    useImperativeHandle(ref, () => ({
        isValid: () => isValid,
        getData: () => watch() as BasicInfoFormData
    }));

    const onSubmit = (data: BasicInfoFormData) => {
        // No need to set local state, react-hook-form manages it
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} onChange={() => trigger()}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure REST API Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up your integration to receive data via REST API endpoints
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="integrationName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Integration Name"
                                required
                                error={!!errors.integrationName}
                                helperText={errors.integrationName?.message}
                                sx={{ mb: 2 }}
                            />
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
                                error={!!errors.dataFormat}
                                helperText={errors.dataFormat?.message}
                            >
                                <MenuItem value="JSON">JSON</MenuItem>
                                <MenuItem value="XML">XML</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="updateFrequency"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                select
                                label="Update Frequency"
                                error={!!errors.updateFrequency}
                                helperText={errors.updateFrequency?.message}
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="restMethod"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                select
                                label="REST Method"
                                error={!!errors.restMethod}
                                helperText={errors.restMethod?.message}
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="PATCH">PATCH</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="environment"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                select
                                label="Environment"
                                error={!!errors.environment}
                                helperText={errors.environment?.message}
                            >
                                <MenuItem value="development">Development</MenuItem>
                                <MenuItem value="staging">Staging</MenuItem>
                                <MenuItem value="production">Production</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="baseUrl"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Endpoint Base URL"
                                required
                                error={!!errors.baseUrl}
                                helperText={errors.baseUrl?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                }
                                label="Integration is active"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend">Query Parameters</FormLabel>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Controller
                                        name="queryParams.limit.enabled"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                }
                                                label="Limit"
                                            />
                                        )}
                                    />
                                    {limitEnabled && (
                                        <Controller
                                            name="queryParams.limit.value"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    label="Limit Value"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mt: 1, ml: 3, width: '80%' }}
                                                    InputProps={{ inputProps: { min: 1 } }}
                                                    error={!!errors.queryParams?.limit?.value}
                                                    helperText={errors.queryParams?.limit?.value?.message}
                                                />
                                            )}
                                        />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Controller
                                        name="queryParams.offset.enabled"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                }
                                                label="Offset"
                                            />
                                        )}
                                    />
                                    {offsetEnabled && (
                                        <Controller
                                            name="queryParams.offset.value"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    defaultValue={0}
                                                    value={field.value || 0}
                                                    type="number"
                                                    label="Offset Value"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mt: 1, ml: 3, width: '80%' }}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    error={!!errors.queryParams?.offset?.value}
                                                    helperText={errors.queryParams?.offset?.value?.message}
                                                />
                                            )}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
});

export default BasicInfo; 