import { Box, Grid2, TextField, Button, Typography, FormHelperText } from "@mui/material";
import { Card } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface CompanyFormProps {
    onSubmit: (data: any) => void;
}

// Form field types
interface CompanyFormData {
    companyName: string;
    industry: string;
    address: string;
    fullName: string;
    email: string;
}

// Validation schema
const schema = yup.object({
    companyName: yup.string().required("Company name is required"),
    industry: yup.string().required("Industry is required"),
    address: yup.string().required("Address is required"),
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email format").required("Email is required")
}).required();

const CompanyForm = ({ onSubmit }: CompanyFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            companyName: "",
            industry: "",
            address: "",
            fullName: "",
            email: ""
        }
    });

    const onFormSubmit = (data: CompanyFormData) => {
        onSubmit(data);
    };

    // Common text field styles
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
                borderColor: '#2563EB',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#6B7280',
        }
    };

    return (
        <Card>
            <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        mb: 3,
                        color: "#111827"
                    }}
                >
                    Company Information
                </Typography>

                <Grid2 container spacing={3}>
                    <Grid2 component="div" size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            {...register("companyName")}
                            error={!!errors.companyName}
                            sx={textFieldStyles}
                        />
                        {errors.companyName && (
                            <FormHelperText error>{errors.companyName.message}</FormHelperText>
                        )}
                    </Grid2>
                    <Grid2 component="div" size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Industry"
                            {...register("industry")}
                            error={!!errors.industry}
                            sx={textFieldStyles}
                        />
                        {errors.industry && (
                            <FormHelperText error>{errors.industry.message}</FormHelperText>
                        )}
                    </Grid2>
                    <Grid2 component="div" size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address"
                            {...register("address")}
                            error={!!errors.address}
                            sx={textFieldStyles}
                        />
                        {errors.address && (
                            <FormHelperText error>{errors.address.message}</FormHelperText>
                        )}
                    </Grid2>
                </Grid2>

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        mb: 3,
                        mt: 4,
                        color: "#111827"
                    }}
                >
                    Primary Contact
                </Typography>

                <Grid2 container spacing={3}>
                    <Grid2 component="div" size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            {...register("fullName")}
                            error={!!errors.fullName}
                            sx={textFieldStyles}
                        />
                        {errors.fullName && (
                            <FormHelperText error>{errors.fullName.message}</FormHelperText>
                        )}
                    </Grid2>
                    <Grid2 component="div" size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            {...register("email")}
                            error={!!errors.email}
                            sx={textFieldStyles}
                        />
                        {errors.email && (
                            <FormHelperText error>{errors.email.message}</FormHelperText>
                        )}
                    </Grid2>
                </Grid2>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#2563EB',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: '#1D4ED8',
                            },
                            px: 4
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default CompanyForm; 