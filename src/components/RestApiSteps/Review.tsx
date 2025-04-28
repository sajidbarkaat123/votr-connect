import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { BasicInfoFormData, SchemaFormData, AuthFormData } from './types';

interface ReviewProps {
    basicInfo: BasicInfoFormData | null;
    auth: AuthFormData | null;
    dataSchema: SchemaFormData | null;
}

const Review: React.FC<ReviewProps> = ({ basicInfo, auth, dataSchema }) => (
    <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Review Your Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please review the information below and make any necessary changes.
        </Typography>
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Basic Information
            </Typography>
            {basicInfo ? (
                <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Name: {basicInfo.integrationName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Data Format: {basicInfo.dataFormat.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Update Frequency: {basicInfo.updateFrequency}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Base URL: {basicInfo.baseUrl}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        REST Method: {basicInfo.restMethod}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Environment: {basicInfo.environment}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Status: {basicInfo.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                </>
            ) : (
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Basic information not available
                </Typography>
            )}
            <Button variant="outlined" sx={{ mt: 1 }}>Edit</Button>
        </Box>
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Authentication
            </Typography>
            {auth ? (
                <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Method: {auth.authMethod === 'oauth2' ? 'OAuth 2.0' : 'API Key'}
                    </Typography>
                    {auth.authMethod === 'oauth2' && (
                        <>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Grant Type: {auth.grantType === 'client_credentials' ? 'Client Credentials' : 'Authorization Code'}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Token URL: {auth.tokenUrl}
                            </Typography>
                            {auth.scopes && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Scopes: {auth.scopes}
                                </Typography>
                            )}
                            {auth.redirectUri && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Redirect URI: {auth.redirectUri}
                                </Typography>
                            )}
                        </>
                    )}
                    {auth.authMethod === 'apikey' && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Header Name: {auth.headerName}
                        </Typography>
                    )}
                </>
            ) : (
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Authentication information not available
                </Typography>
            )}
            <Button variant="outlined" sx={{ mt: 1 }}>Edit</Button>
        </Box>
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Data Schema
            </Typography>
            {dataSchema ? (
                <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Resource: {dataSchema.resourceName} ({dataSchema.endpointPath})
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Fields: {dataSchema.fields?.length || 0} defined
                    </Typography>
                </>
            ) : (
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Schema information not available
                </Typography>
            )}
            <Button variant="outlined" sx={{ mt: 1 }}>Edit</Button>
        </Box>
    </Box>
);

export default Review; 