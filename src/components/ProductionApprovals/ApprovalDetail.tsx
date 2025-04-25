import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
    Avatar,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Check, Close, AccessTime, Code, SystemUpdate, Description } from '@mui/icons-material';

// Comment validation schema
const commentSchema = yup.object().shape({
    comment: yup
        .string()
        .required('Comment is required')
        .min(3, 'Comment must be at least 3 characters')
});

interface CommentFormData {
    comment: string;
}

interface ApprovalDetailProps {
    // If props are needed they can be added here
}

const ApprovalDetail = (props: ApprovalDetailProps) => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [submittingComment, setSubmittingComment] = useState(false);

    // React Hook Form setup for comments
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CommentFormData>({
        resolver: yupResolver(commentSchema),
        defaultValues: {
            comment: ''
        }
    });

    console.log(props)
    // Mock data - in a real app, this would be fetched based on the requestId
    const requestDetail = {
        id: requestId || 'REQ-001',
        name: 'Shareholder API Production Release',
        type: 'API Release',
        status: 'Pending',
        requestedBy: 'Alex Johnson',
        requestedOn: 'Apr 8, 2025',
        environment: 'Production',
        description: 'This release introduces new endpoints for the Shareholder API, including improved pagination and filtering capabilities. The changes have been tested in the staging environment with no issues.',
        changes: [
            'Added /shareholders/filter endpoint',
            'Improved pagination with cursor-based navigation',
            'Added sorting options for all shareholder endpoints',
            'Updated documentation for new endpoints'
        ],
        dependencies: [
            'Authentication Service v2.3',
            'Data Processing Service v1.1',
            'Notification Service v3.0'
        ],
        timelineEvents: [
            {
                id: '1',
                action: 'Request Created',
                user: 'Alex Johnson',
                timestamp: 'Apr 8, 2025 10:30 AM',
                comment: 'Initial submission for API update'
            },
            {
                id: '2',
                action: 'Tests Completed',
                user: 'CI/CD Pipeline',
                timestamp: 'Apr 8, 2025 11:45 AM',
                comment: 'All tests passed with 100% coverage'
            },
            {
                id: '3',
                action: 'Security Review',
                user: 'Security Team',
                timestamp: 'Apr 8, 2025 02:15 PM',
                comment: 'No security vulnerabilities detected'
            }
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return '#22C55E';
            case 'Rejected': return '#EF4444';
            default: return '#F59E0B';
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case 'Approved': return '#ECFDF5';
            case 'Rejected': return '#FEE2E2';
            default: return '#FEF3C7';
        }
    };

    const handleApprove = () => {
        console.log(`Approving request ${requestId}`);
        // In a real app, make an API call to approve the request
    };

    const handleReject = () => {
        console.log(`Rejecting request ${requestId}`);
        // In a real app, make an API call to reject the request
    };

    const onCommentSubmit = (data: CommentFormData) => {
        console.log('Submitting comment:', data.comment);
        setSubmittingComment(true);
        // Simulate API call
        setTimeout(() => {
            // In a real app, make an API call to add a comment
            setSubmittingComment(false);
            reset({ comment: '' });
        }, 500);
    };

    return (
        <Box className="p-6">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button
                    startIcon={<ChevronLeft />}
                    onClick={() => navigate('/production-approvals')}
                    sx={{
                        color: '#3B82F6',
                        textTransform: 'none',
                        fontWeight: 500,
                        mr: 2
                    }}
                >
                    Back to Approvals
                </Button>
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: '#111827'
                    }}
                >
                    Approval Request Details
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: '8px', mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                                {requestDetail.name}
                            </Typography>
                            <Chip
                                label={requestDetail.status}
                                sx={{
                                    bgcolor: getStatusBgColor(requestDetail.status),
                                    color: getStatusColor(requestDetail.status),
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                }}
                            />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Request ID</Typography>
                                <Typography sx={{ fontWeight: 500 }}>{requestDetail.id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Type</Typography>
                                <Typography sx={{ fontWeight: 500 }}>{requestDetail.type}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Requested By</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            bgcolor: '#3B82F6',
                                            fontSize: '0.75rem',
                                            mr: 1
                                        }}
                                    >
                                        {requestDetail.requestedBy.split(' ').map(name => name[0]).join('')}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 500 }}>{requestDetail.requestedBy}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Date</Typography>
                                <Typography sx={{ fontWeight: 500 }}>{requestDetail.requestedOn}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                                Description
                            </Typography>
                            <Typography sx={{ color: '#4B5563' }}>
                                {requestDetail.description}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                                Changes
                            </Typography>
                            <List dense>
                                {requestDetail.changes.map((change, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: '32px' }}>
                                            <Box
                                                sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#3B82F6',
                                                    mt: 1
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={change} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                                Dependencies
                            </Typography>
                            <List dense>
                                {requestDetail.dependencies.map((dependency, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: '32px' }}>
                                            <Box
                                                sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#9CA3AF',
                                                    mt: 1
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={dependency} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 4, borderRadius: '8px', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', mb: 3 }}>
                            Timeline
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {requestDetail.timelineEvents.map((event, index) => (
                                <Box key={event.id} sx={{ display: 'flex', gap: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: index === 0 ? '#3B82F6' : '#9CA3AF',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {event.user.split(' ').map(name => name[0]).join('')}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                {event.action} by {event.user}
                                            </Typography>
                                            <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                                                {event.timestamp}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#4B5563', fontSize: '0.875rem', mt: 0.5 }}>
                                            {event.comment}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                                Add Comment
                            </Typography>
                            <form onSubmit={handleSubmit(onCommentSubmit)}>
                                <Controller
                                    name="comment"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Add your comments or questions here..."
                                            variant="outlined"
                                            error={!!errors.comment}
                                            helperText={errors.comment?.message}
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#F9FAFB',
                                                    '&:hover fieldset': {
                                                        borderColor: '#D1D5DB',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#3B82F6',
                                                    }
                                                }
                                            }}
                                            {...field}
                                        />
                                    )}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={submittingComment}
                                        sx={{
                                            bgcolor: '#3B82F6',
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: '#2563EB',
                                            }
                                        }}
                                    >
                                        Submit Comment
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, borderRadius: '8px', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', mb: 3 }}>
                            Actions
                        </Typography>

                        {requestDetail.status === 'Pending' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    onClick={handleApprove}
                                    sx={{
                                        bgcolor: '#22C55E',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: '#16A34A',
                                        }
                                    }}
                                >
                                    Approve Request
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Close />}
                                    onClick={handleReject}
                                    sx={{
                                        borderColor: '#EF4444',
                                        color: '#EF4444',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#DC2626',
                                            bgcolor: 'transparent',
                                        }
                                    }}
                                >
                                    Reject Request
                                </Button>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem', mt: 1 }}>
                                    Taking an action will notify the requester via email
                                </Typography>
                            </Box>
                        )}

                        {requestDetail.status !== 'Pending' && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: '8px' }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                    This request has been {requestDetail.status.toLowerCase()}
                                </Typography>
                                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                                    No further actions are required
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                            Related Information
                        </Typography>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Environment</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{requestDetail.environment}</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Requires Restart</Typography>
                            <Typography sx={{ fontWeight: 500 }}>No</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>Estimated Downtime</Typography>
                            <Typography sx={{ fontWeight: 500 }}>None</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApprovalDetail; 