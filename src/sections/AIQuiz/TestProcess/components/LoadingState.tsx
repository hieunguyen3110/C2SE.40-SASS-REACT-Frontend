import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

interface LoadingStateProps {
    message?: string;
    showBackButton?: boolean;
}

export default function LoadingState({ 
    message = 'Loading quiz questions...',
    showBackButton = false
}: LoadingStateProps) {
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        // Clear the quiz session cookie before navigating
        Cookies.remove('quiz_session');
        console.log('Quiz session cookie cleared from loading state');
        
        // Navigate back to the quiz page
        navigate('/document/ai-quiz');
    };
    
    return (
        <div className={cx('loading-container')}>
            <div className={cx('loading-spinner')}></div>
            <p>{message}</p>
            
            {showBackButton && (
                <button 
                    onClick={handleGoBack} 
                    className={cx('error-button')}
                >
                    Go Back
                </button>
            )}
        </div>
    );
} 