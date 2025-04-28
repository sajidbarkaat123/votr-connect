import { Box, Container, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router';
import { ArrowBack } from '@mui/icons-material';
import { useState, useRef } from 'react';
import { FileSettings, Connection, Schedule, Review } from '@/components/FileUploadSteps';
import { FileSettingsHandle, FileSettingsData } from '@/components/FileUploadSteps/FileSettings';
import { ConnectionHandle, ConnectionData } from '@/components/FileUploadSteps/Connection';
import { ScheduleHandle, ScheduleData } from '@/components/FileUploadSteps/Schedule';
import useMessage from '@/hooks/useMessage';
import { useFileUploadIntegrationMutation } from '@/services/integration-catalog';

const steps = ['File Settings', 'Connection', 'Schedule', 'Review'];

const FileUploadIntegration = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useMessage();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<{
        fileSettings?: FileSettingsData;
        connection?: ConnectionData;
        schedule?: ScheduleData;
    }>({});

    // Refs for step components
    const fileSettingsRef = useRef<FileSettingsHandle>(null);
    const connectionRef = useRef<ConnectionHandle>(null);
    const scheduleRef = useRef<ScheduleHandle>(null);

    const [fileUploadIntegration, { isLoading }] = useFileUploadIntegrationMutation();

    const handleNext = async () => {
        // If we're on the last step, handle form submission
        if (activeStep === steps.length - 1) {
            handleSubmit();
            return;
        }

        let canProceed = true;

        // Validate current step before proceeding
        switch (activeStep) {
            case 0:
                if (fileSettingsRef.current) {
                    canProceed = await fileSettingsRef.current.validate();
                }
                break;
            case 1:
                if (connectionRef.current) {
                    canProceed = await connectionRef.current.validate();
                }
                break;
            case 2:
                if (scheduleRef.current) {
                    canProceed = await scheduleRef.current.validate();
                }
                break;
        }

        if (canProceed) {
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleSubmit = async () => {
        const basePayload = {
            name: formData.fileSettings?.integrationName,
            fileFormat: formData.fileSettings?.fileFormat,
            fileNamePattern: formData.fileSettings?.fileNamingPattern,
            isHeaderRowIncluded: formData.fileSettings?.includeHeaderRow,
            transferFrequency: formData.schedule?.frequency,
            timeOfDay: formData.schedule?.time,
            timeZone: formData.schedule?.timezone,
            afterSuccessfulTransferAction: "Archive",
            afterFailedTransferAction: "Archive",
        };

        let payload;

        if (formData.connection?.connectionType === 'SFTP') {
            payload = {
                ...basePayload,
                url: formData.connection.sftp?.host,
                ftp: {
                    host: formData.connection.sftp?.host,
                    port: formData.connection.sftp?.port,
                    username: formData.connection.sftp?.username,
                    type: formData.connection.sftp?.type,
                    ftpAuthentication: {
                        type: formData.connection.sftp?.ftpAuthentication.type,
                        password: formData.connection.sftp?.ftpAuthentication.password,
                        sshKey: formData.connection.sftp?.ftpAuthentication.sshKey,
                        passphrase: formData.connection.sftp?.ftpAuthentication.passphrase
                    },
                }
            };
        } else if (formData.connection?.connectionType === 'S3') {
            payload = {
                ...basePayload,
                url: `s3://${formData.connection.s3?.bucketName}/${formData.connection.s3?.folderPath || ''}`,
                amazonS3Details: {
                    region: formData.connection.s3?.region,
                    bucketName: formData.connection.s3?.bucketName,
                    folderPath: formData.connection.s3?.folderPath || '',
                    amazonS3Authentication: {
                        authenticationMethod: formData.connection.s3?.amazonS3Authentication.authenticationMethod,
                        ARN: formData.connection.s3?.amazonS3Authentication.ARN,
                        accessKey: formData.connection.s3?.amazonS3Authentication.accessKey,
                        secretKey: formData.connection.s3?.amazonS3Authentication.secretKey
                    }
                }
            };
        }
        const response = await fileUploadIntegration(payload);

        if (response.error) {
            showSnackbar(
                'Failed to create file upload integration',
                'Please check your connection details and try again.',
                'error',
                5000
            );
        } else {
            // Show success message
            showSnackbar(
                'File upload integration created successfully!',
                'Your integration will begin processing files according to the schedule you defined.',
                'success',
                5000
            );

            // Navigate back to integration catalog page
            navigate('/integration-catalog');
        }
    };

    const handlePrevious = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle form data changes
    const handleFileSettingsChange = (data: FileSettingsData) => {
        setFormData(prev => ({ ...prev, fileSettings: data }));
    };

    const handleConnectionChange = (data: ConnectionData) => {
        setFormData(prev => ({ ...prev, connection: data }));
    };

    const handleScheduleChange = (data: ScheduleData) => {
        setFormData(prev => ({ ...prev, schedule: data }));
    };

    // Handle edit step from review
    const handleEditStep = (step: number) => {
        setActiveStep(step);
    };

    // For debugging - log form data changes
    console.log('Form Data:', formData);

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <FileSettings ref={fileSettingsRef} onDataChange={handleFileSettingsChange} />;
            case 1:
                return <Connection ref={connectionRef} onDataChange={handleConnectionChange} />;
            case 2:
                return <Schedule ref={scheduleRef} onDataChange={handleScheduleChange} />;
            case 3:
                return (
                    <Review
                        fileSettings={formData.fileSettings}
                        connection={formData.connection}
                        schedule={formData.schedule}
                        onEditStep={handleEditStep}
                    />
                );
            default:
                return <FileSettings ref={fileSettingsRef} onDataChange={handleFileSettingsChange} />;
        }
    };

    const isLastStep = activeStep === steps.length - 1;

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
                    File Upload Integration
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
                            onClick={handlePrevious}
                            disabled={activeStep === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Done' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default FileUploadIntegration; 