import { Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './GroupSearchHeader.module.scss';

const cx = classNames.bind(styles);

interface GroupSearchHeaderProps {
    title: string;
    subtitle: string;
}

export default function GroupSearchHeader({ title, subtitle }: GroupSearchHeaderProps) {
    return (
        <div className={cx('header')}>
            <Typography variant="h4" component="h1" className={cx('title')}>
                {title}
            </Typography>
            <Typography variant="subtitle1" className={cx('subtitle')}>
                {subtitle}
            </Typography>
        </div>
    );
}
