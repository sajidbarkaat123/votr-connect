import * as yup from 'yup';

// Define common form validation schema
export const requestFormSchema = yup.object().shape({
    name: yup
        .string()
        .required('Request name is required')
        .min(5, 'Request name must be at least 5 characters'),
    type: yup
        .string()
        .required('Request type is required'),
    environment: yup
        .string()
        .required('Environment is required'),
    description: yup
        .string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    changes: yup
        .string()
        .required('Changes are required')
        .min(5, 'Changes must be at least 5 characters'),
    dependencies: yup
        .string()
        .default('')
});

// Common types for the form data
export interface RequestFormData {
    name: string;
    type: string;
    environment: string;
    description: string;
    changes: string;
    dependencies: string;
}

// Common constants for form fields
export const REQUEST_TYPES = [
    { value: 'API Release', label: 'API Release' },
    { value: 'Service Update', label: 'Service Update' },
    { value: 'Configuration Change', label: 'Configuration Change' },
    { value: 'Database Migration', label: 'Database Migration' },
];

export const ENVIRONMENTS = [
    { value: 'Production', label: 'Production' },
    { value: 'Staging', label: 'Staging' },
    { value: 'QA', label: 'QA' },
]; 