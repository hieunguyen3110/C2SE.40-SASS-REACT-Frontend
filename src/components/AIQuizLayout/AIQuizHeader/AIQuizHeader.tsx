import classNames from 'classnames/bind';
import styles from './AIQuizHeader.module.scss';
import { AutoStories, History, TaskAlt } from '@mui/icons-material';

const cx = classNames.bind(styles);

export default function AIQuizHeader() {
    return (
        <header className={cx('ai-quiz-header')}>
            <div className={cx('logo')}>
                <span className={cx('dtu')}>AI</span>
                <span className={cx('document')}>QUIZ</span>
            </div>
            <div className={cx('actions')}>
                <div className={cx('action-btn', 'active')}>
                    <AutoStories />
                    <span>Knowledge Test</span>
                </div>
                <div className={cx('action-btn')}>
                    <TaskAlt />
                    <span>Test Results</span>
                </div>
                <div className={cx('action-btn')}>
                    <History />
                    <span>Subjects History</span>
                </div>
            </div>
        </header>
    );
}
