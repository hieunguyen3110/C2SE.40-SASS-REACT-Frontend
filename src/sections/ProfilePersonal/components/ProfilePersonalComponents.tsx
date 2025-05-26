import classnames from 'classnames/bind';
import styles from './ProfilePersonalComponents.module.scss';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store';

import Edit from '../../../assets/images/edit-06.png';
import avartar from '../../../assets/images/icons/student-avatar.svg';

// Redux Actions
import { GetProFileAction, GetProFilePageAction } from '../../../redux/ProfilePersonalSlice/ProfilePersonalSlice';
import { DownloadDocumentAction } from '../../../redux/DocumentSlice/documentSlice';

// Types and Services
import { GetDocument } from '../../../services/DocumentAPI/DocumentAPI';
import { GetProfileRequest } from '../../../services/ProfilePersonalAPI/ProfilePersonalAPI';
import Loader from '../../../components/Loader/Loader';
import { useSharingModal } from '../../../contexts/SharingModalContext';
import LearningAnalyticsDashboard from './LearningAnalyticsDashboard';
import DocumentList from './DocumentList';
import CustomPagination from './Pagination';

const cx = classnames.bind(styles);

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

const ProfileAuthorComponent = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [emailUser, setEmailUser] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const { getUserProfile, loading } = useSelector((state: RootState) => state.profilePersonal);

    useEffect(() => {
        dispatch(GetProFileAction());
    }, [dispatch]);

    useEffect(() => {
        if (getUserProfile?.email) {
            sessionStorage.setItem('email', getUserProfile.email);
            setEmailUser(getUserProfile.email);
        }
    }, [getUserProfile]);

    // Config for sharing modal
    const { openSharingModal, setUrl, setDoc } = useSharingModal();
    const handleOpenModal = (doc: GetDocument) => {
        setUrl(`${import.meta.env.VITE_CLIENT_URL}/document/${doc.docId}`);
        setDoc({
            documentId: doc.docId.toString(),
            documentName: doc.title,
            docFilePath: doc.filePath
        })
        openSharingModal();
    };

    const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
        if (!loading) {
            setCurrentPage(value);
            const pageNum = value - 1;
            const data = {
                email: emailUser,
                pageNum,
                pageSize: 10,
            };
            dispatch(GetProFilePageAction(data));
        }
    };

    const username = useAppSelector((state: RootState) => state.authentication.username);

    const handleEditClick = () => {
        navigate('/document/edit-profile', { state: { useData: getUserProfile } });
    };

    const handleDownloadDocuments = (documentId: number) => {
        dispatch(DownloadDocumentAction({ documentId, username }));
    };

    const handleChangeEditUpload = (data: GetDocument, useData: GetProfileRequest) => {
        navigate('/document/edit-document-file', {
            state: { fileData: data, avatar: useData },
        });
    };

    return (
        <motion.div className={cx('author-component')} initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className={cx('author-component-information')} variants={slideIn}>
                <div className={cx('component-information-left')}>
                    <div className={cx('information-left-profile')}>
                        <div className={cx('left-profile-author')}>
                            <motion.div
                                className={cx('author-name')}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <img src={getUserProfile?.profilePicture || avartar} alt="Profile" />
                                <div>
                                    <h3>
                                        {getUserProfile?.firstName} {getUserProfile?.lastName}
                                    </h3>
                                    <p>{getUserProfile?.major}</p>
                                </div>
                            </motion.div>
                            <div className={cx('author-follow')}>
                                <motion.div whileHover={{ y: -3 }}>
                                    <p>{getUserProfile?.follower || 0}</p>
                                    <p>Followers</p>
                                </motion.div>
                                <motion.div whileHover={{ y: -3 }}>
                                    <p>{getUserProfile?.following || 0}</p>
                                    <p>Following</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('component-information-right')}>
                    <motion.div
                        className={cx('information-right-title')}
                        whileHover={{ boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}
                    >
                        <div className={cx('right-title-text')}>
                            <h4>Thông tin</h4>
                            <motion.img src={Edit} alt="edit" onClick={handleEditClick} whileHover={{ rotate: 15 }} />
                        </div>
                        <div className={cx('information-right-item')}>
                            <div>
                                <p>Chức vụ: {getUserProfile?.role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}</p>
                                <p>Khoa: {getUserProfile?.facultyName || 'Chưa cập nhật'} </p>
                            </div>
                            <div>
                                <p>Chuyên ngành: {getUserProfile?.major || 'Chưa cập nhật'}</p>
                                <p>
                                    Khóa:
                                    {getUserProfile?.classNumber && getUserProfile.classNumber !== 'null'
                                        ? ` K${getUserProfile.classNumber}`
                                        : ' Chưa cập nhật'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <div className={cx('information-right-search')}>
                        <input type="text" placeholder={`Tìm kiếm tài liệu của ${getUserProfile?.lastName || 'Huy'}`} />
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <Loader height={1} />
            ) : getUserProfile ? (
                <>
                    <motion.div
                        className={cx('component-title-top')}
                        variants={slideIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className={cx('file-top-title')}>
                            <h3>THỐNG KÊ</h3>
                        </div>
                        <div className={cx('file-top-table')}>
                            <div className={cx('top-table-name')}>
                                <h4>Tài liệu của {getUserProfile.lastName}</h4>
                            </div>
                            <motion.div className={cx('top-table-total')} variants={staggerContainer}>
                                <motion.div variants={fadeIn}>
                                    <span>{getUserProfile.totalDocument}</span>
                                    <p>Đã tải lên</p>
                                </motion.div>
                                <motion.div variants={fadeIn}>
                                    <span>0</span>
                                    <p>Đã lưu</p>
                                </motion.div>
                                <motion.div variants={fadeIn}>
                                    <span>0</span>
                                    <p>Đã gắn thẻ</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <LearningAnalyticsDashboard />

                    <motion.div
                        className={cx('author-component-file')}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <DocumentList
                            documents={getUserProfile.documentDtos || []}
                            profileData={getUserProfile}
                            onDownload={handleDownloadDocuments}
                            onShare={handleOpenModal}
                            onEdit={handleChangeEditUpload}
                        />

                        <CustomPagination
                            totalPages={getUserProfile.totalPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            useAlphabet={true}
                        />
                    </motion.div>
                </>
            ) : (
                <div>No profile data available</div>
            )}
        </motion.div>
    );
};

export default ProfileAuthorComponent;
