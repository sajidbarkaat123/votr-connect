import { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import ToggleSwitch from '../ToggleSwitch';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Password validation schema
const passwordSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

type PasswordFormData = yup.InferType<typeof passwordSchema>;

const SecuritySettings = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema),
        mode: 'onBlur'
    });

    const onSubmit = (data: PasswordFormData) => {
        // Add password update logic here
        console.log('Updating password...', data);
    };

    const handleConfigureTwoFactor = () => {
        // Add 2FA configuration logic here
        console.log('Configuring 2FA...');
    };

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1
                }}
            >
                Account Management
            </Typography>
            <Typography
                sx={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    mb: 4
                }}
            >
                Manage your account settings and team members.
            </Typography>

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
                    Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        maxWidth: '100%'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                mb: 1
                            }}
                        >
                            Current Password
                        </Typography>
                        <TextField
                            type="password"
                            {...register('currentPassword')}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword?.message}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            sx={{
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
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                mb: 1
                            }}
                        >
                            New Password
                        </Typography>
                        <TextField
                            type="password"
                            {...register('newPassword')}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            sx={{
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
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                mb: 1
                            }}
                        >
                            Confirm New Password
                        </Typography>
                        <TextField
                            type="password"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            sx={{
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
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#3B82F6',
                            '&:hover': { bgcolor: '#2563EB' },
                            textTransform: 'none',
                            width: 'fit-content',
                            px: 4,
                            py: 1,
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}
                    >
                        Update Password
                    </Button>
                </Box>

                <Box sx={{
                    mt: 4,
                    pt: 4,
                    borderTop: '1px solid #E5E7EB'
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#111827'
                                }}
                            >
                                Two-Factor Authentication
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <ToggleSwitch
                                    checked={twoFactorEnabled}
                                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                />
                                <Typography sx={{
                                    color: '#111827',
                                    fontSize: '0.875rem'
                                }}>
                                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            onClick={handleConfigureTwoFactor}
                            sx={{
                                color: '#6B7280',
                                bgcolor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#F3F4F6',
                                    borderColor: '#D1D5DB'
                                },
                                px: 3,
                                py: 1,
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            Configure
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SecuritySettings; 