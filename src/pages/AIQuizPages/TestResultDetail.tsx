import { Helmet } from 'react-helmet-async';
import TestResultDetail from '../../sections/AIQuiz/TestResultDetail/view';


export default function TestResultDetailPage() {
    return (
        <>
            <Helmet>
                <title>Test Result Detail</title>
            </Helmet>
            <TestResultDetail />
        </>
    );
}
