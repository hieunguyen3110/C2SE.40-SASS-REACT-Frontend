import { Helmet } from 'react-helmet-async';
import { GroupCreationView } from '../../sections/GroupCreation/view';

export default function GroupCreationPage() {
    return (
        <>
            <Helmet>
                <title>Group Creation</title>
            </Helmet>
            <GroupCreationView />
        </>
    );
}
