import classNames from 'classnames/bind';

import { GroupSidebar } from './GroupSidebar';

import styles from './GroupStudyLayout.module.scss';

const cx = classNames.bind(styles);

interface PropsType {
    children: React.ReactNode;
}

export default function GroupStudyLayout(props: PropsType) {
    return (
        <div className={cx('layout-wrapper')}>
            <GroupSidebar />
            {props.children}
        </div>
    );
}
