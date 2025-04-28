import { Navigate, useRoutes } from "react-router";
import {
  Login,
  ForgotPassword,
  SetNewPassword,
  ResetPasswordSuccess,
  //auth routes

  Dashboard,
  // app routes
  ClientManagement,
  NotFound,
} from "@/pages";


import { AppLayout, AuthLayout } from "@/layout";
import PublicRoute from "./public-route";
import PrivateRoute from "@/routes/private-route";
import AccountManagement from "@/pages/AccountManagement";
import IntegrationCatalogPage from "@/pages/IntegrationCatalog";
import RestApiIntegration from "@/pages/IntegrationCatalog/RestApiIntegration";
import RestApiSandboxPage from "@/pages/RestApiSandbox";
import ProductionApprovalsPage from "@/pages/ProductionApprovals";
import ApprovalDetailPage from "@/pages/ProductionApprovals/ApprovalDetail";
import CreateRequestPage from "@/pages/ProductionApprovals/CreateRequest";
import CreateClient from "@/pages/ClientManagement/CreateClient";
import GraphQLIntegration from '../pages/IntegrationCatalog/GraphQLIntegration';
import FileUploadIntegration from '../pages/IntegrationCatalog/FileUploadIntegration';
import IntegrationCatalogList from "@/pages/IntegrationCatalog/IntegrationCatalogList";


const Routes = () => {
  const routes = [
    {
      path: "/",
      element: <PrivateRoute navLink="/" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <Dashboard />
        }
      ]
    },
    {
      path: "/client-management",
      element: <PrivateRoute navLink="/client-management" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <ClientManagement />
        },
        {
          path: "create",
          element: <CreateClient />
        }
      ]
    },
    {
      path: "/account-management",
      element: <PrivateRoute navLink="/account-management" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <AccountManagement />
        }
      ]
    },
    {
      path: "/integration-catalog",
      element: <PrivateRoute navLink="/integration-catalog" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <IntegrationCatalogPage />
        },
        {
          path: "rest-api",
          element: <RestApiIntegration />
        },
        {
          path: "graphql",
          element: <GraphQLIntegration />
        },
        {
          path: "file-upload",
          element: <FileUploadIntegration />
        },
        {
          path: "list",
          element: <IntegrationCatalogList />
        }
      ]
    },
    {
      path: "/production-approvals",
      element: <PrivateRoute navLink="/production-approvals" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <ProductionApprovalsPage />
        },
        {
          path: "create",
          element: <CreateRequestPage />
        },
        {
          path: ":requestId",
          element: <ApprovalDetailPage />
        }
      ]
    },
    {
      path: "/sandbox/rest-api",
      element: <PrivateRoute navLink="/sandbox/rest-api" component={AppLayout} />,
      children: [
        {
          path: "",
          element: <RestApiSandboxPage />
        }
      ]
    },
    {
      path: "/login",
      element: <PublicRoute component={AuthLayout} />,
      children: [
        {
          path: "",
          element: <Login />
        }
      ]
    },
    {
      path: "/forgot-password",
      element: <PublicRoute component={AuthLayout} />,
      children: [
        {
          path: "",
          element: <ForgotPassword />
        }
      ]
    },
    {
      path: "/set-new-password",
      element: <PublicRoute component={AuthLayout} />,
      children: [
        {
          path: "",
          element: <SetNewPassword />
        }
      ]
    },
    {
      path: "/reset-password-success",
      element: <PublicRoute component={AuthLayout} />,
      children: [
        {
          path: "",
          element: <ResetPasswordSuccess />
        }
      ]
    },
    { path: "404", element: <NotFound /> },
    {
      path: "*",
      element: <Navigate to="/404" />
    }
  ];

  return useRoutes(routes);
}

export default Routes;