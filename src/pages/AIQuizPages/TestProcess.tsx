import { Helmet } from 'react-helmet-async';
import TestProcess from '../../sections/AIQuiz/TestProcess/view';


export default function TestProcessPage() {
    return (
        <>
            <Helmet>
                <title>Test Process</title>
            </Helmet>
            <TestProcess />
        </>
    );
}
