import { Helmet } from 'react-helmet-async';
import LearningStatistics from '../../sections/AIQuiz/LearningStatistics/view';

export default function LearningStatisticsPage() {
    return (
        <>
            <Helmet>
                <title>Learning Statistics</title>
            </Helmet>
            <LearningStatistics />
        </>
    );
} 