import { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Chip, Avatar, Switch } from "@mui/material";
import { useNavigate } from 'react-router';
import NewRequestModal from './NewRequestModal';
import { RequestFormData } from './FormSchema';
import TabPanel from '@/components/TabPanel';
import DynamicTable from '@/components/DynamicTable/DynamicTable';
import { IBase } from '@/types/global';

interface ApprovalRequest extends IBase {
    id: string;
    name: string;
    type: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedBy: string;
    requestedOn: string;
    environment: string;
}

const ProductionApprovals = () => {
    const [filterValue, setFilterValue] = useState('All');
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
    const navigate = useNavigate();

    const mockApprovalRequests: ApprovalRequest[] = [
        {
            id: 'REQ-001',
            name: 'Shareholder API Production Release',
            type: 'API Release',
            status: 'Pending',
            requestedBy: 'Alex Johnson',
            requestedOn: 'Apr 8, 2025',
            environment: 'Production'
        },
        {
            id: 'REQ-002',
            name: 'Transaction Processor Update',
            type: 'Service Update',
            status: 'Approved',
            requestedBy: 'Samantha Chen',
            requestedOn: 'Apr 7, 2025',
            environment: 'Production'
        },
        {
            id: 'REQ-003',
            name: 'Account Management API Change',
            type: 'API Change',
            status: 'Rejected',
            requestedBy: 'Michael Brown',
            requestedOn: 'Apr 6, 2025',
            environment: 'Production'
        },
        {
            id: 'REQ-004',
            name: 'Data Export Service Deployment',
            type: 'Service Deployment',
            status: 'Pending',
            requestedBy: 'Emma Wilson',
            requestedOn: 'Apr 6, 2025',
            environment: 'Production'
        },
    ];

    const handleApprove = (id: string) => {
        console.log(`Approving request ${id}`);
    };

    const handleReject = (id: string) => {
        console.log(`Rejecting request ${id}`);
    };

    const handleViewDetails = (id: string) => {
        console.log(`Viewing details for request ${id}`);
        navigate(`/production-approvals/${id}`);
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

    const handleNewRequest = (data: RequestFormData) => {
        console.log('New request data:', data);
        // In a real app, you would make an API call here to create the request
        // Then refresh the list of requests
    };

    // DynamicTable columns for Pending Approvals
    const pendingApprovalColumns = [
        { key: 'id', name: 'ID', align: 'left' as const },
        {
            key: 'name',
            name: 'Request',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Box>
                    <Typography sx={{ fontWeight: 500, color: '#111827' }}>
                        {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {item.environment}
                    </Typography>
                </Box>
            )
        },
        { key: 'type', name: 'Type', align: 'left' as const },
        {
            key: 'status',
            name: 'Status',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Chip
                    label={item.status}
                    sx={{
                        bgcolor: getStatusBgColor(item.status),
                        color: getStatusColor(item.status),
                        fontSize: '0.75rem',
                        fontWeight: 500
                    }}
                />
            )
        },
        {
            key: 'requestedBy',
            name: 'Requester',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
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
                        {item.requestedBy.split(' ').map(name => name[0]).join('')}
                    </Avatar>
                    {item.requestedBy}
                </Box>
            )
        },
        { key: 'requestedOn', name: 'Date', align: 'left' as const },
        {
            key: 'action',
            name: 'Actions',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(item.id)}
                        sx={{
                            color: '#3B82F6',
                            borderColor: '#D1D5DB',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#9CA3AF',
                            }
                        }}
                    >
                        View
                    </Button>
                    {item.status === 'Pending' && (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleApprove(item.id)}
                                sx={{
                                    bgcolor: '#22C55E',
                                    color: 'white',
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: '#16A34A',
                                    }
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleReject(item.id)}
                                sx={{
                                    bgcolor: '#EF4444',
                                    color: 'white',
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: '#DC2626',
                                    }
                                }}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </Box>
            )
        },
    ];

    // DynamicTable columns for Approval History
    const historyColumns = [
        { key: 'id', name: 'Request ID', align: 'left' as const },
        { key: 'name', name: 'Name', align: 'left' as const },
        {
            key: 'status',
            name: 'Status',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Chip
                    label={item.status}
                    sx={{
                        bgcolor: getStatusBgColor(item.status),
                        color: getStatusColor(item.status),
                        fontSize: '0.75rem',
                        fontWeight: 500
                    }}
                />
            )
        },
        {
            key: 'requestedBy',
            name: 'Approved/Rejected By',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
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
                        {item.requestedBy.split(' ').map(name => name[0]).join('')}
                    </Avatar>
                    {item.requestedBy}
                </Box>
            )
        },
        { key: 'requestedOn', name: 'Date', align: 'left' as const },
        {
            key: 'comments',
            name: 'Comments',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Typography
                    sx={{
                        color: '#6B7280',
                        fontSize: '0.875rem',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {item.status === 'Approved' ? 'Approved with standard checks' : 'Changes required in implementation'}
                </Typography>
            )
        },
        {
            key: 'action',
            name: 'Actions',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Button
                    size="small"
                    variant="text"
                    onClick={() => handleViewDetails(item.id)}
                    sx={{
                        color: '#3B82F6',
                        textTransform: 'none',
                    }}
                >
                    View Details
                </Button>
            )
        },
    ];

    // DynamicTable columns for My Requests
    const myRequestsColumns = [
        { key: 'id', name: 'Request ID', align: 'left' as const },
        { key: 'name', name: 'Name', align: 'left' as const },
        { key: 'type', name: 'Type', align: 'left' as const },
        {
            key: 'status',
            name: 'Status',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Chip
                    label={item.status}
                    sx={{
                        bgcolor: getStatusBgColor(item.status),
                        color: getStatusColor(item.status),
                        fontSize: '0.75rem',
                        fontWeight: 500
                    }}
                />
            )
        },
        { key: 'requestedOn', name: 'Submitted On', align: 'left' as const },
        {
            key: 'action',
            name: 'Actions',
            align: 'left' as const,
            component: (item: ApprovalRequest) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => handleViewDetails(item.id)}
                        sx={{
                            color: '#3B82F6',
                            textTransform: 'none',
                        }}
                    >
                        View Details
                    </Button>
                    {item.status === 'Pending' && (
                        <Button
                            size="small"
                            variant="text"
                            onClick={() => console.log('Cancel request:', item.id)}
                            sx={{
                                color: '#EF4444',
                                textTransform: 'none',
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            )
        },
    ];

    // Render the Pending Approvals tab content
    const renderPendingApprovalsContent = () => {
        return (
            <>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 150, mr: 2 }}
                        >
                            <MenuItem value="All">All Requests</MenuItem>
                            <MenuItem value="API Release">API Release</MenuItem>
                            <MenuItem value="Service Update">Service Update</MenuItem>
                            <MenuItem value="Configuration Change">Configuration Change</MenuItem>
                        </TextField>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/production-approvals/create')}
                        sx={{
                            bgcolor: '#3B82F6',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#2563EB',
                            }
                        }}
                    >
                        New Request
                    </Button>
                </Box>

                <Box sx={{
                    bgcolor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    p: 4
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#111827',
                            mb: 3
                        }}
                    >
                        Pending Approval Requests
                    </Typography>

                    <DynamicTable
                        data={mockApprovalRequests}
                        columns={pendingApprovalColumns}
                        isLoading={false}
                        limit={10}
                        page={1}
                        total={mockApprovalRequests.length}
                        contentIdKey="id"
                        hidePagination={true}
                        containerStyles={{ border: 'none' }}
                    />
                </Box>
            </>
        );
    };

    // Render the Approval History tab content
    const renderApprovalHistoryContent = () => {
        return (
            <Box sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                p: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#111827'
                        }}
                    >
                        Approval History
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            select
                            size="small"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            sx={{
                                minWidth: 120,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#D1D5DB',
                                    },
                                },
                            }}
                        >
                            <MenuItem value="All">Status: All</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </TextField>
                        <TextField
                            type="date"
                            size="small"
                            label="From Date"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                    },
                                },
                            }}
                        />
                        <TextField
                            type="date"
                            size="small"
                            label="To Date"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>

                <DynamicTable
                    data={mockApprovalRequests}
                    columns={historyColumns}
                    isLoading={false}
                    limit={10}
                    page={1}
                    total={mockApprovalRequests.length}
                    contentIdKey="id"
                    hidePagination={true}
                    containerStyles={{ border: 'none' }}
                />
            </Box>
        );
    };

    // Render the My Requests tab content
    const renderMyRequestsContent = () => {
        return (
            <Box sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                p: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#111827'
                        }}
                    >
                        My Requests
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/production-approvals/create')}
                            sx={{
                                bgcolor: '#3B82F6',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#2563EB',
                                },
                            }}
                        >
                            New Request
                        </Button>
                    </Box>
                </Box>

                <DynamicTable
                    data={mockApprovalRequests}
                    columns={myRequestsColumns}
                    isLoading={false}
                    limit={10}
                    page={1}
                    total={mockApprovalRequests.length}
                    contentIdKey="id"
                    hidePagination={true}
                    containerStyles={{ border: 'none' }}
                />
            </Box>
        );
    };

    // Render the Settings tab content
    const renderSettingsContent = () => {
        return (
            <Box sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                p: 4
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#111827',
                        mb: 4
                    }}
                >
                    Approval Settings
                </Typography>

                <Box sx={{ maxWidth: 600 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#111827',
                                mb: 2
                            }}
                        >
                            Approval Requirements
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Required Approvers"
                            defaultValue="2"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                    },
                                },
                            }}
                        >
                            <MenuItem value="1">1 Approver</MenuItem>
                            <MenuItem value="2">2 Approvers</MenuItem>
                            <MenuItem value="3">3 Approvers</MenuItem>
                        </TextField>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#111827',
                                mb: 2
                            }}
                        >
                            Notification Settings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: '#374151' }}>
                                    Email notifications for new requests
                                </Typography>
                                <Switch defaultChecked />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: '#374151' }}>
                                    Email notifications for request updates
                                </Typography>
                                <Switch defaultChecked />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: '#374151' }}>
                                    Slack notifications
                                </Typography>
                                <Switch />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#111827',
                                mb: 2
                            }}
                        >
                            Auto-Approval Rules
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: '#374151' }}>
                                    Auto-approve minor version updates
                                </Typography>
                                <Switch />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: '#374151' }}>
                                    Auto-approve documentation changes
                                </Typography>
                                <Switch />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#3B82F6',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#2563EB',
                                },
                            }}
                        >
                            Save Settings
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    };

    // Define tabs
    const tabs = [
        {
            label: "Pending Approvals",
            content: renderPendingApprovalsContent()
        },
        {
            label: "Approval History",
            content: renderApprovalHistoryContent()
        },
        {
            label: "My Requests",
            content: renderMyRequestsContent()
        },
        {
            label: "Settings",
            content: renderSettingsContent()
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
                Production Approvals
            </Typography>
            <Typography
                sx={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    mb: 4
                }}
            >
                Review and approve requests for production deployments.
            </Typography>

            <TabPanel tabs={tabs} />

            <NewRequestModal
                open={isNewRequestModalOpen}
                onClose={() => setIsNewRequestModalOpen(false)}
                onSubmit={handleNewRequest}
            />
        </Box>
    );
};

export default ProductionApprovals; 