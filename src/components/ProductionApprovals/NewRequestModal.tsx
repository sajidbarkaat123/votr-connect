import {
    Modal,
    Box,
    Typography,
    Paper
} from '@mui/material';
import { RequestFormData } from './FormSchema';
import RequestForm from './RequestForm';

interface NewRequestModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RequestFormData) => void;
}

// Export the existing interface for backward compatibility
export type NewRequestData = RequestFormData;

const NewRequestModal = ({ open, onClose, onSubmit }: NewRequestModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="new-request-modal"
        >
            <Paper
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
                    maxWidth: '700px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'white',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4
                }}
            >
                <Typography
                    variant="h6"
                    id="new-request-modal"
                    sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#111827',
                        mb: 3
                    }}
                >
                    Create New Request
                </Typography>

                <RequestForm
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    submitLabel="Create Request"
                    isModal={true}
                />
            </Paper>
        </Modal>
    );
};

export default NewRequestModal; 