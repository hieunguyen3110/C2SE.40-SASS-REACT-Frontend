import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { cx } from '../../utils/cx';
import { TabNavigationModule } from './TabNavigation.module';

const TabNavigation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.tabNavigation);

  const handleTabChange = (index) => {
    // Implement the logic to change the active tab
  };

  return (
    <div className={cx('tab-navigation')}>
      {tabs.map((tab, index) => (
        <button 
          key={tab.label}
          className={cx('tab', { active: activeTab === index })}
          onClick={() => handleTabChange(index)}
          style={{ 
            color: activeTab === index ? 'var(--main-color)' : 'inherit'
          }}
        >
          {tab.label}
          {tab.count > 0 && <span className={cx('count')}>{tab.count}</span>}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 