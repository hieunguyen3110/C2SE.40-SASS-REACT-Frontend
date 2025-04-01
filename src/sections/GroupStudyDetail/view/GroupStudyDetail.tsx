import { useState, useEffect } from 'react';
import { Typography, TextField, InputAdornment, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import classNames from 'classnames/bind';
import styles from './GroupStudyDetail.module.scss';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useParams } from 'react-router-dom';

// Import custom components
import TabNavigation from '../components/TabNavigation/TabNavigation';
import JoinRequestItem from '../components/JoinRequestItem';
import MemberItem from '../components/MemberItem';
import { useAppDispatch } from '../../../redux/store';
import { getGroupDetailsAction } from '../../../redux/GroupStudySlice/GroupStudySlice';

const cx = classNames.bind(styles);

export default function GroupStudyDetail() {
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Get groupId from URL params
    const { groupId } = useParams<{ groupId: string }>();

    // Redux state
    const dispatch = useAppDispatch();
    // const { currentGroup, loading, error } = useAppSelector((state) => state.groupStudy);

    // Fetch group details when component mounts
    useEffect(() => {
        if (groupId) {
            // dispatch(getGroupDetailsAction(parseInt(groupId)));
        }
    }, [dispatch, groupId]);

    // Log the data from API
    // useEffect(() => {
    //     console.log('Group details:', currentGroup);
    //     console.log('Loading state:', loading);
    //     console.log('Error:', error);
    // }, [currentGroup, loading, error]);

    // Mock data for join requests
    const joinRequests = [
        {
            id: '1',
            name: 'Trần B',
            avatar: '',
            requestDate: '2025-03-01',
        },
        {
            id: '2',
            name: 'Nguyễn A',
            avatar: '',
            requestDate: '2025-03-02',
        },
    ];

    // Mock data for members
    const members = [
        {
            id: '1',
            name: 'Nguyễn Hiếu',
            avatar: '',
            joinDate: '2025-01-15',
            role: 'Admin',
        },
        {
            id: '2',
            name: 'Phạm Tùng',
            avatar: '',
            joinDate: '2025-01-15',
            role: 'Creator',
        },
        {
            id: '3',
            name: 'Nguyễn Huy',
            avatar: '',
            joinDate: '2025-02-20',
            role: 'Member',
        },
        {
            id: '4',
            name: 'Cao An',
            avatar: '',
            joinDate: '2025-03-05',
            role: 'Member',
        },
        {
            id: '5',
            name: 'Đoàn Khương',
            avatar: '',
            joinDate: '2025-03-10',
            role: 'Member',
        },
    ];

    // Filter members based on search term
    const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Handlers for join request actions
    const handleAcceptRequest = (id: string) => {
        console.log('Accepted request', id);
    };

    const handleRejectRequest = (id: string) => {
        console.log('Rejected request', id);
    };

    return (
        <div className={cx('group-study-detail')}>
            {/* Header */}
            <header className={cx('group-study-detail__header')}>
                <div className={cx('header-wrapper')}>
                    <a href="#" className={cx('back-button')}>
                        <ArrowBackIcon />
                    </a>
                    <div className={cx('title-wrapper')}>
                        <h1 className={cx('group-study-detail__header__title')}>Nghiên cứu khoa học</h1>
                        <LanguageIcon className={cx('globe-icon')} />
                    </div>
                </div>
                {/* Group Info */}
                <div className={cx('group-study-detail__info')}>
                    {/* Có avatar thì thay thế = avatar sau */}
                    <Avatar className={cx('group-study-detail__info__logo')} sx={{ bgcolor: '#1976d2' }}>
                        <SchoolIcon />
                    </Avatar>
                    <div className={cx('info-wrapper')}>
                        <Typography className={cx('group-study-detail__info__title')}>
                            Nghiên cứu các chức năng hỗ trợ học thuật với công cụ AI
                        </Typography>
                        <div className={cx('group-study-detail__info__meta')}>
                            <CalendarMonthIcon fontSize="small" sx={{ marginRight: '4px' }} />
                            <span>Tạo ngày 2025-01-15</span>
                            <span className={cx('separator')}>•</span>
                            <span>10 members</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <TabNavigation memberCount={5} pinnedMessagesCount={0} onChange={setActiveTab} />

            {/* Content based on active tab */}
            <div className={cx('group-study-detail__content')}>
                {activeTab === 0 && (
                    <>
                        {/* Join Requests Section */}
                        {joinRequests.length > 0 && (
                            <div className={cx('section')}>
                                <div className={cx('section__header')}>
                                    <h2 className={cx('section__header__title')}>Yêu cầu tham gia</h2>
                                    <span className={cx('section__header__count')}>
                                        {joinRequests.length} người yêu cầu tham gia nhóm
                                    </span>
                                </div>
                                <div className={cx('section__list')}>
                                    {joinRequests.map((request) => (
                                        <JoinRequestItem
                                            key={request.id}
                                            avatar={request.avatar}
                                            name={request.name}
                                            requestDate={request.requestDate}
                                            onAccept={() => handleAcceptRequest(request.id)}
                                            onReject={() => handleRejectRequest(request.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Members Section */}
                        <div className={cx('section')}>
                            <div className={cx('section__header')}>
                                <h2 className={cx('section__header__title')}>Thành viên ({members.length})</h2>
                            </div>

                            {/* Search input */}
                            <div className={cx('section__search')}>
                                <TextField
                                    placeholder="Tìm kiếm thành viên"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Members list */}
                            <div className={cx('section__list')}>
                                <div className={cx('member-list-header')}>
                                    <Typography variant="body2">Thành viên</Typography>
                                    <Typography variant="body2">Đã tham gia</Typography>
                                    <Typography variant="body2">Chức vụ</Typography>
                                </div>

                                {filteredMembers.map((member) => (
                                    <MemberItem
                                        key={member.id}
                                        avatar={member.avatar}
                                        name={member.name}
                                        joinDate={member.joinDate}
                                        role={member.role as 'Admin' | 'Creator' | 'Member'}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 1 && (
                    <div className={cx('section')}>
                        <Typography variant="body1" align="center" sx={{ py: 4 }}>
                            Không có tin nhắn đã ghim
                        </Typography>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className={cx('section')}>
                        <Typography variant="body1" align="center" sx={{ py: 4 }}>
                            Cài đặt nhóm
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
