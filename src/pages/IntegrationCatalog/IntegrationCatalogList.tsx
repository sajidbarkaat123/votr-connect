import { useState, useMemo, useContext } from "react";
import { Box, Button, Stack, Chip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DynamicTable from "@/components/DynamicTable";
import { useGetFileUploadIntegrationQuery, useGetGraphQLIntegrationQuery, useGetRestAPIIntegrationQuery, useDeleteRestApiIntegrationMutation, useDeleteGraphqlIntegrationMutation, useDeleteFileUploadIntegrationMutation } from "@/services/integration-catalog";
import { TYPE_OPTIONS } from "@/constants/integration-catalog";
import { CustomButton } from "@/components";
import DeleteIntegrationModal from './DeleteIntegrationModal';
import { MessageContext, IMessageContext } from "@/context/message-context";
import { format } from 'date-fns';
import { useNavigate } from "react-router";

const PAGE_SIZE = 10;

const IntegrationCatalogList = () => {

    const navigate = useNavigate();
    const { data: restapiList = [], isLoading, refetch: refetchRest } = useGetRestAPIIntegrationQuery();
    const { data: graphqlList = [], isLoading: graphqlLoading, refetch: refetchGraphql } = useGetGraphQLIntegrationQuery();
    const { data: fileUploadList = [], isLoading: fileUploadLoading, refetch: refetchFileUpload } = useGetFileUploadIntegrationQuery();

    console.log(restapiList, graphqlList, fileUploadList);

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [integrationToDelete, setIntegrationToDelete] = useState<any>(null);
    const [page, setPage] = useState(1);

    const [deleteRestApiIntegration, { isLoading: isDeletingRest }] = useDeleteRestApiIntegrationMutation();
    const [deleteGraphqlIntegration, { isLoading: isDeletingGraphql }] = useDeleteGraphqlIntegrationMutation();
    const [deleteFileUploadIntegration, { isLoading: isDeletingFile }] = useDeleteFileUploadIntegrationMutation();

    const { showSnackbar } = useContext(MessageContext) as IMessageContext;

    const integrations = useMemo(() => {
        const normalize = (arr: any[], type: string) =>
            arr.map((item: any) => ({
                id: item.id || item._id,
                name: item.name,
                type,
                status: item.status,
                lastSync: item.updatedAt ? format(new Date(item.updatedAt), 'yyyy-MM-dd') : '',
            }));
        return [
            ...normalize(restapiList, "REST API"),
            ...normalize(graphqlList, "GraphQL"),
            ...normalize(fileUploadList, "File Upload"),
        ];
    }, [restapiList, graphqlList, fileUploadList]);

    const filteredIntegrations = useMemo(() => {
        if (!selectedType) return integrations;
        return integrations.filter((i) => i.type === selectedType);
    }, [integrations, selectedType]);

    const paginatedIntegrations = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredIntegrations.slice(start, start + PAGE_SIZE);
    }, [filteredIntegrations, page]);

    useMemo(() => {
        if ((page - 1) * PAGE_SIZE >= filteredIntegrations.length) {
            setPage(1);
        }
    }, [filteredIntegrations.length]);

    const handleDelete = async () => {
        if (!integrationToDelete) return;
        try {
            if (integrationToDelete.type === 'REST API') {
                await deleteRestApiIntegration(integrationToDelete.id);
                refetchRest();
            } else if (integrationToDelete.type === 'GraphQL') {
                await deleteGraphqlIntegration(integrationToDelete.id);
                refetchGraphql();
            } else if (integrationToDelete.type === 'File Upload') {
                await deleteFileUploadIntegration(integrationToDelete.id);
                refetchFileUpload();
            }
        } catch (e) {
            showSnackbar("Failed to delete integration. Please try again.", "", "error");
        } finally {
            setDeleteModalOpen(false);
            setIntegrationToDelete(null);
        }
    };

    const handleEdit = (item: any) => {
        if (item.type === 'REST API') {
            navigate(`/integration-catalog/rest-api?id=${item.id}`);
        } else if (item.type === 'GraphQL') {
            navigate(`/integration-catalog/graphql?id=${item.id}`);
        } else if (item.type === 'File Upload') {
            navigate(`/integration-catalog/file-upload?id=${item.id}`);
        }
    };

    // Table columns
    const columns = [
        { key: "name", name: "Name", align: "left", sorting: true },
        { key: "type", name: "Type", align: "left", sorting: true },
        { key: "lastSync", name: "Last Sync", align: "left", sorting: true },
        {
            key: "status",
            name: "Status",
            align: "left",
            component: (item: any) => (
                <Chip
                    label={item.status || "N/A"}
                    sx={{
                        bgcolor: item.status === "Active" ? "#E6FFF3" : "#F3F4F6",
                        color: item.status === "Active" ? "#22C55E" : "#6B7280",
                        fontWeight: 500,
                    }}
                    size="small"
                />
            ),
        },
        {
            key: "action",
            name: "Actions",
            align: "right",
            component: (item: any) => (
                <Box>
                    <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" onClick={() => { handleEdit(item) }} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => { setIntegrationToDelete(item); setDeleteModalOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handlePageChange = (newPage: number) => setPage(newPage);

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Stack direction="row" spacing={2}>
                    {TYPE_OPTIONS.map((type) => (
                        <Button
                            key={type.value}
                            variant={selectedType === type.value ? "contained" : "outlined"}
                            onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                            sx={{ textTransform: "none" }}
                        >
                            {type.label}
                        </Button>
                    ))}
                </Stack>
                <CustomButton variant="contained" color="primary" title="New Integration" href="/integration-catalog" />
            </Stack>
            <DynamicTable
                data={paginatedIntegrations}
                columns={columns}
                isLoading={isLoading || graphqlLoading || fileUploadLoading}
                limit={PAGE_SIZE}
                page={page}
                total={filteredIntegrations.length}
                handlePageChange={handlePageChange}
                hidePagination={false}
                contentIdKey="id"
                containerStyles={{ border: "none" }}
            />
            <DeleteIntegrationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                integration={integrationToDelete}
                loading={isDeletingRest || isDeletingGraphql || isDeletingFile}
            />
        </Box>
    );
};

export default IntegrationCatalogList;