import { Helmet } from 'react-helmet-async';
import GroupManagement from '../../sections/GroupManagement/view';


export default function GroupManagementPage() {
    return (
        <>
            <Helmet>
                <title>Quản lý nhóm học tập</title>
            </Helmet>
            <GroupManagement />
        </>
    );
}
