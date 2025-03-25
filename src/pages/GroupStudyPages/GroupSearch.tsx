import { Helmet } from 'react-helmet-async';
import GroupSearchView from '../../sections/GroupSearch/view';

export default function GroupStudyPage() {
    return (
        <>
            <Helmet>
                <title>Group Study</title>
            </Helmet>
            <GroupSearchView />
        </>
    );
}
