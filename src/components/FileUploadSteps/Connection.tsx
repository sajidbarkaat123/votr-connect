import { Box, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Button, FormHelperText, Tooltip, IconButton } from '@mui/material';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Define the type for different connection types
export type ConnectionType = 'SFTP' /* | 'FTPS' */ | 'S3';

// Interface for the different connection data types
export interface SFTPData {
    host: string;
    port: number;
    username: string;
    type: string;
    ftpAuthentication: {
        type: string;
        password?: string;
        sshKey?: string;
        passphrase?: string;
    };
}

// Commented out but preserved for future use
/* 
export interface FTPSData {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: 'Implicit' | 'Explicit';
}
*/

export interface S3Data {
    region: string;
    bucketName: string;
    folderPath?: string;
    amazonS3Authentication: {
        authenticationMethod: string;
        ARN?: string;
        accessKey?: string;
        secretKey?: string;
    };
}

export interface ConnectionData {
    connectionType: ConnectionType;
    sftp?: SFTPData;
    // ftps?: FTPSData;
    s3?: S3Data;
}

export interface ConnectionHandle {
    validate: () => Promise<boolean>;
    getData: () => ConnectionData;
}

interface ConnectionProps {
    onDataChange?: (data: ConnectionData) => void;
}

// SFTP Settings Component
const SFTPSettings = forwardRef<any, { control: any, errors: any, watch: any }>((props, ref) => {
    const { control, errors, watch } = props;
    const authenticationType = watch('sftp.ftpAuthentication.type');

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Controller
                    name="sftp.host"
                    control={control}
                    rules={{ required: "Host is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Host"
                            required
                            error={!!errors.sftp?.host}
                            helperText={errors.sftp?.host?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="sftp.port"
                    control={control}
                    rules={{
                        required: "Port is required",
                        min: { value: 1, message: "Port must be between 1-65535" },
                        max: { value: 65535, message: "Port must be between 1-65535" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Port"
                            required
                            type="number"
                            error={!!errors.sftp?.port}
                            helperText={errors.sftp?.port?.message}
                            inputProps={{ min: 1, max: 65535 }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="sftp.type"
                    control={control}
                    rules={{ required: "Type is required" }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.sftp?.type}>
                            <InputLabel>Connection Type</InputLabel>
                            <Select {...field}>
                                <MenuItem value="SFTP">SFTP</MenuItem>
                                <MenuItem value="FTP">FTP</MenuItem>
                                <MenuItem value="FTPS">FTPS</MenuItem>
                            </Select>
                            {errors.sftp?.type && (
                                <FormHelperText>{errors.sftp?.type?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="sftp.username"
                    control={control}
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Username"
                            required
                            error={!!errors.sftp?.username}
                            helperText={errors.sftp?.username?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="sftp.ftpAuthentication.type"
                    control={control}
                    rules={{ required: "Authentication type is required" }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.sftp?.ftpAuthentication?.type}>
                            <InputLabel>Authentication</InputLabel>
                            <Select {...field}>
                                <MenuItem value="SSH Key">SSH Key</MenuItem>
                                <MenuItem value="Password">Password</MenuItem>
                            </Select>
                            {errors.sftp?.ftpAuthentication?.type && (
                                <FormHelperText>{errors.sftp?.ftpAuthentication?.type?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>

            {/* Conditional fields based on authentication type */}
            {authenticationType === 'Password' && (
                <Grid item xs={12}>
                    <Controller
                        name="sftp.ftpAuthentication.password"
                        control={control}
                        rules={{ required: "Password is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Password"
                                type="password"
                                required
                                error={!!errors.sftp?.ftpAuthentication?.password}
                                helperText={errors.sftp?.ftpAuthentication?.password?.message}
                            />
                        )}
                    />
                </Grid>
            )}

            {authenticationType === 'SSH Key' && (
                <>
                    <Grid item xs={12}>
                        <Controller
                            name="sftp.ftpAuthentication.sshKey"
                            control={control}
                            rules={{ required: "SSH Key is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="SSH Key"
                                    multiline
                                    rows={4}
                                    required
                                    error={!!errors.sftp?.ftpAuthentication?.sshKey}
                                    helperText={errors.sftp?.ftpAuthentication?.sshKey?.message}
                                    placeholder="Paste your private key here or upload a file"
                                />
                            )}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Upload Key File
                            <input
                                type="file"
                                hidden
                                accept=".pem,.key,.ppk"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const content = event.target?.result as string;
                                            // You'll need to set the field value here
                                            // field.onChange(content);
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="sftp.ftpAuthentication.passphrase"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Passphrase (Optional)"
                                    type="password"
                                    error={!!errors.sftp?.ftpAuthentication?.passphrase}
                                    helperText={errors.sftp?.ftpAuthentication?.passphrase?.message}
                                />
                            )}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
});

// FTPS Settings Component - Commented out but preserved for future use
/*
const FTPSSettings = forwardRef<any, { control: any, errors: any }>((props, ref) => {
    const { control, errors } = props;

    const handleTestConnection = () => {
        // Mock implementation of connection test
        alert('Testing FTPS connection... This would connect to the server in a real implementation.');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Controller
                    name="ftps.host"
                    control={control}
                    rules={{ required: "Host is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Host"
                            required
                            error={!!errors.ftps?.host}
                            helperText={errors.ftps?.host?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="ftps.port"
                    control={control}
                    rules={{
                        required: "Port is required",
                        min: { value: 1, message: "Port must be between 1-65535" },
                        max: { value: 65535, message: "Port must be between 1-65535" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Port"
                            required
                            type="number"
                            error={!!errors.ftps?.port}
                            helperText={errors.ftps?.port?.message}
                            inputProps={{ min: 1, max: 65535 }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="ftps.username"
                    control={control}
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Username"
                            required
                            error={!!errors.ftps?.username}
                            helperText={errors.ftps?.username?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="ftps.password"
                    control={control}
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Password"
                            type="password"
                            required
                            error={!!errors.ftps?.password}
                            helperText={errors.ftps?.password?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="ftps.encryption"
                    control={control}
                    rules={{ required: "Encryption type is required" }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.ftps?.encryption}>
                            <InputLabel>Encryption</InputLabel>
                            <Select {...field}>
                                <MenuItem value="Implicit">Implicit</MenuItem>
                                <MenuItem value="Explicit">Explicit</MenuItem>
                            </Select>
                            {errors.ftps?.encryption && (
                                <FormHelperText>{errors.ftps?.encryption?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    onClick={handleTestConnection}
                    sx={{ mt: 2 }}
                >
                    Test Connection
                </Button>
            </Grid>
        </Grid>
    );
});
*/

// Amazon S3 Settings Component
const AmazonS3Settings = forwardRef<any, { control: any, errors: any, watch: any }>((props, ref) => {
    const { control, errors, watch } = props;
    const authMethod = watch('s3.amazonS3Authentication.authenticationMethod');

    // Validate ARN format
    const validateARN = (value: string) => {
        const arnRegex = /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/;
        return !value || arnRegex.test(value) || "Invalid ARN format. Example: arn:aws:iam::123456789012:role/S3Access";
    };

    // Validate bucket name
    const validateBucketName = (value: string) => {
        const bucketRegex = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
        if (!bucketRegex.test(value)) {
            return "Bucket name must be between 3 and 63 characters, contain only lowercase letters, numbers, periods, and hyphens";
        }
        if (/\.\./.test(value)) {
            return "Bucket name cannot contain consecutive periods";
        }
        if (/^(?:\d+\.){3}\d+$/.test(value)) {
            return "Bucket name cannot be formatted as an IP address";
        }
        return true;
    };

    const handleBrowseBuckets = () => {
        // Mock implementation
        alert('Browsing buckets... This would fetch available buckets from your AWS account in a real implementation.');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Controller
                    name="s3.region"
                    control={control}
                    rules={{ required: "Region is required" }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.s3?.region} sx={{ mb: 2 }}>
                            <InputLabel>Region</InputLabel>
                            <Select {...field}>
                                <MenuItem value="us-east-1">us-east-1 (N. Virginia)</MenuItem>
                                <MenuItem value="us-east-2">us-east-2 (Ohio)</MenuItem>
                                <MenuItem value="us-west-1">us-west-1 (N. California)</MenuItem>
                                <MenuItem value="us-west-2">us-west-2 (Oregon)</MenuItem>
                                <MenuItem value="eu-west-1">eu-west-1 (Ireland)</MenuItem>
                                <MenuItem value="eu-central-1">eu-central-1 (Frankfurt)</MenuItem>
                                <MenuItem value="ap-northeast-1">ap-northeast-1 (Tokyo)</MenuItem>
                                <MenuItem value="ap-southeast-1">ap-southeast-1 (Singapore)</MenuItem>
                            </Select>
                            {errors.s3?.region && (
                                <FormHelperText>{errors.s3?.region?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="s3.bucketName"
                    control={control}
                    rules={{
                        required: "Bucket name is required",
                        validate: validateBucketName
                    }}
                    render={({ field }) => (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TextField
                                {...field}
                                fullWidth
                                label="Bucket Name"
                                required
                                error={!!errors.s3?.bucketName}
                                helperText={errors.s3?.bucketName?.message}
                            />
                            <Tooltip title="S3 bucket naming rules: 3-63 characters, lowercase letters, numbers, dots, hyphens. Cannot be an IP address format." arrow>
                                <IconButton size="small" sx={{ mt: 1, ml: 1 }}>
                                    <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleBrowseBuckets}
                    sx={{ mt: 1 }}
                >
                    Browse Buckets
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="s3.folderPath"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Folder Path"
                            placeholder="incoming/data/"
                            error={!!errors.s3?.folderPath}
                            helperText={errors.s3?.folderPath?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6}>
                <Controller
                    name="s3.amazonS3Authentication.authenticationMethod"
                    control={control}
                    rules={{ required: "Authentication method is required" }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.s3?.amazonS3Authentication?.authenticationMethod} sx={{ mb: 2 }}>
                            <InputLabel>Authentication Method</InputLabel>
                            <Select {...field}>
                                <MenuItem value="IAM Role">IAM Role</MenuItem>
                                <MenuItem value="Access Key">Access Key</MenuItem>
                            </Select>
                            {errors.s3?.amazonS3Authentication?.authenticationMethod && (
                                <FormHelperText>{errors.s3?.amazonS3Authentication?.authenticationMethod?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>

            {/* Conditional fields based on authentication method */}
            {authMethod === 'IAM Role' && (
                <Grid item xs={6}>
                    <Controller
                        name="s3.amazonS3Authentication.ARN"
                        control={control}
                        rules={{
                            required: "ARN is required",
                            validate: validateARN
                        }}
                        render={({ field }) => (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="ARN"
                                    error={!!errors.s3?.amazonS3Authentication?.ARN}
                                    helperText={errors.s3?.amazonS3Authentication?.ARN?.message}
                                />
                                <Tooltip title="Amazon Resource Name format: arn:aws:iam::123456789012:role/RoleName" arrow>
                                    <IconButton size="small" sx={{ mt: 1, ml: 1 }}>
                                        <HelpOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                </Grid>
            )}

            {authMethod === 'Access Key' && (
                <>
                    <Grid item xs={6}>
                        <Controller
                            name="s3.amazonS3Authentication.accessKey"
                            control={control}
                            rules={{ required: "Access Key is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Access Key ID"
                                    required
                                    error={!!errors.s3?.amazonS3Authentication?.accessKey}
                                    helperText={errors.s3?.amazonS3Authentication?.accessKey?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="s3.amazonS3Authentication.secretKey"
                            control={control}
                            rules={{ required: "Secret Key is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Secret Access Key"
                                    type="password"
                                    required
                                    error={!!errors.s3?.amazonS3Authentication?.secretKey}
                                    helperText={errors.s3?.amazonS3Authentication?.secretKey?.message}
                                />
                            )}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
});

// Main Connection component
const Connection = forwardRef<ConnectionHandle, ConnectionProps>(({ onDataChange }, ref) => {
    const [selectedTab, setSelectedTab] = useState(0);

    // Form setup
    const methods = useForm<ConnectionData>({
        defaultValues: {
            connectionType: 'SFTP',
            sftp: {
                host: 'sftp.yourplatform.com',
                port: 22,
                username: 'ftpuser',
                type: 'SFTP',
                ftpAuthentication: {
                    type: 'SSH Key',
                    sshKey: '',
                    password: '',
                    passphrase: ''
                }
            },
            // Commented out but preserved for future reference
            /* 
            ftps: {
                host: 'ftps.yourplatform.com',
                port: 21,
                username: 'ftpuser',
                password: '',
                encryption: 'Implicit'
            },
            */
            s3: {
                region: 'us-east-1',
                bucketName: 'shareholder-data',
                folderPath: 'incoming/data/',
                amazonS3Authentication: {
                    authenticationMethod: 'IAM Role',
                    ARN: 'arn:aws:iam::123456789012:role/S3Access',
                    accessKey: '',
                    secretKey: ''
                }
            }
        },
        mode: 'onChange'
    });

    const { control, handleSubmit, watch, formState: { errors }, trigger, getValues, setValue } = methods;

    // Watch the selected connection type
    const connectionType = watch('connectionType');

    // Update connection type when tab changes
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        // Adjust index to skip FTPS (index 1)
        const connectionTypes: ConnectionType[] = ['SFTP', 'S3'];
        setValue('connectionType', connectionTypes[newValue]);
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        validate: async () => {
            // Validate only the active connection type fields
            let fieldsToValidate: string[] = [];

            switch (connectionType) {
                case 'SFTP':
                    fieldsToValidate = ['sftp.host', 'sftp.port', 'sftp.type', 'sftp.username', 'sftp.ftpAuthentication.type'];
                    const authType = watch('sftp.ftpAuthentication.type');
                    if (authType === 'SSH Key') {
                        fieldsToValidate.push('sftp.ftpAuthentication.sshKey');
                    } else {
                        fieldsToValidate.push('sftp.ftpAuthentication.password');
                    }
                    break;
                /* 
                case 'FTPS':
                    fieldsToValidate = ['ftps.host', 'ftps.port', 'ftps.username', 'ftps.password', 'ftps.encryption'];
                    break;
                */
                case 'S3':
                    fieldsToValidate = ['s3.region', 's3.bucketName', 's3.amazonS3Authentication.authenticationMethod'];
                    const s3AuthMethod = watch('s3.amazonS3Authentication.authenticationMethod');
                    if (s3AuthMethod === 'IAM Role') {
                        fieldsToValidate.push('s3.amazonS3Authentication.ARN');
                    } else {
                        fieldsToValidate.push('s3.amazonS3Authentication.accessKey', 's3.amazonS3Authentication.secretKey');
                    }
                    break;
            }

            return trigger(fieldsToValidate as any);
        },
        getData: () => {
            return getValues();
        }
    }));

    // Handle form submission
    const onSubmit = (data: any) => {
        if (onDataChange) {
            onDataChange(data as ConnectionData);
        }
    };

    // Register to form changes using subscription
    useEffect(() => {
        const subscription = methods.watch((value, { name, type }) => {
            // Only notify parent when we have a complete form
            if (type === 'change') {
                handleSubmit(onSubmit as any)();
            }
        });

        return () => subscription.unsubscribe();
    }, [handleSubmit, methods, onDataChange]);

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure Connection Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure connection details for secure file transfers
            </Typography>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="SFTP" />
                {/* <Tab label="FTPS" /> */}
                <Tab label="Amazon S3" />
            </Tabs>

            {selectedTab === 0 && <SFTPSettings control={control} errors={errors} watch={watch} />}
            {/* {selectedTab === 1 && <FTPSSettings control={control} errors={errors} />} */}
            {selectedTab === 1 && <AmazonS3Settings control={control} errors={errors} watch={watch} />}
        </Box>
    );
});

export default Connection; 