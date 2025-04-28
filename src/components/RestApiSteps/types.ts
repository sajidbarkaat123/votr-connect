import * as yup from 'yup';

// Basic info schema
export const basicInfoSchema = yup.object().shape({
    integrationName: yup.string().required('Integration name is required'),
    dataFormat: yup.string().required('Data format is required'),
    updateFrequency: yup.string().required('Update frequency is required'),
    baseUrl: yup.string().url('Please enter a valid URL').required('Base URL is required'),
    restMethod: yup.string().required('REST method is required'),
    environment: yup.string().required('Environment is required'),
    isActive: yup.boolean().default(false),
    queryParams: yup.object().shape({
        limit: yup.object().shape({
            enabled: yup.boolean(),
            value: yup.number().when('enabled', {
                is: true,
                then: schema => schema.min(1, 'Limit must be at least 1').required('Limit value is required')
            })
        }),
        offset: yup.object().shape({
            enabled: yup.boolean(),
            value: yup.number().when('enabled', {
                is: true,
                then: schema => schema.min(0, 'Offset must be at least 0').required('Offset value is required')
            })
        })
    })
});

export type BasicInfoFormData = yup.InferType<typeof basicInfoSchema>;

// Export interface for BasicInfo component ref
export interface BasicInfoRef {
    isValid: () => boolean;
    getData: () => BasicInfoFormData | null;
}

// Auth form schema
export const authSchema = yup.object().shape({
    authMethod: yup.string().required('Authentication method is required'),

    // OAuth 2.0 fields
    tokenUrl: yup.string().when('authMethod', {
        is: 'oauth2',
        then: (schema) => schema.url('Please enter a valid URL').required('Token URL is required')
    }),
    grantType: yup.string().when('authMethod', {
        is: 'oauth2',
        then: (schema) => schema.required('Grant type is required')
    }),
    scopes: yup.string(),

    // Client Credentials fields
    clientId: yup.string().when(['authMethod'], {
        is: (authMethod: string) => authMethod === 'oauth2',
        then: (schema) => schema.required('Client ID is required')
    }),
    clientSecret: yup.string().when(['authMethod'], {
        is: (authMethod: string) => authMethod === 'oauth2',
        then: (schema) => schema.required('Client Secret is required')
    }),

    // Authorization Code fields
    authUrl: yup.string().when(['authMethod', 'grantType'], {
        is: (authMethod: string, grantType: string) => authMethod === 'oauth2' && grantType === 'authorization_code',
        then: (schema) => schema.url('Please enter a valid URL').required('Authorization URL is required')
    }),

    // Redirect URI - required for authorization_code, optional but validated if provided for client_credentials
    redirectUri: yup.string().when(['authMethod', 'grantType'], {
        is: (authMethod: string, grantType: string) => authMethod === 'oauth2' && grantType === 'authorization_code',
        then: (schema) => schema.url('Please enter a valid URL').required('Redirect URI is required')
    }).when(['authMethod', 'grantType'], {
        is: (authMethod: string, grantType: string) => authMethod === 'oauth2' && grantType === 'client_credentials',
        then: (schema) => schema.url('Please enter a valid URL').notRequired()
    }),

    // API Key fields
    headerName: yup.string().when('authMethod', {
        is: 'apikey',
        then: (schema) => schema.required('Header name is required')
    }),
    apiKeyValue: yup.string().when('authMethod', {
        is: 'apikey',
        then: (schema) => schema.required('API key value is required')
    })
});

export type AuthFormData = yup.InferType<typeof authSchema>;

// Export interface for Authentication component ref
export interface AuthenticationRef {
    isValid: () => boolean;
    getData: () => AuthFormData | null;
}

// Schema form schema
export const schemaSchema = yup.object().shape({
    resourceName: yup.string().required('Resource name is required'),
    endpointPath: yup.string().required('Endpoint path is required'),
    fields: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Field name is required'),
            type: yup.string().required('Field type is required'),
            required: yup.boolean(),
            description: yup.string()
        })
    ).min(1, 'At least one field is required')
});

export type SchemaFormData = yup.InferType<typeof schemaSchema>;

// Export interface for DataSchema component ref
export interface DataSchemaRef {
    isValid: () => boolean;
    getData: () => SchemaFormData | null;
}

// Review component props
export interface ReviewProps {
    basicInfo: BasicInfoFormData | null;
    auth: AuthFormData | null;
    dataSchema: SchemaFormData | null;
} 