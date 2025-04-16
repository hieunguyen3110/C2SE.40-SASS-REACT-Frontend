import { Helmet } from 'react-helmet-async';
import GroupChatView from '../../sections/GroupChat/view/GroupChatView';

export default function GroupChatPage() {
    return (
        <>
            <Helmet>
                <title>Group Study</title>
            </Helmet>
            <GroupChatView />
        </>
    );
}
