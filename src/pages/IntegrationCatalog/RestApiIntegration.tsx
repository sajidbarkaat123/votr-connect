import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Container, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import {
    BasicInfo,
    Authentication,
    DataSchema,
    Review,
    BasicInfoRef,
    AuthenticationRef,
    DataSchemaRef,
    BasicInfoFormData,
    SchemaFormData,
    AuthFormData
} from '../../components/RestApiSteps';
import useMessage from '@/hooks/useMessage';
import { useRestApiIntegrationMutation, useGetRestAPIIntegrationByIdQuery, useUpdateRestAPIIntegrationMutation } from '@/services/integration-catalog';

const steps = ['Basic Info', 'Authentication', 'Data Schema', 'Review'];

const RestApiIntegration = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const id = params.get("id");
    const isEditMode = Boolean(id);
    const { showSnackbar } = useMessage();
    const basicInfoRef = useRef<BasicInfoRef>(null);
    const authRef = useRef<AuthenticationRef>(null);
    const schemaRef = useRef<DataSchemaRef>(null);
    const [formData, setFormData] = useState({
        basicInfo: null as BasicInfoFormData | null,
        auth: null as AuthFormData | null,
        dataSchema: null as SchemaFormData | null
    });
    const [nextDisabled, setNextDisabled] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [restApiIntegration, { isLoading }] = useRestApiIntegrationMutation();
    const [updateRestApiIntegration, { isLoading: isUpdating }] = useUpdateRestAPIIntegrationMutation();
    const { data: fetchedData, isLoading: isFetching } = useGetRestAPIIntegrationByIdQuery(id!, { skip: !isEditMode });

    // Populate form when fetchedData changes
    useEffect(() => {
        if (isEditMode && fetchedData) {
            setFormData({
                basicInfo: {
                    integrationName: fetchedData.name,
                    dataFormat: fetchedData.dataFormat,
                    updateFrequency: fetchedData.updateFrequency,
                    baseUrl: fetchedData.url,
                    restMethod: fetchedData.method,
                    queryParams: {
                        limit: { enabled: !!fetchedData.queryParams?.limit, value: fetchedData.queryParams?.limit || '' },
                        offset: { enabled: !!fetchedData.queryParams?.offset, value: fetchedData.queryParams?.offset || '' }
                    },
                    environment: fetchedData.environment,
                    isActive: fetchedData.status === 'active',
                },
                auth: {
                    authMethod: fetchedData.authentication?.authenticationType,
                    grantType: fetchedData.authentication?.grantType,
                    clientId: fetchedData.authentication?.clientId,
                    clientSecret: fetchedData.authentication?.clientSecret,
                    redirectUri: fetchedData.authentication?.redirectUri,
                },
                dataSchema: {
                    resourceName: fetchedData.schema?.resourceName,
                    endpointPath: fetchedData.schema?.endpointPath,
                    fields: fetchedData.schema?.fieldDetails?.map(field => ({
                        name: field.name,
                        type: field.type,
                        description: field.description,
                        required: field.isRequired
                    })) || []
                }
            });
        }
    }, [isEditMode, fetchedData]);

    // Check if the current step is valid
    const isCurrentStepValid = () => {
        switch (activeStep) {
            case 0:
                return basicInfoRef.current?.isValid() || false;
            case 1:
                return authRef.current?.isValid() || false;
            case 2:
                return schemaRef.current?.isValid() || false;
            case 3:
                return true;
            default:
                return true;
        }
    };

    // Update next button state when active step changes
    React.useEffect(() => {
        const checkValidity = () => {
            setNextDisabled(!isCurrentStepValid());
        };
        checkValidity();
        const intervalId = setInterval(checkValidity, 500);
        return () => clearInterval(intervalId);
    }, [activeStep]);

    const handleNext = async () => {
        const lastStep = activeStep === steps.length - 1;
        if (lastStep) {
            const payload = {
                dataFormat: formData.basicInfo?.dataFormat,
                updateFrequency: formData.basicInfo?.updateFrequency,
                advanceOptions: 'caching',
                name: formData.basicInfo?.integrationName,
                url: formData.basicInfo?.baseUrl,
                method: formData.basicInfo?.restMethod,
                body: {},
                queryParams: {
                    limit: formData.basicInfo?.queryParams.limit.enabled ? formData.basicInfo?.queryParams.limit.value : null,
                    offset: formData.basicInfo?.queryParams.offset.enabled ? formData.basicInfo?.queryParams.offset.value : null
                },
                headerParams: {
                    "Content-Type": "application/json"
                },
                environment: formData.basicInfo?.environment,
                status: formData.basicInfo?.isActive ? 'active' : 'inactive',
                authentication: {
                    name: formData.auth?.authMethod,
                    authenticationType: formData.auth?.authMethod,
                    grantType: formData.auth?.grantType,
                    clientId: formData.auth?.clientId,
                    clientSecret: formData.auth?.clientSecret,
                    tokenUrl: formData.auth?.tokenUrl,
                    redirectUri: formData.auth?.redirectUri,
                },
                schema: {
                    resourceName: formData.dataSchema?.resourceName,
                    endpointPath: formData.dataSchema?.endpointPath,
                    fieldDetails: formData.dataSchema?.fields?.map((field) => ({
                        name: field.name,
                        type: field.type,
                        description: field.description,
                        isRequired: field.required
                    })) || []
                }
            }
            try {
                if (isEditMode) {
                    console.log(payload, "check");
                    await updateRestApiIntegration({ id: fetchedData?.id, data: payload });
                    showSnackbar("Integration updated successfully", "", "success");
                } else {
                    await restApiIntegration(payload);
                    showSnackbar("Integration created successfully", "You can now use this integration in your workflows", "success");
                }
                navigate('/integration-catalog');
            } catch (error) {
                showSnackbar("Error saving integration", "Please try again", "error");
            }
        }
        if (activeStep === 0) {
            setFormData(prev => ({
                ...prev,
                basicInfo: basicInfoRef.current?.getData() || null
            }));
        }
        if (activeStep === 1) {
            setFormData(prev => ({
                ...prev,
                auth: authRef.current?.getData() || null
            }));
        }
        if (activeStep === 2) {
            setFormData(prev => ({
                ...prev,
                dataSchema: schemaRef.current?.getData() || null
            }));
        }
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <BasicInfo ref={basicInfoRef} initialValues={formData.basicInfo} />;
            case 1:
                return <Authentication ref={authRef} initialValues={formData.auth} />;
            case 2:
                return <DataSchema ref={schemaRef} initialValues={formData.dataSchema} />;
            case 3:
                return <Review
                    basicInfo={formData.basicInfo}
                    auth={formData.auth}
                    dataSchema={formData.dataSchema}
                />;
            default:
                return <BasicInfo ref={basicInfoRef} initialValues={formData.basicInfo} />;
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Button
                    variant="text"
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBack />}
                    sx={{ mb: 3, color: '#1F2937', '&:hover': { color: '#5263FF' } }}
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    REST API Integration
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{ p: 4, borderRadius: 2, border: '1px solid #E5E7EB', bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)' }}>
                    {isEditMode && isFetching ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        renderStepContent(activeStep)
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            variant="outlined"
                            sx={{ mr: 2 }}
                            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                            disabled={activeStep === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={nextDisabled || isLoading || isUpdating || (isEditMode && isFetching)}
                        >
                            {activeStep === steps.length - 1 ? (isEditMode ? 'Update' : 'Finish') : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default RestApiIntegration; 