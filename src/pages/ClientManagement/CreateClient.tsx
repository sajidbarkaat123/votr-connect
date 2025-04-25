import { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
import { CustomButton } from '@/components';
import { useNavigate } from 'react-router';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { CompanyForm, IntegrationForm, ApprovalForm } from './components';
import { CompanyFormData } from './components/CompanyForm';
import { IntegrationFormData } from './components/IntegrationForm';
import { ApprovalFormData } from './components/ApprovalForm';

const STEPS = ['Company', 'Integration', 'Approval'];

// Define the ref type
export type FormRefType = {
    validate: () => Promise<boolean>;
};

interface FormData {
    company: CompanyFormData;
    integration: IntegrationFormData;
    approval: ApprovalFormData;
}

const CreateClient = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);
    const [isStepValid, setIsStepValid] = useState(false);

    // Create refs for each form component
    const companyFormRef = useRef<FormRefType>(null);
    const integrationFormRef = useRef<FormRefType>(null);
    const approvalFormRef = useRef<FormRefType>(null);

    // Form data state
    const [formData, setFormData] = useState<FormData>({
        company: {},
        integration: {},
        approval: {}
    });

    const handleBack = () => {
        if (activeStep === 0) {
            navigate('/client-management');
        } else {
            setActiveStep((prev) => prev - 1);
            // When going back, the previous step is already valid
            setIsStepValid(true);
        }
    };

    const handleContinue = async () => {
        let isValid = false;

        // Validate the current step using the appropriate ref
        switch (activeStep) {
            case 0:
                isValid = await companyFormRef.current?.validate() || false;
                break;
            case 1:
                isValid = await integrationFormRef.current?.validate() || false;
                break;
            case 2:
                isValid = await approvalFormRef.current?.validate() || false;
                break;
        }

        if (isValid) {
            setActiveStep((prev) => prev + 1);
            setIsStepValid(false); // Reset validation for next step
        }
    };

    // Update form data
    const updateFormData = (step: keyof FormData, data: any) => {
        setFormData(prev => ({
            ...prev,
            [step]: data
        }));
    };

    // Check validation status when component mounts
    useEffect(() => {
        const checkValidation = async () => {
            switch (activeStep) {
                case 0:
                    const companyValid = await companyFormRef.current?.validate() || false;
                    setIsStepValid(companyValid);
                    break;
                case 1:
                    const integrationValid = await integrationFormRef.current?.validate() || false;
                    setIsStepValid(integrationValid);
                    break;
                case 2:
                    const approvalValid = await approvalFormRef.current?.validate() || false;
                    setIsStepValid(approvalValid);
                    break;
            }
        };

        checkValidation();
    }, [activeStep]);

    // Common text field styles
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#F9FAFB',
            height: '48px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: '#F3F4F6',
            },
            '&.Mui-focused': {
                backgroundColor: '#FFFFFF',
                '& fieldset': {
                    borderColor: '#5263FF',
                    borderWidth: '2px',
                }
            }
        },
        '& .MuiOutlinedInput-input': {
            padding: '12px 16px',
            fontSize: '15px',
            '&::placeholder': {
                color: '#9CA3AF',
                opacity: 1
            }
        },
        '& .MuiInputLabel-root': {
            color: '#4B5563',
            fontSize: '14px',
            transform: 'translate(16px, 14px) scale(1)',
            '&.Mui-focused': {
                color: '#5263FF',
                transform: 'translate(16px, -9px) scale(0.75)'
            },
            '&.MuiFormLabel-filled': {
                transform: 'translate(16px, -9px) scale(0.75)'
            }
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
            borderWidth: '1px'
        },
        '& .MuiSelect-select': {
            padding: '12px 16px !important'
        }
    };

    // Multiline text field styles
    const multilineTextFieldStyles = {
        ...textFieldStyles,
        '& .MuiOutlinedInput-root': {
            ...textFieldStyles['& .MuiOutlinedInput-root'],
            height: 'auto',
            '& textarea': {
                padding: '12px 16px'
            }
        }
    };

    // Common section styles
    const sectionStyles = {
        p: 4,
        mb: 3,
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        bgcolor: '#FFFFFF',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)'
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <CompanyForm
                        ref={companyFormRef}
                        onDataChange={(data) => updateFormData('company', data)}
                        onValidChange={setIsStepValid}
                        initialData={formData.company}
                    />
                );
            case 1:
                return (
                    <IntegrationForm
                        ref={integrationFormRef}
                        onDataChange={(data) => updateFormData('integration', data)}
                        onValidChange={setIsStepValid}
                        initialData={formData.integration}
                    />
                );
            case 2:
                return (
                    <ApprovalForm
                        ref={approvalFormRef}
                        onDataChange={(data) => updateFormData('approval', data)}
                        onValidChange={setIsStepValid}
                        initialData={formData.approval}
                        companyData={formData.company}
                        integrationData={formData.integration}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Box sx={{ mb: 6 }}>
                    <CustomButton
                        variant="text"
                        onClick={handleBack}
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#5263FF'
                            }
                        }}
                        startIcon={<ArrowBack />}
                    >
                        Back
                    </CustomButton>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1F2937' }}>
                        {activeStep === 0 && 'Create New Client Account'}
                        {activeStep === 1 && 'Configure Integration'}
                        {activeStep === 2 && 'Final Approval'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#6B7280', maxWidth: 600 }}>
                        {activeStep === 0 && 'Set up a new client account by providing company and contact information.'}
                        {activeStep === 1 && 'Choose your preferred integration method and configure its settings.'}
                        {activeStep === 2 && 'Review all details and approve the account setup.'}
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Box sx={{
                        display: 'flex',
                        position: 'relative',
                        mb: 8,
                        mt: 6,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '10%',
                            right: '10%',
                            height: '2px',
                            backgroundColor: '#E5E7EB',
                            transform: 'translateY(-50%)',
                            zIndex: 0
                        }
                    }}>
                        {STEPS.map((label, index) => (
                            <Box
                                key={label}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    cursor: index <= activeStep ? 'pointer' : 'default',
                                    zIndex: 1
                                }}
                                onClick={() => index <= activeStep && setActiveStep(index)}
                                onMouseEnter={() => setHoveredStep(index)}
                                onMouseLeave={() => setHoveredStep(null)}
                            >
                                <Typography
                                    sx={{
                                        mb: 2,
                                        color: index <= activeStep ? '#5263FF' : '#6B7280',
                                        fontWeight: index <= activeStep ? 600 : 500,
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {label}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: index <= activeStep ? '#5263FF' : '#fff',
                                        border: '2px solid',
                                        borderColor: index <= activeStep ? '#5263FF' : '#E5E7EB',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        transform: hoveredStep === index ? 'scale(1.1)' : 'scale(1)',
                                        boxShadow: hoveredStep === index ? '0px 4px 12px rgba(82, 99, 255, 0.2)' : 'none'
                                    }}
                                >
                                    {index <= activeStep ? (
                                        <CheckCircle sx={{ color: '#fff', fontSize: 16 }} />
                                    ) : (
                                        <Typography sx={{ color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>
                                            {index + 1}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Box marginX={'auto'}>
                        {renderStepContent()}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                            {activeStep === 2 ? (
                                <>
                                    <CustomButton
                                        variant="outlined"
                                        onClick={handleBack}
                                        sx={{
                                            borderRadius: '6px',
                                            px: 4,
                                            py: 1.5,
                                            borderColor: '#E5E7EB',
                                            color: '#4B5563',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            '&:hover': {
                                                borderColor: '#5263FF',
                                                color: '#5263FF',
                                                bgcolor: '#F8F9FF'
                                            }
                                        }}
                                        title='Previous'
                                    />

                                    <CustomButton
                                        variant="contained"
                                        onClick={() => navigate('/client-management')}
                                        disabled={!isStepValid}
                                        sx={{
                                            borderRadius: '6px',
                                            px: 4,
                                            py: 1.5,
                                            bgcolor: '#5263FF',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            '&:hover': {
                                                bgcolor: '#4254FF'
                                            },
                                            '&.Mui-disabled': {
                                                bgcolor: '#E5E7EB',
                                                color: '#9CA3AF'
                                            }
                                        }}
                                        title='Create Account'
                                    />
                                </>
                            ) : (
                                <CustomButton
                                    variant="contained"
                                    onClick={handleContinue}
                                    disabled={!isStepValid}
                                    sx={{
                                        borderRadius: '6px',
                                        px: 4,
                                        py: 1.5,
                                        bgcolor: '#5263FF',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            bgcolor: '#4254FF'
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: '#E5E7EB',
                                            color: '#9CA3AF'
                                        }
                                    }}
                                    title="Continue"
                                    endIcon={<ArrowForward />}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateClient; 