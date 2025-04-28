import { Box, Typography, TextField, Grid, FormControlLabel, Switch, Tooltip, IconButton, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useForm, Controller } from 'react-hook-form';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';

interface BasicInfoFormValues {
    integrationName: string;
    graphqlEndpoint: string;
    introspectionEnabled: boolean;
    environment: string;
    status: string;
    updateFrequency: string;
}

export interface BasicInfoRef {
    validate: () => Promise<boolean>;
    isValid: () => boolean;
}

interface BasicInfoProps {
    formData: BasicInfoFormValues;
    updateFormData: (data: BasicInfoFormValues) => void;
}

const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>(({ formData, updateFormData }, ref) => {
    const { control, formState: { errors, isValid }, trigger, watch, setValue } = useForm<BasicInfoFormValues>({
        defaultValues: formData,
        mode: 'onChange'
    });

    // Use ref to track if update is coming from internal change
    const isInternalUpdate = useRef(false);

    // Watch for form changes and update parent component
    const formValues = watch();
    useEffect(() => {
        // Only update if this isn't triggered by the parent data changing
        if (!isInternalUpdate.current && JSON.stringify(formValues) !== JSON.stringify(formData)) {
            updateFormData(formValues);
        }
        isInternalUpdate.current = false;
    }, [formValues, formData, updateFormData]);

    // Set initial form values from props only on mount or when formData changes
    useEffect(() => {
        const hasChanges =
            formData.integrationName !== formValues.integrationName ||
            formData.graphqlEndpoint !== formValues.graphqlEndpoint ||
            formData.introspectionEnabled !== formValues.introspectionEnabled ||
            formData.environment !== formValues.environment ||
            formData.status !== formValues.status ||
            formData.updateFrequency !== formValues.updateFrequency;

        if (hasChanges) {
            isInternalUpdate.current = true;
            setValue('integrationName', formData.integrationName);
            setValue('graphqlEndpoint', formData.graphqlEndpoint);
            setValue('introspectionEnabled', formData.introspectionEnabled);
            setValue('environment', formData.environment || 'development');
            setValue('status', formData.status || 'active');
            setValue('updateFrequency', formData.updateFrequency || 'daily');
        }
    }, [formData, setValue, formValues]);

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

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure GraphQL Integration
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
                Set up your integration with flexible GraphQL queries
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="integrationName"
                        control={control}
                        rules={{
                            required: 'Integration name is required',
                            minLength: { value: 3, message: 'Name must be at least 3 characters' }
                        }}
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
                <Grid item xs={12}>
                    <Controller
                        name="graphqlEndpoint"
                        control={control}
                        rules={{
                            required: 'GraphQL endpoint is required',
                            pattern: {
                                value: /^https:\/\/.*\/graphql.*/i,
                                message: 'URL must use HTTPS and include a valid GraphQL path'
                            },
                            validate: (value) => {
                                try {
                                    const url = new URL(value);
                                    return url.protocol === 'https:' && url.pathname.includes('graphql')
                                        ? true
                                        : 'URL must use HTTPS and include a valid GraphQL path';
                                } catch {
                                    return 'Please enter a valid URL';
                                }
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="GraphQL Endpoint"
                                required
                                error={!!errors.graphqlEndpoint}
                                helperText={errors.graphqlEndpoint?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="environment"
                        control={control}
                        rules={{ required: 'Environment is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.environment}>
                                <InputLabel id="environment-label" sx={{ color: 'text.primary' }}>Environment</InputLabel>
                                <Select
                                    {...field}
                                    labelId="environment-label"
                                    label="Environment"
                                    required
                                >
                                    <MenuItem value="development">Development</MenuItem>
                                    <MenuItem value="staging">Staging</MenuItem>
                                    <MenuItem value="production">Production</MenuItem>
                                </Select>
                                {errors.environment && <FormHelperText>{errors.environment.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="status-label" sx={{ color: 'text.primary' }}>Status</InputLabel>
                                <Select
                                    {...field}
                                    labelId="status-label"
                                    label="Status"
                                    required
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="updateFrequency"
                        control={control}
                        rules={{ required: 'Update frequency is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.updateFrequency}>
                                <InputLabel id="update-frequency-label" sx={{ color: 'text.primary' }}>Update Frequency</InputLabel>
                                <Select
                                    {...field}
                                    labelId="update-frequency-label"
                                    label="Update Frequency"
                                    required
                                >
                                    <MenuItem value="realtime">Real-time</MenuItem>
                                    <MenuItem value="hourly">Hourly</MenuItem>
                                    <MenuItem value="daily">Daily</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                </Select>
                                {errors.updateFrequency && <FormHelperText>{errors.updateFrequency.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                        name="introspectionEnabled"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormControlLabel
                                control={<Switch checked={value} onChange={onChange} {...field} />}
                                label="Introspection Enabled"
                            />
                        )}
                    />
                    <Tooltip
                        title="Introspection allows clients to query a GraphQL server for details about the schema. This is useful for tools and documentation, but may be disabled in production for security reasons."
                        arrow
                        placement="right"
                    >
                        <IconButton size="small" color="primary">
                            <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    );
});

export default BasicInfo; 