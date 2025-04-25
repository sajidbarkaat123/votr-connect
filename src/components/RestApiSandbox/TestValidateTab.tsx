import { useState } from 'react';
import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cardContainerStyles, headingStyles, labelStyles, primaryButtonStyles, subheadingStyles, textFieldStyles } from './utils';

interface TestValidateTabProps {
    baseUrl: string;
}

interface RequestParameter {
    name: string;
    value: string;
}

// Define validation schema
const testSchema = yup.object({
    endpoint: yup.string().required('Endpoint is required'),
    method: yup.string().required('Method is required'),
    parameters: yup.array().of(
        yup.object({
            name: yup.string().required('Parameter name is required'),
            value: yup.string()
        })
    )
});

type FormValues = yup.InferType<typeof testSchema>;

const TestValidateTab = ({ baseUrl }: TestValidateTabProps) => {
    const [responseStatus, setResponseStatus] = useState('Status: 200 OK');
    const [responseTime, setResponseTime] = useState('Time: 245ms');

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(testSchema),
        defaultValues: {
            endpoint: '/shareholders',
            method: 'GET',
            parameters: [
                { name: 'limit', value: '100' },
                { name: 'startDate', value: '2025-01-01' }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'parameters'
    });

    const onSubmit = (data: FormValues) => {
        console.log('Executing API request...', data);

        // Simulate API call - in a real app, this would make an actual request
        // For now, just update the response status and time
        setResponseStatus('Status: 200 OK');
        setResponseTime(`Time: ${Math.floor(Math.random() * 300) + 100}ms`);
    };

    const handleAddParameter = () => {
        append({ name: '', value: '' });
    };

    return (
        <Box sx={cardContainerStyles}>
            <Typography variant="h6" sx={headingStyles}>
                Test API Endpoint
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, mb: 4 }}>
                    <Box>
                        <Typography sx={labelStyles}>
                            Endpoint
                        </Typography>
                        <Controller
                            name="endpoint"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    error={!!errors.endpoint}
                                    helperText={errors.endpoint?.message}
                                    sx={textFieldStyles}
                                />
                            )}
                        />
                        <Typography
                            sx={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                mt: 0.5
                            }}
                        >
                            Base URL: {baseUrl}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyles}>
                            Method
                        </Typography>
                        <Controller
                            name="method"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    size="small"
                                    error={!!errors.method}
                                    helperText={errors.method?.message}
                                    sx={{
                                        minWidth: 120,
                                        ...textFieldStyles
                                    }}
                                >
                                    <MenuItem value="GET">GET</MenuItem>
                                    <MenuItem value="POST">POST</MenuItem>
                                    <MenuItem value="PUT">PUT</MenuItem>
                                    <MenuItem value="DELETE">DELETE</MenuItem>
                                </TextField>
                            )}
                        />
                    </Box>
                </Box>

                <Typography variant="h6" sx={subheadingStyles}>
                    Request Parameters
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#374151', fontWeight: 500, pl: 0 }}>Name</TableCell>
                                <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Value</TableCell>
                                <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell sx={{ pl: 0 }}>
                                        <Controller
                                            name={`parameters.${index}.name` as const}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    error={!!errors.parameters?.[index]?.name}
                                                    helperText={errors.parameters?.[index]?.name?.message}
                                                    sx={textFieldStyles}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name={`parameters.${index}.value` as const}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    error={!!errors.parameters?.[index]?.value}
                                                    helperText={errors.parameters?.[index]?.value?.message}
                                                    sx={textFieldStyles}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => remove(index)}
                                            sx={{
                                                color: '#EF4444',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    bgcolor: 'transparent',
                                                    opacity: 0.8
                                                }
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button
                        onClick={handleAddParameter}
                        sx={{
                            mt: 2,
                            color: '#3B82F6',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'transparent',
                                opacity: 0.8
                            }
                        }}
                    >
                        + Add Parameter
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ ...primaryButtonStyles, px: 4 }}
                    >
                        Execute
                    </Button>
                </Box>
            </form>

            <Typography variant="h6" sx={subheadingStyles}>
                Response
            </Typography>

            <Box sx={{
                bgcolor: '#F9FAFB',
                p: 2,
                borderRadius: '6px',
                display: 'flex',
                gap: 3
            }}>
                <Typography sx={{ color: '#059669' }}>{responseStatus}</Typography>
                <Typography sx={{ color: '#374151' }}>{responseTime}</Typography>
            </Box>
        </Box>
    );
};

export default TestValidateTab; 