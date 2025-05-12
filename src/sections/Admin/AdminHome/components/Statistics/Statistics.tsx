import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store';
import { getStatsForAdmin } from '../../../../../redux/AdminDashboardSlice/AdminDashboardSlice';
import { motion } from 'framer-motion';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SubjectIcon from '@mui/icons-material/Subject';

const cx = classNames.bind(styles);

const statsConfig = [
    { 
        key: 'totalStudents', 
        title: 'Sinh viên', 
        icon: <SchoolIcon />,
        color: '#4caf50',
        bgColor: '#e8f5e9'
    },
    { 
        key: 'totalLecturers', 
        title: 'Giảng viên', 
        icon: <PersonIcon />,
        color: '#2196f3',
        bgColor: '#e3f2fd'
    },
    { 
        key: 'totalAdmins', 
        title: 'Quản trị viên', 
        icon: <AdminPanelSettingsIcon />,
        color: '#9c27b0',
        bgColor: '#f3e5f5'
    },
    { 
        key: 'totalDocuments', 
        title: 'Tài liệu', 
        icon: <DescriptionIcon />,
        color: '#ff3c3c',
        bgColor: '#ffebee'
    },
    { 
        key: 'totalFolders', 
        title: 'Thư mục', 
        icon: <FolderIcon />,
        color: '#ff9800',
        bgColor: '#fff3e0'
    },
    { 
        key: 'totalSubjects', 
        title: 'Môn học', 
        icon: <SubjectIcon />,
        color: '#607d8b',
        bgColor: '#eceff1'
    },
];

export default function Statistics() {
    const dispatch = useAppDispatch();
    const { data } = useAppSelector((state) => state.adminDashboard);
    const [statsData, setStatsData] = useState<any>({});

    useEffect(() => {
        dispatch(getStatsForAdmin());
    }, []);

    useEffect(() => {
        if (data) {
            setStatsData(data);
        }
    }, [data]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div 
            className={cx('statistics')}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {statsConfig.map((stat, index) => (
                <motion.div 
                    className={cx('stat-card')} 
                    key={stat.key}
                    variants={itemVariants}
                    style={{
                        '--card-color': stat.color,
                        '--card-bg-color': stat.bgColor
                    } as React.CSSProperties}
                >
                    <div className={cx('icon-wrapper')}>
                        {stat.icon}
                    </div>
                    <div className={cx('stat-info')}>
                        <h3 className={cx('stat-title')}>{stat.title}</h3>
                        <p className={cx('stat-value')}>
                            {statsData[stat.key]?.toLocaleString() || 0}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
