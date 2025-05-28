import { useState, useEffect, useMemo } from 'react';
import { Typography, Avatar, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageIcon from '@mui/icons-material/Language';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './GroupStudyDetail.module.scss';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useParams } from 'react-router-dom';

// Import custom components
import TabNavigation from '../components/TabNavigation/TabNavigation';
import JoinRequestItem from '../components/JoinRequestItem';
import MemberItem from '../components/MemberItem';
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store';
import {
    getGroupDetailsAction,
    listMembersAction,
    deleteGroupAction,
    removeMemberAction,
    approveJoinRequestAction,
    rejectJoinRequestAction,
    updateJoinRequest,
    getGroupOfUserAction,
    setRoleAction,
    getPinnedMessagesAction,
} from '../../../redux/GroupStudySlice/GroupStudySlice';
import GroupEditForm from '../components/GroupEditForm/GroupEditForm';
import AlertModal from '../../../components/AlertModal/AlertModal';
import { useAlertModal } from '../../../hooks/useAlertModal';
import { JoinRequest } from '../../../types/groupStudy.types';
import GroupSetting from '../components/GroupSetting/GroupSetting';
import PinnedMessages from '../components/PinnedMessages/PinnedMessages';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

export default function GroupStudyDetail() {
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openEditForm, setOpenEditForm] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { isOpen, title, content, onConfirm, confirmText, openModal, closeModal } = useAlertModal();

    // Redux state
    const { loading, currentGroup, memberList, userGroups, pinnedMessages } = useAppSelector(
        (state) => state.groupStudy,
    );
    const { accountId } = useAppSelector((state: RootState) => state.authentication);

    // Check if current user is the owner
    const canAccept = useMemo(() => {
        const hasPermission = currentGroup?.role === 'OWNER' || currentGroup?.role === 'ADMIN';
        return hasPermission;
    }, [currentGroup?.role]);

    // Fetch group details when component mounts
    useEffect(() => {
        if (userGroups.length > 0) {
            if (id && userGroups.some((group) => group.groupId === parseInt(id))) {
                dispatch(getGroupDetailsAction(parseInt(id)));
                dispatch(listMembersAction({ groupId: parseInt(id), page: 0, size: 10 }));
                dispatch(getPinnedMessagesAction({ groupId: parseInt(id), page: 0, size: 10 }));
            } else {
                toast.error('Bạn không có quyền truy cập vào nhóm này');
                navigate('/document/group-study/management');
            }
        } else {
            dispatch(getGroupOfUserAction())
                .unwrap()
                .then((res) => {
                    if (id && res.some((group) => group.groupId === parseInt(id))) {
                        dispatch(getGroupDetailsAction(parseInt(id)));
                        dispatch(listMembersAction({ groupId: parseInt(id), page: 0, size: 10 }));
                    } else {
                        toast.error('Bạn không có quyền truy cập vào nhóm này');
                        navigate('/document/group-study/management');
                    }
                });
        }
    }, [dispatch, id]);

    // Filter members based on search term
    const filteredMembers = memberList
        .filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            // Định nghĩa thứ tự ưu tiên vai trò
            const roleOrder = {
                OWNER: 1,
                ADMIN: 2,
                MEMBER: 3,
            };

            // So sánh vai trò để sắp xếp
            return roleOrder[a.role] - roleOrder[b.role];
        });

    // Handle join request actions
    const handleAcceptRequest = (id: number, email: string, name: string, profilePicture: string, userId: number) => {
        if (currentGroup?.userId === accountId) {
            dispatch(approveJoinRequestAction(id));
            dispatch(updateJoinRequest({ joinRequestId: id, status: 'APPROVED', email, name, profilePicture, userId }));
        } else {
            toast.error('Bạn không có quyền xác nhận yêu cầu tham gia');
        }
    };

    const handleRejectRequest = (id: number) => {
        if (canAccept) {
            dispatch(rejectJoinRequestAction(id));
            dispatch(updateJoinRequest({ joinRequestId: id, status: 'REJECTED' }));
        } else {
            toast.error('Bạn không có quyền từ chối yêu cầu tham gia');
        }
    };

    // Handle member delete action
    const handleDeleteMember = (memberId: number) => {
        if (canAccept) {
            dispatch(removeMemberAction({ groupId: parseInt(id || ''), userId: memberId }));
        } else {
            toast.error('Bạn không có quyền xóa thành viên');
        }
    };

    const handleRoleChange = (memberId: number, newRole: 'OWNER' | 'ADMIN' | 'MEMBER') => {
        dispatch(setRoleAction({ groupId: parseInt(id || ''), userId: memberId, role: newRole }));
    };

    // Handle edit and delete actions
    const handleEditGroup = () => {
        setOpenEditForm(true);
    };

    const handleDeleteGroup = () => {
        if (!id) return;

        openModal({
            title: 'Xác nhận xóa',
            content: <p>Bạn có chắc chắn muốn xóa nhóm này không?</p>,
            onConfirm: performDeleteGroup,
            confirmText: 'Xóa',
        });
    };

    const performDeleteGroup = async () => {
        if (!id) return;

        try {
            await dispatch(deleteGroupAction(parseInt(id))).unwrap();
            window.location.href = '/document/group-study';
        } catch (error) {
            console.error('Lỗi khi xóa nhóm:', error);
        }
    };

    // Use joinRequests from the API if available, otherwise use mock data
    const displayJoinRequests = useMemo(() => {
        return currentGroup?.joinRequests || [];
    }, [currentGroup]);

    if (loading) {
        return (
            <div className={cx('loader-container')}>
                <div className={cx('loader')}></div>
            </div>
        );
    }

    return (
        <div className={cx('group-study-detail')}>
            {/* Header */}
            <header className={cx('group-study-detail__header')}>
                <div className={cx('header-wrapper')}>
                    <a href="/document/group-study" className={cx('back-button')}>
                        <ArrowBackIcon />
                    </a>
                    <div className={cx('title-wrapper')}>
                        <h1 className={cx('group-study-detail__header__title')}>
                            {currentGroup?.groupName || 'Loading...'}
                        </h1>
                        {currentGroup?.isPrivate ? (
                            <LockIcon className={cx('globe-icon')} />
                        ) : (
                            <LanguageIcon className={cx('globe-icon')} />
                        )}
                    </div>

                    {/* Owner Actions */}
                    {currentGroup?.role === 'OWNER' && (
                        <div className={cx('owner-actions')}>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                startIcon={<EditIcon />}
                                className={cx('action-button')}
                                onClick={handleEditGroup}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                className={cx('action-button')}
                                onClick={handleDeleteGroup}
                            >
                                Xóa
                            </Button>
                        </div>
                    )}
                </div>
                {/* Group Info */}
                <div className={cx('group-study-detail__info')}>
                    {/* Conditionally render avatar based on group picture */}
                    <Avatar
                        className={cx('group-study-detail__info__logo')}
                        sx={{ bgcolor: '#ff3c3c' }}
                        src={currentGroup?.picture || undefined}
                    >
                        <SchoolIcon />
                    </Avatar>
                    <div className={cx('info-wrapper')}>
                        <Typography className={cx('group-study-detail__info__title')}>
                            {currentGroup?.description || 'Loading...'}
                        </Typography>
                        <div className={cx('group-study-detail__info__meta')}>
                            <CalendarMonthIcon fontSize="small" sx={{ marginRight: '4px' }} />
                            <span>
                                Tạo ngày{' '}
                                {currentGroup
                                    ? new Date(currentGroup.createdAt || '').toLocaleDateString('vi-VN')
                                    : '--/--/----'}
                            </span>
                            <span className={cx('separator')}>•</span>
                            <span>{currentGroup?.memberLimited || 0} thành viên tối đa</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <TabNavigation memberCount={memberList.length} pinnedMessagesCount={0} onChange={setActiveTab} />

            {/* Content based on active tab */}
            <div className={cx('group-study-detail__content')}>
                {activeTab === 0 && (
                    <>
                        {/* Join Requests Section */}
                        <div className={cx('section')}>
                            <div className={cx('section__header')}>
                                <h2 className={cx('section__header__title')}>Yêu cầu tham gia</h2>
                                <span className={cx('section__header__count')}>
                                    {displayJoinRequests.length} người yêu cầu tham gia nhóm
                                </span>
                            </div>
                            <div className={cx('section__list')}>
                                {displayJoinRequests.length > 0 ? (
                                    displayJoinRequests.map((request: JoinRequest) => (
                                        <JoinRequestItem
                                            key={request.id}
                                            avatar={request.avatar}
                                            name={request.name === 'null null' ? request.email : request.name}
                                            requestDate={request.createdAt}
                                            onAccept={() =>
                                                handleAcceptRequest(
                                                    request.id,
                                                    request.email,
                                                    request.name,
                                                    request.avatar || '',
                                                    request.userId,
                                                )
                                            }
                                            onReject={() => handleRejectRequest(request.id)}
                                            canAccept={canAccept}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        className={cx('empty-requests')}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <PersonAddDisabledIcon
                                            sx={{ fontSize: 28, marginRight: '10px', color: '#999' }}
                                        />
                                        <p>Không có yêu cầu tham gia nào</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Members Section */}
                        <div className={cx('section')}>
                            <div className={cx('section__header')}>
                                <h2 className={cx('section__header__title')}>Thành viên ({memberList.length})</h2>
                            </div>

                            {/* Search input */}
                            <div className={cx('section__search')}>
                                <motion.div
                                    className={cx('search-container')}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={cx('search-icon')}>
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="text"
                                        className={cx('search-input')}
                                        placeholder="Tìm kiếm thành viên"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <AnimatePresence>
                                        {searchTerm && (
                                            <motion.button
                                                className={cx('clear-button')}
                                                onClick={() => setSearchTerm('')}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Members list */}
                            <div className={cx('section__list')}>
                                <div className={cx('member-list-header')}>
                                    <span className={cx('header-item')}>Thành viên</span>
                                    <span className={cx('header-item')}>Chức vụ</span>
                                </div>

                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <MemberItem
                                            key={member.memberId}
                                            id={member.memberId}
                                            avatar={member.profilePicture}
                                            name={member.name}
                                            joinDate={member.email}
                                            role={member.role}
                                            canDelete={currentGroup?.role === 'OWNER'}
                                            canChangeRole={currentGroup?.role === 'OWNER'}
                                            onDelete={() => handleDeleteMember(member.memberId)}
                                            onRoleChange={(newRole) => handleRoleChange(member.memberId, newRole)}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        className={cx('empty-requests')}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <GroupIcon sx={{ fontSize: 28, marginRight: '10px', color: '#999' }} />
                                        <p>Không tìm thấy thành viên nào</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 1 && (
                    <div className={cx('section')}>
                        <PinnedMessages pinnedMessages={pinnedMessages} />
                    </div>
                )}

                {activeTab === 2 && (
                    <div className={cx('section')}>
                        <GroupSetting isOwner={currentGroup?.role === 'OWNER'} />
                    </div>
                )}
            </div>

            {/* Edit Group Form Dialog */}
            <GroupEditForm open={openEditForm} onClose={() => setOpenEditForm(false)} />

            {/* Alert Modal */}
            <AlertModal
                isOpen={isOpen}
                onClose={closeModal}
                title={title}
                content={content}
                onConfirm={onConfirm}
                confirmText={confirmText}
            />
        </div>
    );
}
