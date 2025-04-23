import { Helmet } from 'react-helmet-async';
import GroupSupportView from '../../sections/GroupSupport/view';


export default function GroupSupport() {
    return (
        <>
            <Helmet>
                <title>Group Study Support</title>
            </Helmet>
            <GroupSupportView />
        </>
    );
}
