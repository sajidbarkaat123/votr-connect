import { useState } from 'react';
import { Box, Typography } from "@mui/material";
import TabPanel from '../TabPanel';
import ConfigurationTab from './ConfigurationTab';
import TestValidateTab from './TestValidateTab';
import LogsTab from './LogsTab';
import SampleDataTab from './SampleDataTab';

const RestApiSandbox = () => {
    // Shared state that might be needed across tabs
    const [baseUrl, setBaseUrl] = useState('https://api.sandbox.yourplatform.com/v1');
    const [clientId, setClientId] = useState('sandbox_client_123456');
    const [tokenUrl, setTokenUrl] = useState('https://auth.sandbox.yourplatform.com/oauth/token');

    // Configuration state
    const [authType, setAuthType] = useState('OAuth 2.0');
    const [grantType, setGrantType] = useState('Client Credentials');
    const [clientSecret, setClientSecret] = useState('');

    const tabs = [
        {
            label: "Configuration",
            content: (
                <ConfigurationTab
                    baseUrl={baseUrl}
                    setBaseUrl={setBaseUrl}
                    authType={authType}
                    setAuthType={setAuthType}
                    grantType={grantType}
                    setGrantType={setGrantType}
                    clientId={clientId}
                    setClientId={setClientId}
                    clientSecret={clientSecret}
                    setClientSecret={setClientSecret}
                    tokenUrl={tokenUrl}
                    setTokenUrl={setTokenUrl}
                />
            )
        },
        {
            label: "Test & Validate",
            content: (
                <TestValidateTab
                    baseUrl={baseUrl}
                />
            )
        },
        {
            label: "Logs",
            content: (
                <LogsTab />
            )
        },
        {
            label: "Sample Data",
            content: (
                <SampleDataTab />
            )
        }
    ];

    return (
        <Box className="p-6">
            <Typography
                variant="h4"
                sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1
                }}
            >
                REST API Sandbox
            </Typography>
            <Typography
                sx={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    mb: 4
                }}
            >
                Use sample data for testing your integration.
            </Typography>

            <TabPanel tabs={tabs} />
        </Box>
    );
};

export default RestApiSandbox;