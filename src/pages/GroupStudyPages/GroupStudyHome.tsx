import { Helmet } from 'react-helmet-async';
import GroupStudyHome from '../../sections/GroupStudyHome/view';

export default function GroupStudyHomePage() {
    return (
        <>
            <Helmet>
                <title>Group Study</title>
            </Helmet>
            <GroupStudyHome />
        </>
    );
}
