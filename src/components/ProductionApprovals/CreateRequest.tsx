import {
    Box,
    Typography,
    Paper,
    Breadcrumbs,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router';
import RequestForm from './RequestForm';
import { RequestFormData } from './FormSchema';

const CreateRequest = () => {
    const navigate = useNavigate();

    const handleSubmit = (data: RequestFormData) => {
        console.log('New request data:', data);
        // In a real app, you would make an API call here to create the request
        // Then navigate back to the production approvals page
        navigate('/production-approvals');
    };

    return (
        <Box className="p-6">
            {/* Breadcrumbs navigation */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    color="inherit"
                    href="/production-approvals"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                    Production Approvals
                </Link>
            </Breadcrumbs>

            {/* Header */}
            <Typography
                variant="h4"
                sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1
                }}
            >
                Create New Request
            </Typography>
            <Typography
                sx={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    mb: 4
                }}
            >
                Complete the form below to submit a new production deployment request.
            </Typography>

            {/* Main content */}
            <Paper sx={{
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                p: 4,
                mb: 4
            }}>
                <RequestForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/production-approvals')}
                />
            </Paper>
        </Box>
    );
};

export default CreateRequest; 