import { Box, Typography, Tabs, Tab, TextareaAutosize, Button, TextField, Grid, Alert, CircularProgress, Paper, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import { useState, forwardRef, useImperativeHandle, ChangeEvent, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Basic GraphQL schema validator function
const validateGraphQLSchema = (schema: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check if schema is empty
    if (!schema.trim()) {
        return { valid: false, errors: ['Schema cannot be empty'] };
    }

    // Remove comments to correctly parse the schema
    const schemaWithoutComments = schema.replace(/#.*$/gm, '');

    // Very basic pattern matching for schema validity
    const typePattern = /type\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;
    const queryPattern = /type\s+Query\s*\{/gi; // Case insensitive

    // Check if there are any type definitions
    if (!typePattern.test(schemaWithoutComments)) {
        errors.push('No valid type definitions found');
    }

    // Reset regex lastIndex
    typePattern.lastIndex = 0;

    // Check for Query type
    if (!queryPattern.test(schemaWithoutComments)) {
        errors.push('No Query type defined');
    }

    // Check for balanced braces
    let braceCount = 0;
    for (const char of schemaWithoutComments) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount < 0) {
            errors.push('Unbalanced braces in schema');
            break;
        }
    }
    if (braceCount !== 0) {
        errors.push('Unbalanced braces in schema');
    }

    return { valid: errors.length === 0, errors };
};

// Parse schema to extract types and fields
const parseSchema = (schema: string): { types: Array<{ name: string, fields: string[] }> } => {
    const types: Array<{ name: string, fields: string[] }> = [];

    // Remove comments to correctly parse the schema
    const schemaWithoutComments = schema.replace(/#.*$/gm, '');

    // Match both types and input types
    const typeRegex = /(type|input)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{([^}]*)\}/g;

    let match;
    while ((match = typeRegex.exec(schemaWithoutComments)) !== null) {
        const kind = match[1]; // 'type' or 'input'
        const name = match[2];
        const fieldsStr = match[3];

        const fields = fieldsStr
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        types.push({ name: `${kind} ${name}`, fields });
    }

    return { types };
};

interface SchemaFormValues {
    manualSchema: string;
    introspectionEndpoint: string;
    introspectionHeaders: string;
}

export interface SchemaDesignRef {
    validate: () => Promise<boolean>;
    isValid: () => boolean;
}

interface SchemaDesignProps {
    formData: {
        schema: string;
        schemaSource: string;
    };
    updateFormData: (data: {
        schema: string;
        schemaSource: string;
    }) => void;
}

interface ParsedSchema {
    types: Array<{ name: string, fields: string[] }>;
}

interface ManualEntryProps {
    control: Control<SchemaFormValues>;
    errors: FieldErrors<SchemaFormValues>;
    setValue: UseFormSetValue<SchemaFormValues>;
    schema: string;
    setSchema: (schema: string) => void;
    setParsedSchema: (schema: ParsedSchema | null) => void;
    setSchemaValid: (valid: boolean) => void;
    setSchemaErrors: (errors: string[]) => void;
}

const ManualEntry = ({
    control,
    errors,
    setValue,
    schema,
    setSchema,
    setParsedSchema,
    setSchemaValid,
    setSchemaErrors
}: ManualEntryProps) => {
    // Local state to track validation in the component
    const [localValidation, setLocalValidation] = useState<{
        valid: boolean;
        errors: string[];
    }>({ valid: false, errors: [] });

    const handleSchemaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const schemaValue = e.target.value;
        setSchema(schemaValue);
        const validationResult = validateGraphQLSchema(schemaValue);
        setSchemaValid(validationResult.valid);
        setSchemaErrors(validationResult.errors);
        setLocalValidation(validationResult);

        if (validationResult.valid) {
            const parsed = parseSchema(schemaValue);
            setParsedSchema(parsed);
        }
    };

    return (
        <Box>
            <Controller
                name="manualSchema"
                control={control}
                rules={{
                    validate: (value) => {
                        const validation = validateGraphQLSchema(value);
                        return validation.valid || validation.errors[0];
                    }
                }}
                render={({ field }) => (
                    <Box sx={{ position: 'relative' }}>
                        <TextareaAutosize
                            {...field}
                            minRows={10}
                            placeholder={`# Define a User type
type User {
  id: ID!
  name: String!
  email: String!
}

# Define an input type
input CreateUserInput {
  name: String!
  email: String!
}

# Root Query type 
type Query {
  users: [User!]!
  user(id: ID!): User
}`}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                borderColor: errors.manualSchema ? '#f44336' : '#E5E7EB',
                                backgroundColor: '#F9FAFB'
                            }}
                            onChange={(e) => {
                                field.onChange(e);
                                handleSchemaChange(e);
                            }}
                        />
                        {errors.manualSchema && (
                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                {errors.manualSchema.message}
                            </Typography>
                        )}
                    </Box>
                )}
            />

            {schema && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Alert
                        severity={localValidation.valid ? "success" : "error"}
                        icon={localValidation.valid ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                    >
                        {localValidation.valid
                            ? "Schema is valid"
                            : `Schema validation errors: ${localValidation.errors.join(', ')}`
                        }
                    </Alert>
                </Box>
            )}
        </Box>
    );
};

