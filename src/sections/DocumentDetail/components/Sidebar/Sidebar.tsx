import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
const cx = classNames.bind(styles);
import FolderIcon from '@mui/icons-material/Folder';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Avatar from '../../../../assets/images/icons/student-avatar.svg';
import FlagIcon from '@mui/icons-material/Flag';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { formatDate } from '../../../../utils/formatDate';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { rateDocumentAction } from '../../../../redux/DocumentSlice/documentSlice';
import emailjs from '@emailjs/browser';

interface IDoc {
    doc: {
        authorName: string;
        createdAt: string;
        docId: number;
        facultyName: string;
        filePath: string;
        folderName: string | null;
        subjectName: string;
        title: string;
        profilePicture: string | null;
        rating?: number;
        totalRatings?: number;
        accountRatingDtos?: {
            accountId: number;
            rating: number;
        }[];
    };
}

export default function Sidebar({ doc }: IDoc) {
    const dispatch = useAppDispatch();
    const { username, accountId } = useAppSelector((state: any) => state.authentication);
    const [userRating, setUserRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    // Check if user has already rated this document
    const userExistingRating = doc?.accountRatingDtos?.find(rating => rating.accountId === accountId);
    const hasRated = !!userExistingRating;

    // Set user's existing rating if they've already rated
    useEffect(() => {
        if (hasRated && userExistingRating) {
            setUserRating(userExistingRating.rating);
        }
    }, [hasRated, userExistingRating]);

    const handleRatingClick = () => {
        // If user has already rated, show a message and exit
        if (hasRated) {
            toast('Bạn đã đánh giá tài liệu này rồi', {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return;
        }

        if (userRating <= 3 && userRating > 0) {
            setShowFeedbackModal(true);
        } else if (userRating > 3) {
            dispatch(rateDocumentAction({ documentId: doc.docId, rating: userRating }));
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } else {
            toast('Vui lòng chọn đánh giá', {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        }
    };

    const sendEmailNotification = () => {
        if (isSending) return;
        setIsSending(true);

        const templateParams = {
            from_name: username,
            message: `Tài liệu: "${doc?.title}" đã nhận được đánh giá ${userRating} sao với phản hồi: "${feedback}"`,
            to_email: 'doanngockhuong@dtu.edu.vn',
            doc_title: doc?.title,
            rating: userRating,
            feedback: feedback,
        };

        emailjs
            .send(import.meta.env.VITE_EMAILJS_KEY, import.meta.env.VITE_EMAILJS_TEMPLATE, templateParams, {
                publicKey: 'UasBeH0VctySK7UHo',
            })
            .then(
                () => {
                    console.log('Email notification sent successfully');
                },
                (error) => {
                    console.error('Failed to send email notification:', error);
                },
            );

        setTimeout(() => {
            setIsSending(false);
        }, 3000);
    };

    const handleSubmitFeedback = () => {
        dispatch(rateDocumentAction({ documentId: doc.docId, rating: userRating }));

        // Send email notification with feedback
        if (feedback.trim() !== '') {
            sendEmailNotification();
        }

        setShowFeedbackModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    };

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', duration: 0.5 },
        },
        exit: {
            opacity: 0,
            y: 50,
            scale: 0.95,
            transition: { duration: 0.3 },
        },
    };

    return (
        <div className={cx('sidebar')}>
            <h2>Thông tin tài liệu</h2>
            <h3>{doc?.title}</h3>
            <p>Môn học: {doc?.subjectName}</p>
            <div className={cx('category')}>
                <h3>
                    <FolderIcon /> Thư mục
                </h3>
                <a href="#">{doc?.folderName}</a>
            </div>
            <div className={cx('category')}>
                <h3>
                    <SchoolIcon /> Chuyên ngành
                </h3>
                <a href="#">{doc?.facultyName}</a>
            </div>
            <hr />
            <div className={cx('category')}>
                <h3>
                    <CalendarMonthIcon /> Thời gian đăng tài liệu
                </h3>

                <span>{formatDate(doc?.createdAt)}</span>
            </div>
            <hr />
            {/* Rating component */}
            <div className={cx('rating')}>
                <div className={cx('rating-info')}>
                    <h3>Số người đánh giá: {doc?.totalRatings || 0}</h3>
                    <div className={cx('stars')}>
                        {[...Array(5)].map((_, index) =>
                            index < Math.floor(doc?.rating || 0) ? (
                                <StarIcon key={index} className={cx('star-icon', 'filled')} />
                            ) : index + 0.5 === doc?.rating ? (
                                <StarIcon key={index} className={cx('star-icon', 'half-filled')} />
                            ) : (
                                <StarBorderIcon key={index} className={cx('star-icon')} />
                            ),
                        )}
                    </div>
                </div>

                <div className={cx('user-rating')}>
                    <h3>{hasRated ? 'Đánh giá của bạn:' : 'Đánh giá của bạn:'}</h3>
                    <div className={cx('stars')}>
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                onClick={() => !hasRated && setUserRating(index + 1)}
                                onMouseEnter={() => !hasRated && setHover(index + 1)}
                                onMouseLeave={() => !hasRated && setHover(0)}
                                style={{ cursor: hasRated ? 'default' : 'pointer' }}
                            >
                                {((!hasRated && hover) || userRating) > index ? (
                                    <StarIcon className={cx('star-icon', 'filled')} />
                                ) : (
                                    <StarBorderIcon className={cx('star-icon')} />
                                )}
                            </div>
                        ))}
                    </div>
                    {hasRated && <p className={cx('already-rated-message')}>Bạn đã đánh giá tài liệu này</p>}
                </div>

                <button 
                    className={cx('rating-button')} 
                    onClick={handleRatingClick}
                    disabled={hasRated}
                    style={{ opacity: hasRated ? 0.5 : 1, cursor: hasRated ? 'not-allowed' : 'pointer' }}
                >
                    {hasRated ? 'Đã đánh giá' : 'Đánh giá'}
                </button>
            </div>
            <hr />

            <div className={cx('author')}>
                <h3>Tài liệu được đăng bởi:</h3>
                <div className={cx('author-detail')}>
                    <img src={doc?.profilePicture ? doc.profilePicture : Avatar} alt="avatar" />
                    <div className={cx('name')}>
                        <h3>{doc?.authorName}</h3>
                        <span>Khoa {doc?.facultyName}</span>
                    </div>
                </div>
            </div>
            <hr />

            <div className={cx('category')}>
                <h3
                    onClick={() =>
                        toast('🦄 Coming soon!', {
                            position: 'top-right',
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        })
                    }
                >
                    <FlagIcon /> Báo cáo tài liệu
                </h3>
            </div>
            <hr />

            {/* Feedback Modal with Framer Motion */}
            <AnimatePresence>
                {showFeedbackModal && (
                    <motion.div
                        className={cx('modal-overlay')}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                    >
                        <motion.div
                            className={cx('modal')}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={modalVariants}
                        >
                            <h3>Xác nhận đánh giá</h3>
                            <p>
                                Bạn đã đánh giá {userRating} sao. Hãy cho chúng tôi biết lý do bạn đưa ra đánh giá này.
                            </p>
                            <textarea
                                className={cx('feedback-textarea')}
                                placeholder="Hãy chia sẻ phản hồi của bạn..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className={cx('modal-buttons')}>
                                <button className={cx('submit-btn')} onClick={handleSubmitFeedback}>
                                    Gửi đánh giá
                                </button>
                                <button className={cx('cancel-btn')} onClick={() => setShowFeedbackModal(false)}>
                                    Quay lại
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Modal with Framer Motion */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        className={cx('modal-overlay')}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                    >
                        <motion.div
                            className={cx('success-modal')}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={modalVariants}
                        >
                            <motion.div
                                className={cx('success-icon')}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2,
                                }}
                            >
                                ✓
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Cảm ơn bạn đã đánh giá!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Đánh giá {userRating} sao của bạn đã được gửi.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
