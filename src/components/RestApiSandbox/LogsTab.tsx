import { useState } from 'react';
import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { cardContainerStyles, getStatusBgColor, getStatusColor, headingStyles, outlinedButtonStyles, primaryButtonStyles, textFieldStyles } from './utils';

interface LogEntry {
    timestamp: string;
    method: string;
    endpoint: string;
    status: number;
    duration: string;
}

const mockLogs: LogEntry[] = [
    { timestamp: 'Apr 8, 2025 10:45:12ET', method: 'GET', endpoint: '/shareholders', status: 200, duration: '245ms' },
    { timestamp: 'Apr 8, 2025 10:44:37POST', method: 'POST', endpoint: '/auth/token', status: 200, duration: '312ms' },
    { timestamp: 'Apr 8, 2025 10:40:23ET', method: 'GET', endpoint: '/shareholders/123', status: 404, duration: '98ms' },
    { timestamp: 'Apr 8, 2025 10:38:57ET', method: 'GET', endpoint: '/shareholders?limit=50', status: 200, duration: '267ms' },
    { timestamp: 'Apr 8, 2025 10:35:14POST', method: 'POST', endpoint: '/auth/token', status: 401, duration: '156ms' },
];

const LogsTab = () => {
    const [filterValue, setFilterValue] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs] = useState(28);

    const handleViewDetails = () => {
        console.log('Viewing log details...');
    };

    const handleDownloadLogs = () => {
        console.log('Downloading logs...');
    };

    return (
        <Box sx={cardContainerStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={headingStyles}>
                    API Call Logs
                </Typography>
                <TextField
                    select
                    size="small"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    sx={{
                        minWidth: 120,
                        ...textFieldStyles
                    }}
                >
                    <MenuItem value="All">Filter by: All</MenuItem>
                    <MenuItem value="Success">Success</MenuItem>
                    <MenuItem value="Error">Error</MenuItem>
                </TextField>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#374151', fontWeight: 500, pl: 0 }}>Timestamp</TableCell>
                        <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Method</TableCell>
                        <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Endpoint</TableCell>
                        <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Status</TableCell>
                        <TableCell sx={{ color: '#374151', fontWeight: 500 }}>Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockLogs.map((log, index) => (
                        <TableRow key={index} hover>
                            <TableCell sx={{ pl: 0 }}>{log.timestamp}</TableCell>
                            <TableCell>{log.method}</TableCell>
                            <TableCell>{log.endpoint}</TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '16px',
                                        bgcolor: getStatusBgColor(log.status),
                                        color: getStatusColor(log.status),
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {log.status}
                                </Box>
                            </TableCell>
                            <TableCell>{log.duration}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    Showing 1-5 of {totalLogs} logs
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {[1, 2, 3].map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'contained' : 'outlined'}
                            onClick={() => setCurrentPage(page)}
                            sx={{
                                minWidth: '40px',
                                height: '40px',
                                p: 0,
                                borderColor: '#E5E7EB',
                                color: currentPage === page ? 'white' : '#374151',
                                bgcolor: currentPage === page ? '#3B82F6' : 'transparent',
                                '&:hover': {
                                    bgcolor: currentPage === page ? '#2563EB' : 'transparent',
                                    borderColor: '#D1D5DB',
                                },
                            }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleViewDetails}
                    sx={primaryButtonStyles}
                >
                    View Details
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleDownloadLogs}
                    sx={outlinedButtonStyles}
                >
                    Download Logs
                </Button>
            </Box>
        </Box>
    );
};

export default LogsTab; 