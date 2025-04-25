import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cardContainerStyles, headingStyles, labelStyles, primaryButtonStyles, textFieldStyles } from "./utils";

interface ConfigurationTabProps {
    baseUrl: string;
    setBaseUrl: (url: string) => void;
    authType: string;
    setAuthType: (type: string) => void;
    grantType: string;
    setGrantType: (type: string) => void;
    clientId: string;
    setClientId: (id: string) => void;
    clientSecret: string;
    setClientSecret: (secret: string) => void;
    tokenUrl: string;
    setTokenUrl: (url: string) => void;
}

// Define validation schema
const configSchema = yup.object({
    baseUrl: yup.string().url('Please enter a valid URL').required('Base URL is required'),
    authType: yup.string().required('Authentication type is required'),
    grantType: yup.string().required('Grant type is required'),
    clientId: yup.string().required('Client ID is required'),
    clientSecret: yup.string().when('authType', {
        is: (val: string) => val === 'OAuth 2.0',
        then: (schema) => schema.required('Client Secret is required'),
        otherwise: (schema) => schema
    }),
    tokenUrl: yup.string().when('authType', {
        is: (val: string) => val === 'OAuth 2.0',
        then: (schema) => schema.url('Please enter a valid URL').required('Token URL is required'),
        otherwise: (schema) => schema
    })
});

type FormValues = yup.InferType<typeof configSchema>;

const ConfigurationTab = ({
    baseUrl,
    setBaseUrl,
    authType,
    setAuthType,
    grantType,
    setGrantType,
    clientId,
    setClientId,
    clientSecret,
    setClientSecret,
    tokenUrl,
    setTokenUrl
}: ConfigurationTabProps) => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(configSchema),
        defaultValues: {
            baseUrl,
            authType,
            grantType,
            clientId,
            clientSecret,
            tokenUrl
        }
    });

    const onSubmit = (data: FormValues) => {
        // Update parent state with form values
        setBaseUrl(data.baseUrl || '');
        setAuthType(data.authType || '');
        setGrantType(data.grantType || '');
        setClientId(data.clientId || '');
        setClientSecret(data.clientSecret || '');
        setTokenUrl(data.tokenUrl || '');

        console.log('Saving configuration...', data);
    };

    return (
        <Box sx={cardContainerStyles}>
            <Typography variant="h6" sx={headingStyles}>
                Endpoint Configuration
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                    <Typography sx={labelStyles}>
                        Base URL
                    </Typography>
                    <Controller
                        name="baseUrl"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                size="small"
                                error={!!errors.baseUrl}
                                helperText={errors.baseUrl?.message}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Box>

                <Typography
                    variant="h6"
                    sx={headingStyles}
                >
                    Authentication
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                    <Box>
                        <Typography sx={labelStyles}>
                            Authentication Type
                        </Typography>
                        <Controller
                            name="authType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    size="small"
                                    error={!!errors.authType}
                                    helperText={errors.authType?.message}
                                    sx={textFieldStyles}
                                >
                                    <MenuItem value="OAuth 2.0">OAuth 2.0</MenuItem>
                                    <MenuItem value="API Key">API Key</MenuItem>
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box>
                        <Typography sx={labelStyles}>
                            Grant Type
                        </Typography>
                        <Controller
                            name="grantType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    size="small"
                                    error={!!errors.grantType}
                                    helperText={errors.grantType?.message}
                                    sx={textFieldStyles}
                                >
                                    <MenuItem value="Client Credentials">Client Credentials</MenuItem>
                                    <MenuItem value="Authorization Code">Authorization Code</MenuItem>
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box>
                        <Typography sx={labelStyles}>
                            Client ID
                        </Typography>
                        <Controller
                            name="clientId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    error={!!errors.clientId}
                                    helperText={errors.clientId?.message}
                                    sx={textFieldStyles}
                                />
                            )}
                        />
                    </Box>

                    <Box>
                        <Typography sx={labelStyles}>
                            Client Secret
                        </Typography>
                        <Controller
                            name="clientSecret"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="password"
                                    fullWidth
                                    size="small"
                                    error={!!errors.clientSecret}
                                    helperText={errors.clientSecret?.message}
                                    sx={textFieldStyles}
                                />
                            )}
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={labelStyles}>
                        Token URL
                    </Typography>
                    <Controller
                        name="tokenUrl"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                size="small"
                                error={!!errors.tokenUrl}
                                helperText={errors.tokenUrl?.message}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ ...primaryButtonStyles, px: 4 }}
                    >
                        Save
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ConfigurationTab; 