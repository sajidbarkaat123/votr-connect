import { Box, Container, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router';
import { ArrowBack } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { BasicInfo, SchemaDesign, Security, Review } from '../../components/GraphqlSteps';
import { BasicInfoRef } from '../../components/GraphqlSteps/BasicInfo';
import { SchemaDesignRef } from '../../components/GraphqlSteps/SchemaDesign';
import { SecurityRef } from '../../components/GraphqlSteps/Security';
import useMessage from '@/hooks/useMessage';
import { useGraphqlIntegrationMutation } from '@/services/integration-catalog';

const steps = ['Basic Info', 'Schema Design', 'Security', 'Review'];

// Add interface for form data
interface FormData {
    basicInfo: {
        integrationName: string;
        graphqlEndpoint: string;
        introspectionEnabled: boolean;
        environment: string;
        status: string;
        updateFrequency: string;
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

const GraphQLIntegration = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [isStepValid, setIsStepValid] = useState(false);
    const { showSnackbar } = useMessage();

    // State to store all form data
    const [formData, setFormData] = useState<FormData>({
        basicInfo: {
            integrationName: 'GraphQL Financial Data API',
            graphqlEndpoint: 'https://api.yourplatform.com/graphql',
            introspectionEnabled: true,
            environment: 'development',
            status: 'active',
            updateFrequency: 'daily'
        },
        schemaDesign: {
            schema: '',
            schemaSource: 'manual',
        },
        security: {
            authMethod: 'Bearer Token',
            bearerToken: '',
            maxQueryDepth: 5,
            maxQueryCost: 1000,
            rateLimit: 100,
            timeout: 30,
        }
    });

    // Refs for each step component
    const basicInfoRef = useRef<BasicInfoRef>(null);
    const schemaDesignRef = useRef<SchemaDesignRef>(null);
    const securityRef = useRef<SecurityRef>(null);

    const [graphqlIntegration, { isLoading }] = useGraphqlIntegrationMutation();

    // Function to navigate to a specific step
    const goToStep = (step: number) => {
        setActiveStep(step);
    };

    // Validate the current step when trying to move forward
    const handleNext = async () => {
        if (activeStep === 0) {
            // Validate BasicInfo step
            if (basicInfoRef.current) {
                const isValid = await basicInfoRef.current.validate();
                if (isValid) {
                    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
                }
            }
        } else if (activeStep === 1) {
            // Validate SchemaDesign step
            if (schemaDesignRef.current) {
                const isValid = await schemaDesignRef.current.validate();
                if (isValid) {
                    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
                }
            }
        } else if (activeStep === 2) {
            // Validate Security step
            if (securityRef.current) {
                const isValid = await securityRef.current.validate();
                if (isValid) {
                    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
                }
            }
        } else if (activeStep === 3) {
            const payload = {
                name: formData.basicInfo.integrationName,
                url: formData.basicInfo.graphqlEndpoint,
                isIntrospectionEnabled: formData.basicInfo.introspectionEnabled,
                query: formData.schemaDesign.schema,
                variables: {},
                headers: formData.security.authMethod === 'Bearer Token' ? {
                    Authorization: `Bearer ${formData.security.bearerToken}`
                } : {},
                authenticationId: formData.security.authMethod,
                dataFormat: 'json',
                advanceOptions: 'caching',
                updateFrequency: formData.basicInfo.updateFrequency,
                environment: formData.basicInfo.environment,
                status: formData.basicInfo.status,
                schemaDesign: {
                    type: formData.schemaDesign.schemaSource,
                    schemaDesign: formData.schemaDesign.schema
                },
                securityAndComplexity: {
                    authenticationMethod: formData.security.authMethod,
                    maxQueryDepth: formData.security.maxQueryDepth,
                    maxQueryCost: formData.security.maxQueryCost,
                    rateLimit: formData.security.rateLimit,
                    timeout: formData.security.timeout
                }

            }
            const response = await graphqlIntegration(payload);
            if (!response.error) {
                showSnackbar('Integration created successfully', '', 'success');
                navigate('/integration-catalog');
            } else {
                showSnackbar('Error creating integration', 'Please try again', 'error');
            }
        }
        else {
            // For other steps, we'll add validation later
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    // Check if current step is valid
    useEffect(() => {
        const checkStepValidity = () => {
            if (activeStep === 0 && basicInfoRef.current) {
                setIsStepValid(basicInfoRef.current.isValid());
            } else if (activeStep === 1 && schemaDesignRef.current) {
                setIsStepValid(schemaDesignRef.current.isValid());
            } else if (activeStep === 2 && securityRef.current) {
                setIsStepValid(securityRef.current.isValid());
            } else if (activeStep === 3) {
                setIsStepValid(true);
            } else {
                // For other steps, we'll add validation later
                setIsStepValid(true);
            }
        };

        // Check validity immediately
        checkStepValidity();

    }, [activeStep, formData]); // Add formData to dependencies so validation is checked when form data changes

    // Update form data handlers for each step
    const updateBasicInfo = (data: FormData['basicInfo']) => {
        setFormData(prev => ({
            ...prev,
            basicInfo: data
        }));
    };

    const updateSchemaDesign = (data: FormData['schemaDesign']) => {
        setFormData(prev => ({
            ...prev,
            schemaDesign: data
        }));
    };

    const updateSecurity = (data: FormData['security']) => {
        setFormData(prev => ({
            ...prev,
            security: data
        }));
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <BasicInfo ref={basicInfoRef} formData={formData.basicInfo} updateFormData={updateBasicInfo} />;
            case 1:
                return <SchemaDesign ref={schemaDesignRef} formData={formData.schemaDesign} updateFormData={updateSchemaDesign} />;
            case 2:
                return <Security ref={securityRef} formData={formData.security} updateFormData={updateSecurity} />;
            case 3:
                return <Review formData={formData} goToStep={goToStep} />;
            default:
                return <BasicInfo ref={basicInfoRef} formData={formData.basicInfo} updateFormData={updateBasicInfo} />;
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
                    GraphQL Integration
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
                    {renderStepContent(activeStep)}
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
                            disabled={!isStepValid}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default GraphQLIntegration; 