interface ImportSchemaProps {
    setValue: UseFormSetValue<SchemaFormValues>;
    setSchema: (schema: string) => void;
    setParsedSchema: (schema: ParsedSchema | null) => void;
    setSchemaValid: (valid: boolean) => void;
    setSchemaErrors: (errors: string[]) => void;
}

const ImportSchema = ({
    setValue,
    setSchema,
    setParsedSchema,
    setSchemaValid,
    setSchemaErrors
}: ImportSchemaProps) => {
    const [fileError, setFileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/graphql': ['.graphql', '.gql'],
            'application/json': ['.json'],
            'text/plain': ['.txt']
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                setFileError('Please upload a valid GraphQL schema file');
                return;
            }

            setIsLoading(true);
            setFileError(null);

            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const content = event.target?.result as string;
                    let schemaContent = content;

                    // If JSON file, try to extract SDL
                    if (file.name.endsWith('.json')) {
                        try {
                            const json = JSON.parse(content);
                            // Assuming Apollo format with data.__schema
                            if (json.data && json.data.__schema) {
                                schemaContent = "// Schema imported from Apollo JSON format\n";
                                // This is a simplified approach - in a real app, you'd convert the introspection 
                                // result to SDL with a proper library
                                schemaContent += "type Query {\n  # Imported from Apollo JSON format\n  _placeholder: String\n}";
                            }
                        } catch (e) {
                            setFileError('Invalid JSON format');
                            setIsLoading(false);
                            return;
                        }
                    }

                    // Validate the schema
                    const validationResult = validateGraphQLSchema(schemaContent);
                    setSchemaValid(validationResult.valid);
                    setSchemaErrors(validationResult.errors);

                    if (validationResult.valid) {
                        setValue('manualSchema', schemaContent);
                        setSchema(schemaContent);
                        const parsed = parseSchema(schemaContent);
                        setParsedSchema(parsed);
                    } else {
                        setFileError(`Invalid GraphQL schema: ${validationResult.errors.join(', ')}`);
                    }

                    setIsLoading(false);
                } catch (error) {
                    setFileError('Error reading file');
                    setIsLoading(false);
                }
            };

            reader.onerror = () => {
                setFileError('Error reading file');
                setIsLoading(false);
            };

            reader.readAsText(file);
        },
    });

    return (
        <Box>
            <Box
                {...getRootProps()}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: fileError ? '2px dashed #f44336' : '2px dashed #E5E7EB',
                    borderRadius: 1,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: '#F9FAFB',
                    position: 'relative'
                }}
            >
                <input {...getInputProps()} />
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <>
                        <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                            Drag and drop your GraphQL schema file here
                        </Typography>
                        <Button variant="contained" color="primary">Browse Files</Button>
                        <Typography variant="caption" color="text.primary" sx={{ mt: 2 }}>
                            Supported formats: .graphql, .gql, JSON (Apollo), SDL Text
                        </Typography>
                    </>
                )}
            </Box>

            {fileError && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {fileError}
                </Typography>
            )}
        </Box>
    );
};

interface UseIntrospectionProps {
    control: Control<SchemaFormValues>;
    errors: FieldErrors<SchemaFormValues>;
    setValue: UseFormSetValue<SchemaFormValues>;
    setSchema: (schema: string) => void;
    setParsedSchema: (schema: ParsedSchema | null) => void;
    setSchemaValid: (valid: boolean) => void;
    setSchemaErrors: (errors: string[]) => void;
}

