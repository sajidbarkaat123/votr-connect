import { Box, Button, Typography } from "@mui/material";
interface IntegrationCardProps {
    title: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    onClick: () => void;
}

const IntegrationCard = ({ title, description, buttonText, buttonColor, onClick }: IntegrationCardProps) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2
    }}>
        <Button
            fullWidth
            sx={{
                bgcolor: buttonColor,
                color: 'white',
                py: 2,
                fontSize: '1.125rem',
                textTransform: 'none',
                '&:hover': {
                    bgcolor: buttonColor,
                    opacity: 0.9
                }
            }}
        >
            {title}
        </Button>
        <Box sx={{
            bgcolor: '#F3F4F6',
            p: 3,
            borderRadius: '8px',
            width: '100%'
        }}>
            <Typography sx={{ color: '#4B5563', fontSize: '0.875rem' }}>
                {description}
            </Typography>
        </Box>
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                bgcolor: buttonColor,
                color: 'white',
                textTransform: 'none',
                px: 4,
                '&:hover': {
                    bgcolor: buttonColor,
                    opacity: 0.9
                }
            }}
        >
            {buttonText}
        </Button>
    </Box>
);

export default IntegrationCard;