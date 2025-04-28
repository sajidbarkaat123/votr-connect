import { Box, Typography, Button } from '@mui/material';

// Define interface for the form data that will be passed to Review
interface FormData {
    basicInfo: {
        integrationName: string;
        graphqlEndpoint: string;
        introspectionEnabled: boolean;
    };
    schemaDesign: {
        schema: string;
        schemaSource: string;
    };
    security: {
        authMethod: string;
        bearerToken?: string;
        apiKey?: string;
        oauthClientId?: string;
        oauthClientSecret?: string;
        maxQueryDepth: number;
        maxQueryCost: number;
        rateLimit: number;
        timeout: number;
    };
}

interface ReviewProps {
    formData: FormData;
    goToStep: (step: number) => void;
}

const Review = ({ formData, goToStep }: ReviewProps) => (
    <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Review and Finalize Your Integration Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Review and finalize your integration configuration
        </Typography>
        <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Basic Information
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Name: {formData.basicInfo.integrationName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Endpoint: {formData.basicInfo.graphqlEndpoint}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Introspection Enabled: {formData.basicInfo.introspectionEnabled ? 'Yes' : 'No'}
            </Typography>
            <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => goToStep(0)}
            >
                Edit
            </Button>
        </Box>
        <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Schema
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Schema Source: {formData.schemaDesign.schemaSource}
            </Typography>
            {formData.schemaDesign.schema && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Schema Defined: Yes
                </Typography>
            )}
            <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => goToStep(1)}
            >
                Edit
            </Button>
        </Box>
        <Box sx={{ mb: 3, p: 2, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Security
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Authentication: {formData.security.authMethod}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Query Limits: Depth {formData.security.maxQueryDepth}, Cost {formData.security.maxQueryCost}, Rate {formData.security.rateLimit}/min
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Timeout: {formData.security.timeout} seconds
            </Typography>
            <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => goToStep(2)}
            >
                Edit
            </Button>
        </Box>
    </Box>
);

export default Review; 