const UseIntrospection = ({
    control,
    errors,
    setValue,
    setSchema,
    setParsedSchema,
    setSchemaValid,
    setSchemaErrors
}: UseIntrospectionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const handleFetchSchema = async () => {
        setIsLoading(true);
        setFetchError(null);

        try {
            // Get values from form
            const endpoint = control._formValues.introspectionEndpoint;
            let headers = {};

            try {
                const headersText = control._formValues.introspectionHeaders;
                if (headersText) {
                    headers = JSON.parse(headersText);
                }
            } catch (e) {
                setFetchError('Invalid JSON format in headers');
                setIsLoading(false);
                return;
            }

            // Construct the introspection query
            const introspectionQuery = {
                query: `
          query IntrospectionQuery {
            __schema {
              queryType { name }
              types {
                name
                kind
                fields {
                  name
                  type {
                    name
                    kind
                  }
                }
              }
            }
          }
        `
            };

            // Simulate fetch (in a real app, this would be a real fetch)
            // For this example, we'll just simulate success after a delay
            setTimeout(() => {
                // Simulated successful response (for demo purposes)
                const mockSchema = `
type Shareholder {
  id: ID!
  name: String!
  accountNumber: String!
}

type Query {
  shareholders: [Shareholder]!
}`;

                const validationResult = validateGraphQLSchema(mockSchema);
                setSchemaValid(validationResult.valid);
                setSchemaErrors(validationResult.errors);

                if (validationResult.valid) {
                    setValue('manualSchema', mockSchema);
                    setSchema(mockSchema);
                    const parsed = parseSchema(mockSchema);
                    setParsedSchema(parsed);
                }

                setIsLoading(false);
            }, 1500);

        } catch (error: any) {
            setFetchError('Error fetching schema: ' + (error.message || 'Unknown error'));
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Introspection Endpoint
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter the GraphQL endpoint URL to fetch schema via introspection
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="introspectionEndpoint"
                        control={control}
                        rules={{
                            required: 'Endpoint is required',
                            pattern: {
                                value: /^https?:\/\/.+/i,
                                message: 'Enter a valid URL'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="GraphQL Endpoint"
                                defaultValue="https://api.example.com/graphql"
                                error={!!errors.introspectionEndpoint}
                                helperText={errors.introspectionEndpoint?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Authentication for Introspection
                        <Tooltip
                            title="Add authentication headers in JSON format"
                            arrow
                            placement="right"
                        >
                            <IconButton size="small">
                                <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Typography>

                    <Controller
                        name="introspectionHeaders"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (!value) return true;
                                try {
                                    JSON.parse(value);
                                    return true;
                                } catch (e) {
                                    return 'Invalid JSON format';
                                }
                            }
                        }}
                        render={({ field }) => (
                            <TextareaAutosize
                                {...field}
                                minRows={3}
                                placeholder='{"Authorization": "Bearer your-token-here"}'
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    borderColor: errors.introspectionHeaders ? '#f44336' : '#E5E7EB',
                                    backgroundColor: '#F9FAFB'
                                }}
                            />
                        )}
                    />

                    {errors.introspectionHeaders && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {errors.introspectionHeaders.message}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFetchSchema}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {isLoading ? 'Fetching Schema...' : 'Fetch Schema'}
                    </Button>
                </Grid>
            </Grid>

            {fetchError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {fetchError}
                </Alert>
            )}

            <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
                Note: The endpoint must have introspection enabled to fetch the schema
            </Typography>
        </Box>
    );
};

interface SchemaViewerProps {
    parsedSchema: ParsedSchema | null;
}

