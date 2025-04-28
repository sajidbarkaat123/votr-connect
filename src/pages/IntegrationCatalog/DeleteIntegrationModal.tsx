import { Box, Typography, Stack } from "@mui/material";
import { CustomButton } from "@/components";
import Modal from '@/components/Modal';

interface DeleteIntegrationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    integration?: { name?: string } | null;
    loading?: boolean;
}

const DeleteIntegrationModal = ({ open, onClose, onConfirm, integration, loading }: DeleteIntegrationModalProps) => (
    <Modal open={open} onClose={onClose}>
        <Box>
            <Typography fontSize={20} fontWeight={600} mb={1}>
                Delete Integration
            </Typography>
            <Typography fontSize={15} color="#8C8E9C" fontWeight={400} mb={3}>
                Are you sure you want to delete <b>{integration?.name}</b>?
            </Typography>
            <Stack spacing={2} direction="row" pt={2}>
                <CustomButton
                    title="Cancel"
                    size="large"
                    onClick={onClose}
                    sx={{ border: "1px solid #E6E6E9", flex: 1, color: "black" }}
                    variant="outlined"
                    color="inherit"
                />
                <CustomButton
                    size="large"
                    title={loading ? "Deleting..." : "Confirm"}
                    color={"error"}
                    onClick={onConfirm}
                    sx={{ flex: 1, color: "#FFFFFF" }}
                    disabled={loading}
                />
            </Stack>
        </Box>
    </Modal>
);

export default DeleteIntegrationModal; 