import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import GroupCard from '../components/GroupCard/GroupCard';
import GroupSearchHeader from '../components/GroupSearchHeader';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import EmptyStateIllustration from '../../../assets/images/empty-state.svg';
import GroupPlaceholder from '../../../assets/images/group-placeholder.svg';
import styles from './GroupSearchView.module.scss';
import { Add as AddIcon } from '@mui/icons-material';
import { searchGroupAction, joinGroupAction } from '../../../redux/GroupStudySlice/GroupStudySlice';
import { RootState, AppDispatch } from '../../../redux/store';
import { SearchGroupResult } from '../../../types/groupStudy.types';
import useDebounce from '../../../hooks/useDebounce';

const cx = classNames.bind(styles);

export default function GroupSearchView() {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay
    const dispatch = useDispatch<AppDispatch>();
    const { searchResults, loading, userGroups } = useSelector((state: RootState) => state.groupStudy);

    useEffect(() => {
        if (debouncedSearchQuery.trim() !== '') {
            dispatch(searchGroupAction(debouncedSearchQuery));
        }
    }, [debouncedSearchQuery, dispatch]);

    // Check if there are no groups to display
    const noGroupsFound = searchResults.length === 0 && !loading && debouncedSearchQuery.trim() !== '';

    // Check if user is already a member of a group
    const isUserMemberOfGroup = (groupId: number) => {
        return userGroups.some(userGroup => userGroup.groupId === groupId);
    };

    const handleJoinGroup = (groupId: number) => {
        // Only dispatch join action if user is not already a member
        if (!isUserMemberOfGroup(groupId)) {
            dispatch(joinGroupAction(groupId));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className={cx('groupSearchView')}>
            <GroupSearchHeader
                title="Tìm kiếm nhóm học tập"
                subtitle="Kết nối với những người khác có cùng sở thích và cùng nhau học hỏi trong quá trình công tác nhóm"
            />

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <p className={cx('resultsCount')}>{searchResults.length} groups found</p>

            {loading ? (
                <div className={cx('loadingState')}>
                    <div className={cx('spinner')}></div>
                </div>
            ) : noGroupsFound ? (
                <motion.div 
                    className={cx('emptyState')}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img src={EmptyStateIllustration} alt="No groups found" className={cx('emptyStateImage')} />
                    <h2 className={cx('emptyStateTitle')}>
                        Không tìm thấy nhóm học tập nào
                    </h2>
                    <p className={cx('emptyStateDescription')}>
                        Hiện tại chúng tôi không tìm thấy nhóm học tập nào phù hợp với từ khóa của bạn. Bạn có thể tạo một nhóm
                        học tập mới để bắt đầu.
                    </p>
                    <Link to="/document/group-study/create" className={cx('createGroupButton')}>
                        <span>Tạo nhóm ngay</span>
                        <AddIcon />
                    </Link>
                </motion.div>
            ) : searchResults.length > 0 ? (
                <motion.div 
                    className={cx('groupsList')}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {searchResults.map((group: SearchGroupResult) => (
                        <motion.div key={group.groupId} variants={itemVariants}>
                            <GroupCard
                                image={group.picture || GroupPlaceholder}
                                category={group.subjectName}
                                memberCount={group.memberCount}
                                memberLimited={group.memberLimited}
                                title={group.groupName}
                                description={group.description}
                                onJoin={() => handleJoinGroup(group.groupId)}
                                isUserMember={isUserMemberOfGroup(group.groupId)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className={cx('initialState')}>
                    <p>Nhập từ khóa để tìm kiếm nhóm học tập</p>
                </div>
            )}
        </div>
    );
}
