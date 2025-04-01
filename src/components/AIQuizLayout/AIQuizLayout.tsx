import classNames from 'classnames/bind';
import styles from './AIQuizLayout.module.scss';
import AIQuizHeader from './AIQuizHeader';
const cx = classNames.bind(styles); 

interface PropsType {
    children: React.ReactNode;
}

export default function AIQuizLayout(props: PropsType) {
    return (
        <div className={cx('layout-wrapper')}>
            <AIQuizHeader/>
            {props.children}
        </div>
    );
}
