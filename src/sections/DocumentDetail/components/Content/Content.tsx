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
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Box, Typography, Button, TextField, Slider, Stack } from '@mui/material';
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
    const [durationError, setDurationError] = useState<string>('');
    const [questionCountError, setQuestionCountError] = useState<string>('');
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
    const { loading } = useAppSelector((state) => state.aiQuiz);
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

    const validateForm = (): boolean => {
        let isValid = true;
        
        if (examDuration < 1 || examDuration > 30) {
            setDurationError('Thời gian phải từ 1-30 phút');
            isValid = false;
        } else {
            setDurationError('');
        }
        
        if (questionCount < 1 || questionCount > 15) {
            setQuestionCountError('Số câu hỏi phải từ 1-15');
            isValid = false;
        } else {
            setQuestionCountError('');
        }
        
        return isValid;
    };

    const handleSubmitExam = () => {
        if (!validateForm()) return;
        
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
        );
        navigate(`/document/ai-quiz/test-process`);
    };

    const handleDurationChange = (_: Event, newValue: number | number[]) => {
        setExamDuration(newValue as number);
        if (durationError) setDurationError('');
    };

    const handleDurationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setExamDuration(Math.min(Math.max(value, 1), 30));
            setDurationError('');
        }
    };

    const handleQuestionCountChange = (_: Event, newValue: number | number[]) => {
        setQuestionCount(newValue as number);
        if (questionCountError) setQuestionCountError('');
    };

    const handleQuestionCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setQuestionCount(Math.min(Math.max(value, 1), 15));
            setQuestionCountError('');
        }
    };

    // Modal style
    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

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
                        {loading ? <CircularProgress size={20} /> : 'Tạo bài thi'}
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

            {/* Exam creation modal - MUI version */}
            <Modal
                open={openExamModal}
                onClose={() => setOpenExamModal(false)}
                aria-labelledby="exam-modal-title"
                aria-describedby="exam-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="exam-modal-title" variant="h6" component="h2" gutterBottom>
                        Tạo bài thi
                    </Typography>
                    
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Typography gutterBottom>Thời gian làm bài (phút)</Typography>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <Slider
                                value={examDuration}
                                onChange={handleDurationChange}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={30}
                                aria-labelledby="duration-slider"
                                color="error"
                            />
                            <TextField
                                value={examDuration}
                                onChange={handleDurationInputChange}
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 30,
                                    type: 'number',
                                }}
                                sx={{ width: 90 }}
                                size="small"
                                error={!!durationError}
                                helperText={durationError}
                                color="error"
                            />
                        </Stack>
                        
                        <Typography gutterBottom sx={{ mt: 3 }}>Số lượng câu hỏi</Typography>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <Slider
                                value={questionCount}
                                onChange={handleQuestionCountChange}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={15}
                                aria-labelledby="questions-slider"
                                color="error"
                            />
                            <TextField
                                value={questionCount}
                                onChange={handleQuestionCountInputChange}
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 15,
                                    type: 'number',
                                }}
                                sx={{ width: 90 }}
                                size="small"
                                error={!!questionCountError}
                                helperText={questionCountError}
                                color="error"
                            />
                        </Stack>
                    </Box>
                    
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => setOpenExamModal(false)}
                            color="error"
                            sx={{ borderColor: 'error.main', '&:hover': { borderColor: 'error.dark' } }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmitExam}
                            disabled={loading}
                            color="error"
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo bài thi'}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

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
