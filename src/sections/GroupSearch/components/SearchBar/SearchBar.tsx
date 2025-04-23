import { Search } from '@mui/icons-material';
import classNames from 'classnames/bind';
import { ChangeEvent } from 'react';
import styles from './SearchBar.module.scss';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

interface SearchBarProps {
    placeholder?: string;
    onChange: (value: string) => void;
    value: string;
}

export default function SearchBar({ placeholder = 'Tìm kiếm bằng tên nhóm học tập', onChange, value }: SearchBarProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={cx('searchBar')}>
            <div className={cx('inputWrapper')}>
                <Search className={cx('searchIcon')} />
                <motion.input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cx('input')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileFocus={{ scale: 1.01 }}
                />
                {value && (
                    <motion.button 
                        className={cx('clearButton')}
                        onClick={() => onChange('')}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ×
                    </motion.button>
                )}
            </div>
        </div>
    );
}
