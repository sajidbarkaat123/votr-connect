import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, TextField, Checkbox, FormHelperText } from '@mui/material';
import TimePicker from '@/components/TimePicker';
import { useForm, Controller } from 'react-hook-form';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

export interface ScheduleData {
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    time: string;
    timezone: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    archiveAfterTransfer: boolean;
    retryOnFailure: boolean;
    retryInterval?: number;
    retryCount?: number;
}

export interface ScheduleHandle {
    validate: () => Promise<boolean>;
    getData: () => ScheduleData;
}

interface ScheduleProps {
    onDataChange?: (data: ScheduleData) => void;
}

const Schedule = forwardRef<ScheduleHandle, ScheduleProps>(({ onDataChange }, ref) => {
    const { control, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm<ScheduleData>({
        defaultValues: {
            frequency: 'Daily',
            time: '02:00',
            timezone: 'UTC',
            dayOfWeek: 1, // Monday by default
            dayOfMonth: 1,
            archiveAfterTransfer: true,
            retryOnFailure: false,
            retryInterval: 30,
            retryCount: 3
        },
        mode: 'onChange'
    });

    // Watch fields for conditional rendering
    const frequency = watch('frequency');
    const retryOnFailure = watch('retryOnFailure');

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        validate: async () => {
            return trigger();
        },
        getData: () => {
            return getValues();
        }
    }));

    // Handle form data changes
    const onFormChange = () => {
        if (onDataChange) {
            handleSubmit((data) => {
                onDataChange(data);
            })();
        }
    };

    // Validate and convert time
    const validateTime = (value: string) => {
        if (!value) return "Time is required";

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(value)) {
            return "Invalid time format. Use HH:MM (24-hour format)";
        }

        return true;
    };

    // Generate day of month options (1-31)
    const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <Box onChange={onFormChange}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up the schedule for file transfers
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="frequency"
                        control={control}
                        rules={{ required: "Frequency is required" }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.frequency}>
                                <InputLabel>Frequency</InputLabel>
                                <Select {...field}>
                                    <MenuItem value="Daily">Daily</MenuItem>
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                </Select>
                                {errors.frequency && (
                                    <FormHelperText>{errors.frequency.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>

                {/* Conditional fields based on frequency */}
                {frequency === 'Weekly' && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="dayOfWeek"
                            control={control}
                            rules={{ required: "Day of week is required" }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.dayOfWeek}>
                                    <InputLabel>Day of Week</InputLabel>
                                    <Select {...field}>
                                        <MenuItem value={1}>Monday</MenuItem>
                                        <MenuItem value={2}>Tuesday</MenuItem>
                                        <MenuItem value={3}>Wednesday</MenuItem>
                                        <MenuItem value={4}>Thursday</MenuItem>
                                        <MenuItem value={5}>Friday</MenuItem>
                                        <MenuItem value={6}>Saturday</MenuItem>
                                        <MenuItem value={0}>Sunday</MenuItem>
                                    </Select>
                                    {errors.dayOfWeek && (
                                        <FormHelperText>{errors.dayOfWeek.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                )}

                {frequency === 'Monthly' && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="dayOfMonth"
                            control={control}
                            rules={{
                                required: "Day of month is required",
                                min: { value: 1, message: "Must be between 1-31" },
                                max: { value: 31, message: "Must be between 1-31" }
                            }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.dayOfMonth}>
                                    <InputLabel>Day of Month</InputLabel>
                                    <Select {...field}>
                                        {daysOfMonth.map(day => (
                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.dayOfMonth && (
                                        <FormHelperText>{errors.dayOfMonth.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <Controller
                        name="time"
                        control={control}
                        rules={{
                            required: "Time is required",
                            validate: validateTime
                        }}
                        render={({ field }) => (
                            <TimePicker
                                label="Time"
                                required
                                value={field.value}
                                onChangeValue={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name="timezone"
                        control={control}
                        rules={{ required: "Timezone is required" }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.timezone}>
                                <InputLabel>Timezone</InputLabel>
                                <Select {...field}>
                                    <MenuItem value="UTC">UTC</MenuItem>
                                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                                    <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                                    <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                                    <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                                    <MenuItem value="Europe/London">London (GMT)</MenuItem>
                                    <MenuItem value="Europe/Paris">Central European Time (CET)</MenuItem>
                                    <MenuItem value="Asia/Tokyo">Japan Standard Time (JST)</MenuItem>
                                    <MenuItem value="Australia/Sydney">Australian Eastern Time (AET)</MenuItem>
                                    <MenuItem value="local">Browser Local Time</MenuItem>
                                </Select>
                                {errors.timezone && (
                                    <FormHelperText>{errors.timezone.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="archiveAfterTransfer"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Post-Processing: Archive file after transfer"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="retryOnFailure"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Retry on failure"
                            />
                        )}
                    />
                </Grid>

                {retryOnFailure && (
                    <>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="retryInterval"
                                control={control}
                                rules={{
                                    required: "Retry interval is required",
                                    min: { value: 1, message: "Minimum 1 minute" },
                                    max: { value: 1440, message: "Maximum 1440 minutes (24 hours)" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Retry Interval (minutes)"
                                        type="number"
                                        error={!!errors.retryInterval}
                                        helperText={errors.retryInterval?.message}
                                        InputProps={{ inputProps: { min: 1, max: 1440 } }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="retryCount"
                                control={control}
                                rules={{
                                    required: "Retry count is required",
                                    min: { value: 1, message: "Minimum 1 retry" },
                                    max: { value: 10, message: "Maximum 10 retries" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Maximum Retry Count"
                                        type="number"
                                        error={!!errors.retryCount}
                                        helperText={errors.retryCount?.message}
                                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                                    />
                                )}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
});

export default Schedule; 