import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    RequestFormData,
    requestFormSchema,
    REQUEST_TYPES,
    ENVIRONMENTS
} from './FormSchema';

interface RequestFormProps {
    onSubmit: (data: RequestFormData) => void;
    onCancel?: () => void;
    initialValues?: Partial<RequestFormData>;
    submitLabel?: string;
    showCancelButton?: boolean;
    isModal?: boolean;
}

const defaultValues: RequestFormData = {
    name: '',
    type: '',
    environment: 'Production',
    description: '',
    changes: '',
    dependencies: ''
};

const RequestForm = ({
    onSubmit,
    onCancel,
    initialValues,
    submitLabel = 'Submit Request',
    showCancelButton = true,
    isModal = false
}: RequestFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(requestFormSchema),
        defaultValues: { ...defaultValues, ...initialValues }
    });

    const inputStyles = {
        '& .MuiFilledInput-root': {
            backgroundColor: '#F9FAFB',
            '&:hover': {
                backgroundColor: '#F3F4F6',
            },
            '&.Mui-focused': {
                backgroundColor: '#F3F4F6',
            }
        }
    };

    const labelStyles = {
        shrink: true,
        sx: { color: '#4B5563', fontWeight: 500 }
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data as RequestFormData))}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: isModal ? 'auto' : '800px' }}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            fullWidth
                            label="Request Name"
                            placeholder="e.g., Shareholder API Production Release"
                            variant="filled"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            InputLabelProps={labelStyles}
                            sx={inputStyles}
                            {...field}
                        />
                    )}
                />

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <FormControl required variant="filled" fullWidth error={!!errors.type}>
                                <InputLabel shrink sx={{ color: '#4B5563', fontWeight: 500 }}>
                                    Request Type
                                </InputLabel>
                                <Select
                                    displayEmpty
                                    sx={{
                                        backgroundColor: '#F9FAFB',
                                        '&:hover': {
                                            backgroundColor: '#F3F4F6',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#F3F4F6',
                                        }
                                    }}
                                    {...field}
                                >
                                    <MenuItem value="" disabled><em>Select request type</em></MenuItem>
                                    {REQUEST_TYPES.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.type?.message || "Select the type of change being requested"}</FormHelperText>
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="environment"
                        control={control}
                        render={({ field }) => (
                            <FormControl required variant="filled" fullWidth error={!!errors.environment}>
                                <InputLabel shrink sx={{ color: '#4B5563', fontWeight: 500 }}>
                                    Environment
                                </InputLabel>
                                <Select
                                    displayEmpty
                                    sx={{
                                        backgroundColor: '#F9FAFB',
                                        '&:hover': {
                                            backgroundColor: '#F3F4F6',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#F3F4F6',
                                        }
                                    }}
                                    {...field}
                                >
                                    {ENVIRONMENTS.map(env => (
                                        <MenuItem key={env.value} value={env.value}>
                                            {env.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.environment?.message || "Select the target environment"}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            placeholder="Provide a detailed description of the changes..."
                            variant="filled"
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            InputLabelProps={labelStyles}
                            sx={inputStyles}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="changes"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Changes"
                            placeholder="List the specific changes being made..."
                            helperText={errors.changes?.message || "List one change per line"}
                            variant="filled"
                            error={!!errors.changes}
                            InputLabelProps={labelStyles}
                            sx={inputStyles}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="dependencies"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Dependencies"
                            placeholder="List any dependencies..."
                            helperText={errors.dependencies?.message || "Optional: List any service dependencies"}
                            variant="filled"
                            error={!!errors.dependencies}
                            InputLabelProps={labelStyles}
                            sx={inputStyles}
                            {...field}
                        />
                    )}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {showCancelButton && onCancel && (
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{
                                color: '#374151',
                                borderColor: '#D1D5DB',
                                '&:hover': {
                                    borderColor: '#9CA3AF',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: '#3B82F6',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#2563EB',
                            }
                        }}
                    >
                        {submitLabel}
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default RequestForm; 