interface IIntegrationCatalog {
    id: string;
    name: string;
    path: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Authentication {
    id: string;
    name: string;
    authenticationType: "Basic" | "OAuth2" | "APIKey" | "oauth2";
    grantType: "none" | "client_credentials";
    scope: string | null;
    tokenUrl: string | null;
    apiKey: string | null;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    createdAt: string;
    updatedAt: string;
}

interface IRestApiIntegration {
    id: string;
    name: string;
    dataFormat: string;
    updateFrequency: string;
    url: string;
    advanceOptions: string;
    method: string;
    body: string;
    queryParams: Record<string, any>;
    headersParams: Record<string, any>;
    environment: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
    authenticationId: string;
    requestId: string | null;
    productionChecklistId: string | null;
    authentication: Authentication;
}

interface GraphQlSchemaDesign {
    id: string;
    type: "SDL";
    schemaDesign: string;
    createdAt: string;
    updatedAt: string;
    graphQlIntegrationId: string;
}

interface GraphQlSecurityAndComplexity {
    id: string;
    authenticationMethod: "JWT" | "APIKey" | "OAuth2";
    maxQueryDepth: number;
    maxQueryCost: number;
    rateLimit: number;
    timeout: number;
    createdAt: string;
    updatedAt: string;
    graphQlIntegrationId: string;
}

interface IGraphQlIntegration {
    id: string;
    name: string;
    url: string;
    isIntrospectionEnabled: boolean;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
    requestId: string | null;
    productionChecklistId: string | null;
    graphQlSchemaDesign: GraphQlSchemaDesign;
    graphQlSecurityAndComplexity: GraphQlSecurityAndComplexity;
}

interface FtpAuthentication {
    id: string;
    type: "password" | "ssh";
    password: string | null;
    sshKey: string | null;
    passphrase: string | null;
    createdAt: string;
    updatedAt: string;
    ftpId: string;
}

interface FtpDetails {
    id: string;
    host: string;
    port: number;
    type: "FTP" | "SFTP";
    username: string;
    createdAt: string;
    updatedAt: string;
    fileIntegrationId: string;
    ftpAuthentication: FtpAuthentication;
}

interface AmazonS3Authentication {
    id: string;
    authenticationMethod: "IAM" | "IAM Role";
    ARN: string;
    accessKey: string;
    secretKey: string;
    createdAt: string;
    updatedAt: string;
    amazonS3DetailsId: string;
}

interface AmazonS3Details {
    id: string;
    region: string;
    bucketName: string;
    folderPath: string;
    createdAt: string;
    updatedAt: string;
    fileIntegrationId: string;
    amazonS3Authentication: AmazonS3Authentication;
}

interface IFileUploadIntegration {
    id: string;
    name: string;
    fileFormat: "CSV" | "JSON" | "XML";
    fileNamePattern: string;
    isHeaderRowIncluded: boolean;
    transferFrequency: "daily" | "weekly" | "monthly" | "Daily";
    timeOfDay: string;
    timeZone: string;
    afterSuccessfulTransferAction: "archive" | "delete" | "move" | "notify" | "Archive";
    afterFailedTransferAction: "retry" | "notify" | "Archive";
    url: string;
    createdAt: string;
    updatedAt: string;
    requestId: string | null;
    ftp: FtpDetails | null;
    amazonS3Details: AmazonS3Details | null;
}




export type { IIntegrationCatalog, IRestApiIntegration, IGraphQlIntegration, IFileUploadIntegration };