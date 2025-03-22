import { Helmet } from "react-helmet-async";
import { GroupStudyView } from "../../sections/GroupStudy/view";


export default function GroupStudyPage() {
    return (
        <>
            <Helmet>
                <title>Group Study</title>
            </Helmet>
            <GroupStudyView />
        </>
    );
}
    