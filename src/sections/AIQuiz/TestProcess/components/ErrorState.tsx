import { useNavigate } from 'react-router-dom';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

interface ErrorStateProps {
    message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Clear the quiz session cookie before navigating
        Cookies.remove('quiz_session');
        console.log('Quiz session cookie cleared');

        // Navigate back to the quiz page
        navigate('/document/ai-quiz');
    };

    return (
        <div className={cx('error-container')}>
            <div className={cx('error-icon')}>❌</div>
            <h2>Error Loading Quiz</h2>
            <p>{message}</p>
            <button onClick={handleGoBack} className={cx('error-button')}>
                Go Back
            </button>
        </div>
    );
}
