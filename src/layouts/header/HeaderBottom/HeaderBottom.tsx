import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import styles from './HeaderBottom.module.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/store';

export default function HeaderBottom() {
    const navigate = useNavigate();

    const { isLogined } = useAppSelector((state) => state.authentication);

    const handleClick = () => {
        if (isLogined) {
            navigate('/document/notification');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={cx('header-bottom')}>
            <Link to="/">TRANG CHỦ</Link>
            <Link to="/document">TÀI LIỆU</Link>
            <Link to="/document/group-study">NHÓM HỌC TẬP</Link>
            <Link to="/document/ai-quiz">AI-QUIZ</Link>
            <Link to="/document/ai-support">AI-CHAT</Link>
            <Link to="contact">LIÊN HỆ</Link>
            <button onClick={handleClick}>
                <NotificationsNoneIcon />
            </button>
        </div>
    );
}
