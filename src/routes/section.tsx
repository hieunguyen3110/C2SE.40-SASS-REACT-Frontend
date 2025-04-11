import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Layout from '../layouts';
import HomePage from '../pages/Home';
import DocumentPage from '../pages/Document';
import { DocumentLayout } from '../components/DocumentLayout';
// import SupportPage from "../pages/Support";
// import FAQDetailPage from "../pages/FAQDetail";
import Login from '../pages/Login';
import ForgotPassWord from '../pages/ForgotPassWord';
import { ChangePassWord, ProfileAuthor, Register, UploadFile } from '../pages';
import NewPassword from '../pages/NewPassword';
import ProtectedRoute from './ProtectedRoute';
import DocumentStorage from '../pages/DocumentStorage';
import ProfilePersonal from '../pages/ProfilePersonal';
import PersonalTeacher from '../pages/PersonalTeacher';
import SearchUser from '../pages/SearchUser';
import Notification from '../pages/Notification';
import EditProfile from '../pages/EditProfile';
import DocumentDetailPage from '../pages/DocumentDetail';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import AdminHome from '../pages/Admin/AdminHome';
import AdminDocumenPage from '../pages/Admin/AdminDocument';
import AdminUsers from '../pages/Admin/AdminUsers';
import CreateFolderPage from '../pages/CreateFolder';
import Directory from '../pages/Directory';
import SearchPage from '../pages/SearchPage';
import FolderDetailPage from '../pages/FolderDetail';
import AISupportPage from '../pages/AISupport';
import UserInformation from '../pages/Admin/UserInformation';
import CommingSoonPage from '../pages/CommingSoon';
import EditDocument from '../pages/EditDocument';
import FAQDetailPage from '../pages/FAQDetail';
import SupportPage from '../pages/Support';
import GroupStudy from '../pages/GroupStudyPages/GroupStudy';
import CreateGroup from '../pages/GroupStudyPages/GroupCreation';
import GroupStudyLayout from '../components/GroupStudyLayout/GroupStudyLayout';
import GroupSearch from '../pages/GroupStudyPages/GroupSearch';
import GroupStudyDetailPage from '../pages/GroupStudyPages/GroupStudyDetail';
import KnowledgeTestPage from '../pages/AIQuizPages/KnowledgeTest';
import AIQuizLayout from '../components/AIQuizLayout';
import TestProcessPage from '../pages/AIQuizPages/TestProcess';
import AIQuizHome from '../sections/AIQuiz/AIQuizHome';
import GroupManagementPage from '../pages/GroupStudyPages/GroupManagement';
export default function Router() {
    const routes = useRoutes([
        {
            path: '/',
            element: (
                <Layout>
                    <Outlet />
                </Layout>
            ),
            children: [
                { element: <HomePage />, index: true },
                { path: 'login', element: <Login />, index: true },
                { path: 'register', element: <Register />, index: true },
                {
                    path: 'forgot-password',
                    element: <ForgotPassWord />,
                },
                { path: 'new-password', element: <NewPassword />, index: true },
            ],
        },
        {
            path: '/document',
            element: (
                <ProtectedRoute>
                    <DocumentLayout>
                        <Outlet />
                    </DocumentLayout>
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <DocumentPage /> },
                { path: 'directory', element: <Directory /> },
                { path: 'ai-support', element: <AISupportPage /> },
                {
                    path: 'upload-file',
                    element: <UploadFile />,
                },
                {
                    path: 'change-password',
                    element: <ChangePassWord />,
                },
                {
                    path: 'edit-profile',
                    element: <EditProfile />,
                },
                {
                    path: 'notification',
                    element: <Notification />,
                },
                {
                    path: ':id',
                    element: <DocumentDetailPage />,
                },
                {
                    path: 'create-folder',
                    element: <CreateFolderPage />,
                },
                {
                    path: 'folder/:id',
                    element: <FolderDetailPage />,
                },
                { path: 'support', element: <SupportPage /> },
                { path: 'support/:id', element: <FAQDetailPage /> },
                { path: 'profile-author', element: <ProfileAuthor /> },
                { path: 'profile-author/:lastName', element: <ProfileAuthor /> },
                { path: 'profile-personal', element: <ProfilePersonal /> },
                {
                    path: 'profile-personal-teacher',
                    element: <PersonalTeacher />,
                },
                {
                    path: 'search-user',
                    element: <SearchUser />,
                },
                {
                    path: 'document-storage',
                    element: <DocumentStorage />,
                    index: true,
                },
                {
                    path: 'edit-document-file',
                    element: <EditDocument />,
                    index: true,
                },
                {
                    path: 'group-study',
                    element: (
                        <GroupStudyLayout>
                            <Outlet />
                        </GroupStudyLayout>
                    ),
                    children: [
                        {
                            index: true,
                            element: <GroupStudy />,
                        },
                        {
                            path: 'search',
                            element: <GroupSearch />,
                        },
                        {
                            path: 'create',
                            element: <CreateGroup />,
                        },
                        {
                            path: ':id',
                            element: <GroupStudyDetailPage />,
                        },
                        {
                            path: 'management',
                            element: <GroupManagementPage />,
                        },
                    ],
                },
                {
                    path: 'ai-quiz',
                    element: (
                        <AIQuizLayout>
                            <Outlet />
                        </AIQuizLayout>
                    ),
                    children: [
                        {
                            index: true,
                            element: <AIQuizHome />,
                        },
                        {
                            path: 'knowledge-test',
                            element: <KnowledgeTestPage />,
                        },
                        {
                            path: 'test-process/:id',
                            element: <TestProcessPage />,
                        }
                    ],
                },
            ],
        }, 
        {
            path: '/admin',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Outlet />
                    </DashboardLayout>
                </ProtectedRoute>
            ),
            children: [
                {
                    path: 'dashboard',
                    element: <AdminHome />,
                },
                {
                    path: 'documents',
                    element: <AdminDocumenPage />,
                },
                {
                    path: 'users',
                    element: <AdminUsers />,
                },
                {
                    path: 'user-information',
                    element: <UserInformation />,
                },
                {
                    path: 'user-information/:useId',
                    element: <UserInformation />,
                },
            ],
        },
        {
            path: '/search',
            element: (
                <DocumentLayout>
                    <Outlet />
                </DocumentLayout>
            ),
            children: [
                {
                    element: <SearchPage />,
                    index: true,
                },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
        {
            path: '/404',
            element: <CommingSoonPage />,
            index: true,
        },
    ]);

    return routes;
}
