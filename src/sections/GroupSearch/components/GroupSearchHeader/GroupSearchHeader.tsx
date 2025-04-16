import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './GroupSearchHeader.module.scss';

const cx = classNames.bind(styles);

interface GroupSearchHeaderProps {
    title: string;
    subtitle: string;
}

export default function GroupSearchHeader({ title, subtitle }: GroupSearchHeaderProps) {
    return (
        <motion.header 
            className={cx('header')}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={cx('title')}>{title}</h1>
            <p className={cx('subtitle')}>{subtitle}</p>
        </motion.header>
    );
}
