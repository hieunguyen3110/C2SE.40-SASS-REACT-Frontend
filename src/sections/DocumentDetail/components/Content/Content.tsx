import classNames from 'classnames/bind';
import styles from './Content.module.scss';

const cx = classNames.bind(styles);

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useState } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { useSharingModal } from '../../../../contexts/SharingModalContext';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { DownloadDocumentAction, SaveDocumentStogeAction } from '../../../../redux/DocumentSlice/documentSlice';
import AlertModal from '../../../../components/AlertModal/AlertModal';
import { toast } from 'react-toastify';
import { startAssignmentAction } from '../../../../redux/AIQuizSlice/aiQuizSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DocumentResponse } from '../../../../redux/DocumentSlice/InterfaceResponse';

interface IDetailDoc {
    url: string | undefined;
    id: number;
    doc: DocumentResponse
}

function Content({ url, id , doc}: IDetailDoc) {
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openExamModal, setOpenExamModal] = useState(false);
    const [openExistingSessionModal, setOpenExistingSessionModal] = useState(false);
    const [examDuration, setExamDuration] = useState<number>(10);
    const [questionCount, setQuestionCount] = useState<number>(5);
    const { accountId } = useAppSelector((state) => state.authentication);
    const navigate = useNavigate();
    // configs cho nút chia sẻ
    const { openSharingModal, setUrl,setDoc } = useSharingModal();
    const handleOpenModal = (id: number) => {
        setUrl(`${import.meta.env.VITE_CLIENT_URL}/document/${id}`);
        setDoc({
            documentId: doc.docId.toString(),
            documentName: doc.title,
            docFilePath: doc.filePath
        })
        openSharingModal();
    };
    const { username } = useAppSelector((state) => state.authentication);
    const { DocumentDetail } = useAppSelector((state) => state.document);
    const dispatch = useAppDispatch();

    const handleDownload = () => {
        dispatch(DownloadDocumentAction({ documentId: id, username }));
    };

    const handleSave = () => {
        dispatch(SaveDocumentStogeAction(id));
    };

    const handleCreateExam = () => {
        if (DocumentDetail?.fileSize && DocumentDetail.fileSize < 5) {
            setOpenExamModal(true);
        } else {
            setOpenConfirmModal(true);
        }
    };

    const handleConfirmCreateExam = () => {
        setOpenConfirmModal(false);
        setOpenExamModal(true);
    };

    const handleCancelCreateExam = () => {
        setOpenConfirmModal(false);
    };

    const continueExistingSession = () => {
        setOpenExistingSessionModal(false);
        navigate('/document/ai-quiz/test-process');
    };

    const handleSubmitExam = () => {
        setOpenExamModal(false);
        const currentSession = Cookies.get('quiz_session');
        if (currentSession) {
            setOpenExistingSessionModal(true);
            return;
        }
        if (!id || !DocumentDetail?.subjectId) {
            toast.error('Không tìm thấy môn học');
            return;
        }
        // Generate session ID locally using userId and timestamp
        const currentTime = new Date().getTime();
        const localSessionId = `${accountId || 'guest'}_${currentTime}`;
        const startTimeStr = new Date(currentTime).toISOString();
        const endTimeStr = new Date(currentTime + examDuration * 60 * 1000).toISOString();

        dispatch(
            startAssignmentAction({
                docId: id,
                subjectId: DocumentDetail.subjectId,
                numberOfQuestions: questionCount,
                duration: examDuration,
                sessionId: localSessionId,
                startTime: startTimeStr,
                endTime: endTimeStr,
                isCompleted: false,
            }),
        )
            .unwrap()
            .then(() => {
                // Create quiz data object
                const quizData = {
                    sessionId: localSessionId,
                    startTime: currentTime,
                    endTime: endTimeStr,
                    duration: examDuration * 60 * 1000, // Chuyển từ phút sang milliseconds
                    subjectId: DocumentDetail.subjectId,
                    numberOfQuestions: questionCount,
                    subjectName: DocumentDetail.subjectName,
                };

                // Set cookie with expiration time based on quiz duration
                Cookies.set('quiz_session', JSON.stringify(quizData), {
                    expires: new Date(currentTime + examDuration * 60 * 1000),
                    sameSite: 'strict',
                });

                // Chuyển hướng đến trang làm bài không cần sessionId
                navigate(`/document/ai-quiz/test-process`);
            })
            .catch((error) => {
                console.error('Error starting quiz:', error);
            });
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setExamDuration(Math.min(Math.max(value, 1), 30));
    };

    const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setQuestionCount(Math.min(Math.max(value, 1), 15));
    };

    const ExamFormContent = () => (
        <div className={cx('exam-form')}>
            <div className={cx('form-group')}>
                <label htmlFor="duration">Thời gian làm bài (phút):</label>
                <input
                    type="number"
                    id="duration"
                    value={examDuration}
                    onChange={handleDurationChange}
                    min={1}
                    max={30}
                />
                <small className={cx('form-hint')}>Tối đa 30 phút</small>
            </div>
            <div className={cx('form-group')}>
                <label htmlFor="questionCount">Số lượng câu hỏi:</label>
                <input
                    type="number"
                    id="questionCount"
                    value={questionCount}
                    onChange={handleQuestionCountChange}
                    min={1}
                    max={15}
                />
                <small className={cx('form-hint')}>Tối đa 15 câu hỏi</small>
            </div>
        </div>
    );

    return (
        <div
            className={cx('content')}
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}
        >
            <div className={cx('actions')}>
                <button onClick={handleDownload}>
                    <FileDownloadOutlinedIcon /> Tải xuống
                </button>
                <div className={cx('right-actions')}>
                    <button onClick={handleCreateExam}>
                        <AssignmentOutlinedIcon sx={{ color: 'black' }} />
                        Tạo bài thi
                    </button>
                    <button onClick={handleSave}>
                        <BookmarkBorderOutlinedIcon />
                        Lưu
                    </button>
                    <button onClick={() => handleOpenModal(id)}>
                        <ShortcutOutlinedIcon sx={{ color: 'black' }} />
                        Chia sẻ
                    </button>
                </div>
            </div>
            <hr />
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {url && <Viewer fileUrl={url} />}
            </Worker>

            {/* Size warning modal */}
            <AlertModal
                isOpen={openConfirmModal}
                onClose={handleCancelCreateExam}
                title="Xác nhận tạo bài thi"
                content="Dung lượng file lớn, quá trình tạo bài thi có thể mất nhiều thời gian. Bạn có muốn tiếp tục?"
                onConfirm={handleConfirmCreateExam}
                confirmText="Chấp nhận"
            />

            {/* Exam creation modal */}
            <AlertModal
                isOpen={openExamModal}
                onClose={() => setOpenExamModal(false)}
                title="Tạo bài thi"
                content={<ExamFormContent />}
                onConfirm={handleSubmitExam}
                confirmText="Tạo bài thi"
            />

            {/* Existing session modal */}
            <AlertModal
                isOpen={openExistingSessionModal}
                onClose={() => setOpenExistingSessionModal(false)}
                title="Bài thi đang diễn ra"
                content="Bạn đang có một phiên bài thi chưa hoàn thành. Bạn không thể bắt đầu bài thi mới cho đến khi phiên hiện tại kết thúc."
                onConfirm={continueExistingSession}
                confirmText="Tiếp tục làm bài"
            />
        </div>
    );
}

export default Content;
