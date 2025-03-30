import classNames from 'classnames/bind';
import styles from './GroupCreationView.module.scss';
import { Link } from 'react-router-dom';
import { GroupCreationForm } from '../components/GroupCreationForm';
const cx = classNames.bind(styles);

export default function GroupCreationView() {
    return (
        <div className={cx('group-creation-view')}>
            <Link to={'/document/group-study'} className={cx('back-link')}>
                Quay lại
            </Link>
            <GroupCreationForm />
        </div>
    );
}
