import { Helmet } from 'react-helmet-async';
import GroupStudyDetail from '../../sections/GroupStudyDetail/view';

export default function GroupStudyDetailPage() {
    return (
        <>
            <Helmet>
                <title>Group Study</title>
            </Helmet>
            <GroupStudyDetail />
        </>
    );
}
