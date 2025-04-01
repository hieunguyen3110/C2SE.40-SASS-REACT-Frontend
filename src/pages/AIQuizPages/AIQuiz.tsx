import { Helmet } from 'react-helmet-async';
import AIQuizHome from '../../sections/AIQuiz/AIQuizHome';


export default function AIQuizPage() {
    return (
        <>
            <Helmet>
                <title>AI Quiz</title>
            </Helmet>
            <AIQuizHome />
        </>
    );
}
