import { Box, Typography, Button, Divider, Chip, Grid, Stack } from '@mui/material';
import { forwardRef } from 'react';
import { FileSettingsData } from './FileSettings';
import { ConnectionData } from './Connection';
import { ScheduleData } from './Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorageIcon from '@mui/icons-material/Storage';
import FileIcon from '@mui/icons-material/InsertDriveFile';

interface ReviewProps {
    fileSettings?: FileSettingsData;
    connection?: ConnectionData;
    schedule?: ScheduleData;
    onEditStep: (step: number) => void;
}

const ConnectionStatusChip = ({ status }: { status: 'success' | 'failed' | 'pending' }) => {
    const statusMap = {
        success: {
            label: 'Connection Successful',
            color: 'success' as const,
            icon: <CheckCircleIcon fontSize="small" />
        },
        failed: {
            label: 'Connection Failed',
            color: 'error' as const,
            icon: <ErrorIcon fontSize="small" />
        },
        pending: {
            label: 'Not Tested Yet',
            color: 'default' as const,
            icon: <QueryBuilderIcon fontSize="small" />
        }
    };

    const { label, color, icon } = statusMap[status];

    return (
        <Chip
            icon={icon}
            label={label}
            color={color}
            size="small"
            sx={{ fontWeight: 500 }}
        />
    );
};

const Review = forwardRef<any, ReviewProps>(({ fileSettings, connection, schedule, onEditStep }, ref) => {
    // Generate file path preview
    const getFilePathPreview = () => {
        if (!fileSettings || !connection) return 'N/A';

        const fileExtensionMap: Record<string, string> = {
            'CSV': '.csv',
            'Excel': '.xlsx',
            'JSON': '.json',
            'XML': '.xml'
        };

        const extension = fileExtensionMap[fileSettings.fileFormat] || '';

        // Generate a sample filename based on pattern
        const sampleFilename = fileSettings.fileNamingPattern
            .replace('YYYY', '2023')
            .replace('MM', '12')
            .replace('DD', '31')
            .replace('HH', '23')
            .replace('mm', '59')
            .replace('SS', '59');

        // Construct full path based on connection type
        let fullPath = '';

        if (connection.connectionType === 'SFTP' && connection.sftp) {
            fullPath = `sftp://${connection.sftp.username}@${connection.sftp.host}:${connection.sftp.port}/incoming/${sampleFilename}${extension}`;
        } else if (connection.connectionType === 'FTPS' && connection.ftps) {
            fullPath = `ftps://${connection.ftps.username}@${connection.ftps.host}:${connection.ftps.port}/incoming/${sampleFilename}${extension}`;
        } else if (connection.connectionType === 'S3' && connection.s3) {
            const folderPath = connection.s3.folderPath || '';
            fullPath = `s3://${connection.s3.bucketName}/${folderPath}${sampleFilename}${extension}`;
        }

        return fullPath;
    };

    // Format schedule display
    const formatSchedule = () => {
        if (!schedule) return 'N/A';

        let frequencyText = '';

        switch (schedule.frequency) {
            case 'Daily':
                frequencyText = 'Daily';
                break;
            case 'Weekly':
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const dayOfWeek = schedule.dayOfWeek !== undefined ? daysOfWeek[schedule.dayOfWeek] : 'Monday';
                frequencyText = `Weekly on ${dayOfWeek}`;
                break;
            case 'Monthly':
                const dayOfMonth = schedule.dayOfMonth || 1;
                frequencyText = `Monthly on day ${dayOfMonth}`;
                break;
        }

        return `${frequencyText} at ${schedule.time} (${schedule.timezone})`;
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Review and Finalize Your Integration Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please review all details before finalizing your file upload integration
            </Typography>

            {/* File Settings Section */}
            <Box sx={{ mb: 4, p: 3, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileIcon sx={{ color: '#5263FF', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            File Settings
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEditStep(0)}
                    >
                        Edit
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Integration Name
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {fileSettings?.integrationName || 'Daily Shareholder File Upload'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            File Format
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {fileSettings?.fileFormat || 'CSV'} {fileSettings?.includeHeaderRow ? 'with header row' : 'without header row'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            File Path Preview
                        </Typography>
                        <Box sx={{ p: 1.5, bgcolor: '#EAECF0', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem', overflowX: 'auto' }}>
                            {getFilePathPreview()}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Connection Section */}
            <Box sx={{ mb: 4, p: 3, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StorageIcon sx={{ color: '#5263FF', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Connection Details
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEditStep(1)}
                    >
                        Edit
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <ConnectionStatusChip status="success" />
                    <Typography variant="body2" color="text.secondary">
                        Last tested: Today at 12:34 PM
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Connection Type
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {connection?.connectionType || 'SFTP'}
                        </Typography>
                    </Grid>
                    {connection?.connectionType === 'SFTP' && connection.sftp && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Host
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.sftp.host}:{connection.sftp.port}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Authentication
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.sftp.authenticationType}
                                </Typography>
                            </Grid>
                        </>
                    )}
                    {connection?.connectionType === 'FTPS' && connection.ftps && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Host
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.ftps.host}:{connection.ftps.port}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Encryption
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.ftps.encryption}
                                </Typography>
                            </Grid>
                        </>
                    )}
                    {connection?.connectionType === 'S3' && connection.s3 && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Bucket
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.s3.bucketName} ({connection.s3.region})
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Authentication
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {connection.s3.authMethod}
                                </Typography>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>

            {/* Schedule Section */}
            <Box sx={{ mb: 3, p: 3, border: '1px solid #E5E7EB', borderRadius: 1, bgcolor: '#F9FAFB' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ color: '#5263FF', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Schedule
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEditStep(2)}
                    >
                        Edit
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Frequency
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {formatSchedule()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Post-Processing
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {schedule?.archiveAfterTransfer ? 'Archive file after transfer' : 'No post-processing'}
                        </Typography>
                    </Grid>
                    {schedule?.retryOnFailure && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Retry Configuration
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {schedule.retryCount} retries with {schedule.retryInterval} minute intervals
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
});

export default Review; 