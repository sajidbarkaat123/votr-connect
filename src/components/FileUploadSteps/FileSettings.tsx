import { Box, Typography, TextField, Grid, Button, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, Tooltip, IconButton, Paper } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import { useForm, Controller } from 'react-hook-form';
import { useState, forwardRef, useImperativeHandle } from 'react';

export interface FileSettingsData {
    integrationName: string;
    fileFormat: string;
    fileNamingPattern: string;
    includeHeaderRow: boolean;
    sampleFile: File | null;
}

export interface FileSettingsHandle {
    validate: () => Promise<boolean>;
    getData: () => FileSettingsData;
}

interface FileSettingsProps {
    onDataChange?: (data: FileSettingsData) => void;
}

const FileSettings = forwardRef<FileSettingsHandle, FileSettingsProps>(({ onDataChange }, ref) => {
    const [sampleFile, setSampleFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const { control, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm<FileSettingsData>({
        defaultValues: {
            integrationName: 'Daily Shareholder File Upload',
            fileFormat: 'CSV',
            fileNamingPattern: 'shareholders_YYYYMMDD',
            includeHeaderRow: true,
            sampleFile: null
        },
        mode: 'onChange'
    });

    const selectedFileFormat = watch('fileFormat');

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        validate: () => {
            return trigger();
        },
        getData: () => {
            return {
                ...getValues(),
                sampleFile
            };
        }
    }));

    // Handle file upload and validation
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (!file) return;

        // Validate file format matches selected format
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const validExtensions = {
            'CSV': ['csv'],
            'Excel': ['xlsx', 'xls'],
            'JSON': ['json'],
            'XML': ['xml']
        };

        const isValidFormat = validExtensions[selectedFileFormat as keyof typeof validExtensions]?.includes(fileExtension);

        if (!isValidFormat) {
            alert(`Please upload a ${selectedFileFormat} file`);
            event.target.value = '';
            return;
        }

        setSampleFile(file);

        // Generate preview for text-based files
        if (['csv', 'json', 'xml', 'txt'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                // Limit preview to first 10 lines
                const lines = content.split('\n').slice(0, 10).join('\n');
                setFilePreview(lines);
            };
            reader.readAsText(file);
        } else {
            setFilePreview(`File preview not available for ${fileExtension} format`);
        }
    };

    // Notify parent of data changes
    const onFormChange = () => {
        if (onDataChange) {
            handleSubmit((data) => {
                onDataChange({ ...data, sampleFile });
            })();
        }
    };

    const fileNamingPatternTooltip = (
        <Box>
            <Typography variant="body2">Examples:</Typography>
            <Typography variant="body2">• shareholders_YYYYMMDD</Typography>
            <Typography variant="body2">• transactions_YYYYMMDD_HHMMSS</Typography>
            <Typography variant="body2">• data_YYYY-MM-DD</Typography>
        </Box>
    );

    const csvFormattingTooltip = (
        <Box>
            <Typography variant="body2">CSV Format Guidelines:</Typography>
            <Typography variant="body2">• UTF-8 encoding</Typography>
            <Typography variant="body2">• Comma delimiter (,)</Typography>
            <Typography variant="body2">• Double quotes (") for text fields</Typography>
            <Typography variant="body2">• First row as header (optional)</Typography>
        </Box>
    );

    const validateFileNamingPattern = (value: string) => {
        // Check for date placeholders
        const hasDatePlaceholder = /YYYY|MM|DD|HH|mm|SS/g.test(value);

        // Check for invalid characters
        const hasInvalidChars = /[<>:"|?*]/g.test(value);

        if (hasInvalidChars) return "Pattern contains invalid characters: < > : \" | ? *";
        if (!hasDatePlaceholder) return "Pattern must include at least one date placeholder (YYYY, MM, DD)";

        return true;
    };

    return (
        <Box onChange={onFormChange}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure File Upload Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up scheduled file transfers via SFTP/FTPS
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="integrationName"
                        control={control}
                        rules={{
                            required: "Integration name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Integration Name"
                                required
                                error={!!errors.integrationName}
                                helperText={errors.integrationName?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="fileFormat"
                        control={control}
                        rules={{ required: "File format is required" }}
                        render={({ field }) => (
                            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.fileFormat}>
                                <InputLabel>File Format</InputLabel>
                                <Select {...field}>
                                    <MenuItem value="CSV">CSV</MenuItem>
                                    <MenuItem value="Excel">Excel (.xlsx, .xls)</MenuItem>
                                    <MenuItem value="JSON">JSON</MenuItem>
                                    <MenuItem value="XML">XML</MenuItem>
                                </Select>
                                {errors.fileFormat && (
                                    <Typography variant="caption" color="error">
                                        {errors.fileFormat.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="fileNamingPattern"
                        control={control}
                        rules={{
                            required: "File naming pattern is required",
                            validate: validateFileNamingPattern
                        }}
                        render={({ field }) => (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="File Naming Pattern"
                                    error={!!errors.fileNamingPattern}
                                    helperText={errors.fileNamingPattern?.message}
                                    sx={{ mb: 2 }}
                                />
                                <Tooltip title={fileNamingPatternTooltip} arrow placement="top">
                                    <IconButton size="small" sx={{ mt: 1, ml: 1 }}>
                                        <HelpOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="includeHeaderRow"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Include Header Row"
                            />
                        )}
                    />
                    {selectedFileFormat === 'CSV' && (
                        <Tooltip title={csvFormattingTooltip} arrow placement="right">
                            <IconButton size="small">
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                    >
                        Upload Sample
                        <input
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                            accept={
                                selectedFileFormat === 'CSV' ? '.csv' :
                                    selectedFileFormat === 'Excel' ? '.xlsx,.xls' :
                                        selectedFileFormat === 'JSON' ? '.json' :
                                            selectedFileFormat === 'XML' ? '.xml' : ''
                            }
                        />
                    </Button>
                    {sampleFile && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            File uploaded: {sampleFile.name}
                        </Typography>
                    )}
                </Grid>
                {filePreview && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>File Preview:</Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                maxHeight: '200px',
                                overflow: 'auto',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {filePreview}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
});

export default FileSettings; 