// Schema viewer component
const SchemaViewer = ({ parsedSchema }: SchemaViewerProps) => {
    if (!parsedSchema || !parsedSchema.types || parsedSchema.types.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Schema Overview
            </Typography>

            <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 2 }}>
                {parsedSchema.types.map((type, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {type.name}
                        </Typography>
                        <List dense>
                            {type.fields.map((field, fieldIndex) => (
                                <ListItem key={fieldIndex} sx={{ py: 0.5 }}>
                                    <ListItemText primary={field} primaryTypographyProps={{ fontFamily: 'monospace' }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

const SchemaDesign = forwardRef<SchemaDesignRef, SchemaDesignProps>(({ formData, updateFormData }, ref) => {
    // Store previous values to detect changes
    const prevFormDataRef = useRef(formData);
    const isInitialMount = useRef(true);
    const skipParentUpdate = useRef(false);

    // Main component state
    const [activeTab, setActiveTab] = useState(() => {
        return formData.schemaSource === 'manual' ? 0 :
            formData.schemaSource === 'import' ? 1 : 2;
    });

    const [schema, setSchema] = useState(formData.schema);
    const [parsedSchema, setParsedSchema] = useState<ParsedSchema | null>(null);
    const [schemaValid, setSchemaValid] = useState(false);
    const [schemaErrors, setSchemaErrors] = useState<string[]>([]);

    const { control, formState: { errors }, setValue, trigger } = useForm<SchemaFormValues>({
        defaultValues: {
            manualSchema: formData.schema,
            introspectionEndpoint: '',
            introspectionHeaders: ''
        },
        mode: 'onChange'
    });

    // Handle external formData changes (from parent)
    useEffect(() => {
        // Skip on initial mount since we already set state from props
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const sourceIndex = formData.schemaSource === 'manual' ? 0 :
            formData.schemaSource === 'import' ? 1 : 2;

        // Only update if props actually changed
        const schemaChanged = formData.schema !== prevFormDataRef.current.schema;
        const sourceChanged = formData.schemaSource !== prevFormDataRef.current.schemaSource;

        if (schemaChanged || sourceChanged) {
            // Mark that we're updating from parent props
            skipParentUpdate.current = true;

            if (schemaChanged) {
                setSchema(formData.schema);
                setValue('manualSchema', formData.schema);
            }

            if (sourceChanged) {
                setActiveTab(sourceIndex);
            }

            // Update the ref with current props for next comparison
            prevFormDataRef.current = formData;
        }
    }, [formData, setValue]);

    // Notify parent of internal changes
    useEffect(() => {
        // Skip the first render and when updating from parent
        if (isInitialMount.current || skipParentUpdate.current) {
            skipParentUpdate.current = false;
            return;
        }

        const schemaSource = activeTab === 0 ? 'manual' :
            activeTab === 1 ? 'import' : 'introspection';

        // Only update if there's been a real change
        const schemaChanged = schema !== prevFormDataRef.current.schema;
        const sourceChanged = schemaSource !== prevFormDataRef.current.schemaSource;

        if (schemaChanged || sourceChanged) {
            const newFormData = {
                schema,
                schemaSource
            };

            updateFormData(newFormData);

            // Update the ref with new values
            prevFormDataRef.current = newFormData;
        }
    }, [schema, activeTab, updateFormData]);

    // Expose validation methods to parent
    useImperativeHandle(ref, () => ({
        validate: async () => {
            // Only validate if we have a schema
            if (!schema.trim()) {
                return false;
            }

            const validationResult = validateGraphQLSchema(schema);
            return validationResult.valid;
        },
        isValid: () => {
            // Consider valid if we have a schema and it passes validation
            return !!schema.trim() && schemaValid;
        }
    }));

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSchemaUpdate = (newSchema: string) => {
        setSchema(newSchema);
        setValue('manualSchema', newSchema);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Design GraphQL Schema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Define or import your GraphQL schema
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="schema design tabs">
                    <Tab label="Manual Entry" />
                    <Tab label="Import Schema" />
                    <Tab label="Use Introspection" />
                </Tabs>
            </Box>
            <Box sx={{ mb: 3 }}>
                {activeTab === 0 && (
                    <ManualEntry
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        schema={schema}
                        setSchema={handleSchemaUpdate}
                        setParsedSchema={setParsedSchema}
                        setSchemaValid={setSchemaValid}
                        setSchemaErrors={setSchemaErrors}
                    />
                )}
                {activeTab === 1 && (
                    <ImportSchema
                        setValue={setValue}
                        setSchema={handleSchemaUpdate}
                        setParsedSchema={setParsedSchema}
                        setSchemaValid={setSchemaValid}
                        setSchemaErrors={setSchemaErrors}
                    />
                )}
                {activeTab === 2 && (
                    <UseIntrospection
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        setSchema={handleSchemaUpdate}
                        setParsedSchema={setParsedSchema}
                        setSchemaValid={setSchemaValid}
                        setSchemaErrors={setSchemaErrors}
                    />
                )}
            </Box>
            {parsedSchema && schemaValid && (
                <Box sx={{ mt: 4 }}>
                    <SchemaViewer parsedSchema={parsedSchema} />
                </Box>
            )}
        </Box>
    );
});

export default SchemaDesign; 