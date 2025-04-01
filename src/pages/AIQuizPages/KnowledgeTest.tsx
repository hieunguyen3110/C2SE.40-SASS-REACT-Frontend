import { Helmet } from 'react-helmet-async';
import KnowledgeTest from '../../sections/AIQuiz/KnowledgeTest/view';

export default function KnowledgeTestPage() {
    return (
        <>
            <Helmet>
                <title>Knowledge Test</title>
            </Helmet>
            <KnowledgeTest />
        </>
    );
}
