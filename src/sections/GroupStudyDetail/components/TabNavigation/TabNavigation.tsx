import React, { useState } from 'react';
import { Tabs, Tab, Badge } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './TabNavigation.module.scss';

const cx = classNames.bind(styles);

interface TabNavigationProps {
    memberCount?: number;
    pinnedMessagesCount?: number;
    onChange?: (index: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ memberCount = 0, pinnedMessagesCount = 0, onChange }) => {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <div className={cx('tab-navigation')}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                className={cx('tabs')}
                TabIndicatorProps={{
                    className: cx('indicator'),
                }}
            >
                <Tab
                    label={
                        <Badge badgeContent={memberCount} color="error" className={cx('badge')}>
                            <span className={cx('tab-label', { 'active-tab': value === 0 })}>Thành viên</span>
                        </Badge>
                    }
                    className={cx('tab')}
                />
                <Tab
                    label={
                        <Badge badgeContent={pinnedMessagesCount} color="error" className={cx('badge')}>
                            <span className={cx('tab-label', { 'active-tab': value === 1 })}>Tin nhắn đã gim</span>
                        </Badge>
                    }
                    className={cx('tab')}
                />
                <Tab
                    label={<span className={cx('tab-label', { 'active-tab': value === 2 })}>Cài đặt</span>}
                    className={cx('tab')}
                />
            </Tabs>
        </div>
    );
};

export default TabNavigation;
