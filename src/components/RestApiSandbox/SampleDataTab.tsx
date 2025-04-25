import { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { cardContainerStyles, headingStyles, textFieldStyles } from '@/utils/styles';

interface DataSet {
    title: string;
    color: string;
    features: string[];
}

const sampleDataSets: DataSet[] = [
    {
        title: 'Shareholders',
        color: '#3B82F6',
        features: [
            '1,000 sample records',
            'Includes positions & account data',
            'Updated weekly'
        ]
    },
    {
        title: 'Broker Accounts',
        color: '#9333EA',
        features: [
            '500 sample records',
            'Multiple account types',
            'Includes regulatory data'
        ]
    },
    {
        title: 'Transactions',
        color: '#F97316',
        features: [
            '2,500 sample records',
            'Various transaction types',
            '6 months of history'
        ]
    },
    {
        title: 'Positions',
        color: '#22C55E',
        features: [
            '1,500 sample records',
            'Diverse security types',
            'Includes pricing data'
        ]
    }
];

const SampleDataTab = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDataSets = searchQuery.trim() === ''
        ? sampleDataSets
        : sampleDataSets.filter(dataset =>
            dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dataset.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    return (
        <Box sx={cardContainerStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={headingStyles}>
                    Sample Data Sets
                </Typography>
                <TextField
                    placeholder="Search datasets..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '300px',
                        ...textFieldStyles
                    }}
                />
            </Box>

            {filteredDataSets.length === 0 ? (
                <Box sx={{
                    py: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#6B7280',
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" sx={{ mb: 1, color: '#374151' }}>
                        No matching datasets found
                    </Typography>
                    <Typography>
                        Try adjusting your search criteria or explore other available datasets.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 3
                }}>
                    {filteredDataSets.map((dataset, index) => (
                        <Box
                            key={index}
                            sx={{
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: dataset.color,
                                    color: 'white',
                                    p: 2,
                                    fontWeight: 500
                                }}
                            >
                                {dataset.title}
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {dataset.features.map((feature, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#6B7280',
                                            fontSize: '0.875rem',
                                            mb: idx < dataset.features.length - 1 ? 1 : 0
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                bgcolor: '#D1D5DB',
                                                mr: 2
                                            }}
                                        />
                                        {feature}
                                    </Box>
                                ))}
                                <Button
                                    sx={{
                                        mt: 3,
                                        color: dataset.color,
                                        textTransform: 'none',
                                        p: 0,
                                        '&:hover': {
                                            bgcolor: 'transparent',
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    View & Use
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SampleDataTab; 