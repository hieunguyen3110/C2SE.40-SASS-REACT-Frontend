import { useState, useEffect, useRef } from 'react';
import styles from './GroupManagement.module.scss';
import classNames from 'classnames/bind';
import { 
    Search as SearchIcon, 
    PeopleOutline as GroupIcon,
    ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideInBottom, slideInRight, appear } from '../../../utils/animations';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupOfUserAction } from '../../../redux/GroupStudySlice/GroupStudySlice';
import { RootState, AppDispatch } from '../../../redux/store';
import { IGroup } from '../../../types/groupStudy.types';

const cx = classNames.bind(styles);

// Animation variants
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4 }
    }
};

export default function GroupManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [hasRequestedGroups, setHasRequestedGroups] = useState<boolean>(false);
    const sectionRef = useRef(null);
    const dispatch = useDispatch<AppDispatch>();
    
    // Get groups from Redux store
    const { userGroups: groups, loading } = useSelector((state: RootState) => state.groupStudy);
    const error = useSelector((state: RootState) => state.groupStudy.error);
    // Move this selector to the top level
    const currentUserId = useSelector((state: RootState) => state.authentication.accountId);

    useEffect(() => {
        // Only fetch groups if we haven't already requested them and user is logged in
        if (!hasRequestedGroups && currentUserId) {
            dispatch(getGroupOfUserAction());
            setHasRequestedGroups(true);
        }
    }, [dispatch, hasRequestedGroups, currentUserId]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Filter groups based on search query
    const filteredGroups = groups?.filter((group: IGroup) => 
        group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleGroupClick = (groupId: number) => {
        navigate(`/document/group-study/${groupId}`);
    };

    const getRoleColor = (role: string) => {
        switch(role) {
            case 'Admin':
                return '#ff3c3c'; // updated to use the main color for admin
            case 'Moderator':
                return '#1976d2'; // blue for moderator
            default:
                return '#4caf50'; // green for member
        }
    };

    // Determine role based on ownerId
    const getRole = (group: IGroup) => {
        // No longer using useSelector inside this function
        if (group.ownerId === currentUserId) {
            return "Admin";
        } else {
            return "Member";
        }
    };

    return (
        <div className={cx('group-management')} ref={sectionRef}>
            <motion.div 
                className={cx('header')}
                variants={appear}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                <h1 className={cx('title')}>
                    Quản lý nhóm học tập
                </h1>
                <p className={cx('subtitle')}>
                    Danh sách các nhóm học tập bạn đang tham gia
                </p>
            </motion.div>

            {/* Search bar */}
            <motion.div 
                className={cx('search-container')}
                variants={slideInRight}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                <div className={cx('search-input-wrapper')}>
                    <SearchIcon className={cx('search-icon')} />
                    <input
                        type="text"
                        className={cx('search-input')}
                        placeholder="Tìm kiếm theo tên nhóm hoặc mô tả..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Groups list */}
            <motion.div 
                className={cx('groups-list')}
                variants={staggerContainer}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                {loading ? (
                    <div className={cx('loading-state')}>
                        <p>Đang tải dữ liệu nhóm...</p>
                    </div>
                ) : error ? (
                    <div className={cx('error-state')}>
                        <p>Đã xảy ra lỗi khi tải dữ liệu nhóm.</p>
                    </div>
                ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group: IGroup) => {
                        const role = getRole(group);
                        return (
                            <motion.div 
                                key={group.groupId} 
                                className={cx('group-card')} 
                                onClick={() => handleGroupClick(group.groupId)}
                                variants={cardVariant}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className={cx('card-content')}>
                                    <div className={cx('group-info')}>
                                        <div className={cx('group-avatar')}>
                                            <GroupIcon />
                                        </div>
                                        <div className={cx('group-details')}>
                                            <div className={cx('name-and-role')}>
                                                <h2 className={cx('group-name')}>
                                                    {group.groupName}
                                                </h2>
                                                <span
                                                    className={cx('role-chip')}
                                                    style={{ 
                                                        backgroundColor: `${getRoleColor(role)}20`, 
                                                        color: getRoleColor(role),
                                                        borderColor: getRoleColor(role)
                                                    }}
                                                >
                                                    {role}
                                                </span>
                                            </div>
                                            <p className={cx('group-description')}>
                                                {group.description}
                                            </p>
                                            <div className={cx('group-metadata')}>
                                                <span
                                                    className={cx('category-chip')}
                                                >
                                                    {group.subjectName}
                                                </span>
                                                {/* Use actual member count if available */}
                                                <p className={cx('member-count')}>
                                                    {group.memberLimited} thành viên
                                                </p>
                                                <p className={cx('last-active')}>
                                                    Hoạt động gần đây
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('action-area')}>
                                        <button
                                            className={cx('view-button')}
                                        >
                                            Xem nhóm
                                            <ArrowForwardIcon className={cx('arrow-icon')} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div 
                        className={cx('empty-state')}
                        variants={slideInBottom}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                    >
                        <h2>Không tìm thấy nhóm nào</h2>
                        <p>
                            Bạn chưa tham gia nhóm nào hoặc không có nhóm nào phù hợp với tìm kiếm của bạn.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
