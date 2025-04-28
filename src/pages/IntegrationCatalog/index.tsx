import { CustomButton, FullPageLoader } from "@/components";
import IntegrationCard from "@/components/IntegrationCard";
import { useGetIntegrationCatalogQuery } from "@/services/integration-catalog";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";


const IntegrationCatalog = () => {
    const navigate = useNavigate();
    const { data: integrationCatalog, isLoading } = useGetIntegrationCatalogQuery();
    console.log(integrationCatalog, "integrationCatalog");
    const handleConfigure = (route: string) => {
        navigate(route);
    };

    const handleRequest = () => {
        console.log('Request clicked');
    };

    if (isLoading) return <FullPageLoader />

    return (
        <Box className="p-6">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            color: '#111827',
                            mb: 1
                        }}
                    >
                        Integration Catalog
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            color: '#6B7280',
                            mb: 4
                        }}
                    >
                        Select an integration type to get started with configuration.
                    </Typography>
                </Box>
                <CustomButton
                    title="integration list"
                    href="/integration-catalog/list"
                    endIcon={<ArrowForward />}

                />
            </Stack>


            <Grid container spacing={3}>
                {integrationCatalog?.map((integration) => (
                    <Grid item xs={12} md={6}>
                        <IntegrationCard
                            key={integration.path}
                            title={integration.name}
                            description={integration.description}
                            buttonText="Configure"
                            buttonColor="#5263FF"
                            onClick={() => handleConfigure(`/integration-catalog/${integration.path}`)}
                        />
                    </Grid>
                ))}
                {/* <Grid item xs={12} md={6}>
                    <IntegrationCard
                        title="REST API"
                        description="Share data via endpoints with JSON responses"
                        buttonText="Configure"
                        buttonColor="#3B82F6"
                        onClick={() => handleConfigure('/integration-catalog/rest-api-integration')}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <IntegrationCard
                        title="GraphQL"
                        description="Flexible data queries with schema definitions"
                        buttonText="Configure"
                        buttonColor="#9333EA"
                        onClick={() => handleConfigure('/integration-catalog/graphql-integration')}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <IntegrationCard
                        title="File Upload"
                        description="Scheduled file transfers via SFTP/FPS"
                        buttonText="Configure"
                        buttonColor="#F97316"
                        onClick={() => handleConfigure('/integration-catalog/file-upload-integration')}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <IntegrationCard
                        title="Custom Integration"
                        description="Special requirements? Contact our team"
                        buttonText="Request"
                        buttonColor="#6B7280"
                        onClick={handleRequest}
                    />
                </Grid> */}
            </Grid>
        </Box>
    );
};

export default IntegrationCatalog; 