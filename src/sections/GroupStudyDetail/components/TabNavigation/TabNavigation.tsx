import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './TabNavigation.module.scss';

const cx = classNames.bind(styles);

interface TabNavigationProps {
    memberCount?: number;
    pinnedMessagesCount?: number;
    onChange?: (index: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ memberCount = 0, pinnedMessagesCount = 0, onChange }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        onChange?.(index);
    };

    return (
        <div className={cx('tab-navigation')}>
            <div className={cx('tabs')}>
                <motion.div 
                    className={cx('tab-indicator')} 
                    initial={false}
                    animate={{ 
                        left: `calc(${activeTab * 33.33}%)`,
                        right: `calc(${100 - (activeTab + 1) * 33.33}%)`
                    }}
                    transition={{ duration: 0.3 }}
                />
                
                <motion.button
                    className={cx('tab', { active: activeTab === 0 })}
                    onClick={() => handleTabClick(0)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <span className={cx('tab-label')}>Thành viên</span>
                    {memberCount > 0 && (
                        <span className={cx('badge')}>{memberCount}</span>
                    )}
                </motion.button>
                
                <motion.button
                    className={cx('tab', { active: activeTab === 1 })}
                    onClick={() => handleTabClick(1)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <span className={cx('tab-label')}>Tin nhắn đã gim</span>
                    {pinnedMessagesCount > 0 && (
                        <span className={cx('badge')}>{pinnedMessagesCount}</span>
                    )}
                </motion.button>
                
                <motion.button
                    className={cx('tab', { active: activeTab === 2 })}
                    onClick={() => handleTabClick(2)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <span className={cx('tab-label')}>Cài đặt</span>
                </motion.button>
            </div>
        </div>
    );
};

export default TabNavigation;
