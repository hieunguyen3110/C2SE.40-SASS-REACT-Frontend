import { useState, useEffect } from 'react';
import styles from './TestProcess.module.scss';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { QuestionDTO } from '../../../../types/quiz.types';
import {
    submitAction,
    updateSessionAnswerAction,
    restoreSessionAction,
} from '../../../../redux/AIQuizSlice/aiQuizSlice';
import { Question } from '../types';
import {
    TestHeader,
    QuestionNavigation,
    QuestionDisplay,
    NavigationButtons,
    SubmitModal,
    ReviewModal,
    LoadingState,
    ErrorState,
} from '../components';

const cx = classNames.bind(styles);

export default function TestProcess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Get quiz data from Redux
    const { currentSession, loading, error } = useAppSelector((state) => state.aiQuiz);

    const [subjectName, setSubjectName] = useState<string>('Subject');
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [timer, setTimer] = useState<number>(3600); // 60 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
    const [isAssignment, setIsAssignment] = useState<boolean>(false);
    const [showLoadingBackButton, setShowLoadingBackButton] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Load quiz data from cookie and Redux
    useEffect(() => {
        if (!loading) {
            const quizCookie = Cookies.get('quiz_session');
            console.log('quizCookie', quizCookie);
            // If no quiz cookie exists, navigate back to knowledge test page
            if (!quizCookie) {
                toast.error('No active quiz session found');
                navigate('/document/ai-quiz');
                return;
            }

            try {
                const quizData = JSON.parse(quizCookie);

                // Check if the quiz time has expired
                const now = new Date().getTime();
                const endTime = new Date(quizData.endTime).getTime();

                if (now >= endTime) {
                    Cookies.remove('quiz_session');
                    toast.error('Quiz time has expired');
                    navigate('/document/ai-quiz');
                    return;
                }

                // Calculate remaining time
                const remainingTimeInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
                setTimer(remainingTimeInSeconds);
                setSubjectName(quizData.subjectName || 'Subject');

                // If there's no current session in Redux, restore it from cookie data
                if (!currentSession && !loading) {
                    dispatch(restoreSessionAction({ isAssignment: isAssignment }));
                }
            } catch (error) {
                console.error('Error parsing quiz cookie:', error);
                toast.error('Error loading quiz data');
                navigate('/document/ai-quiz');
            }
        }
    }, [loading]);

    // Transform Redux questions to component format
    useEffect(() => {
        if (currentSession && currentSession.questions && currentSession.questions.length > 0) {
            // Transform questions to match the component's format
            const transformedQuestions = currentSession.questions.map((q: QuestionDTO, index: number) => {
                // Convert options object to array format
                const optionsArray = Object.entries(q.options).map(([key, value]) => ({
                    id: key,
                    text: value,
                }));

                // Find if there's a user answer for this question
                const userAnswer =
                    currentSession.userAnswers && currentSession.userAnswers[index]
                        ? currentSession.userAnswers[index]
                        : undefined;

                return {
                    id: index + 1,
                    text: q.question,
                    options: optionsArray,
                    selectedAnswer: userAnswer,
                };
            });

            setQuestions(transformedQuestions);

            if (currentSession.subject) {
                setSubjectName(currentSession.subject.subjectName || 'Subject');
            }

            // Set assignment status
            setIsAssignment(currentSession.assignment || false);
        }
    }, [currentSession]);

    const currentQuestionData = questions.find((q) => q.id === currentQuestion) || questions[0];
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter((q) => q.selectedAnswer !== undefined).length;
    const isLastQuestion = currentQuestion === totalQuestions;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timer <= 0) {
            // Auto-submit when time is up
            toast.warning('Thời gian làm bài đã hết');
            handleSubmit();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, isTimerActive]);

    // Format time as MM:SS
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionId: string) => {
        // Update the questions state with the selected answer
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === currentQuestion ? { ...question, selectedAnswer: optionId } : question,
            ),
        );

        // Update Redux state with user answer
        if (currentSession && currentSession.subjectId) {
            dispatch(
                updateSessionAnswerAction({
                    userAnswer: optionId,
                    isAssignment: isAssignment,
                    questionIndex: currentQuestion - 1,
                }),
            );
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleOpenSubmitModal = () => {
        setOpenSubmitModal(true);
    };

    const handleCloseSubmitModal = () => {
        setOpenSubmitModal(false);
    };

    const handleSubmit = () => {
        // Prevent double submissions
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Get all user answers
        const userAnswers = questions.map((q) => q.selectedAnswer || '');

        // Submit the answers to the Redux store
        if (currentSession && currentSession.subjectId) {
            dispatch(
                submitAction({
                    docId: currentSession.docId,
                    subjectId: currentSession.subjectId,
                    userAnswers: userAnswers,
                    isAssignment: isAssignment,
                }),
            )
                .unwrap()
                .then((gradeData) => {
                    // Close modal
                    setOpenSubmitModal(false);

                    // Stop the timer
                    setIsTimerActive(false);

                    // Remove the quiz cookie after submission
                    Cookies.remove('quiz_session');

                    // Navigate to the test result page with the actual grade ID
                    navigate(`/document/ai-quiz/test-result/${gradeData.id}`);
                })
                .catch((error) => {
                    console.error('Error submitting quiz:', error);
                    toast.error('Error submitting quiz. Please try again.');
                    setIsSubmitting(false);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            toast.error('Quiz session data is missing. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleOpenReviewModal = () => {
        setOpenReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setOpenReviewModal(false);
    };

    const handleGoToQuestion = (questionId: number) => {
        setCurrentQuestion(questionId);
        handleCloseReviewModal();
    };

    // Set a timeout to show the back button if loading takes too long
    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (loading) {
            timerId = setTimeout(() => {
                setShowLoadingBackButton(true);
            }, 10000); // Show back button after 10 seconds of loading
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [loading]);

    // Show submitting state
    if (isSubmitting) {
        return <LoadingState message="Submitting your answers... Please wait." />;
    }

    // Show loading state while waiting for data
    if (loading) {
        return <LoadingState showBackButton={showLoadingBackButton} />;
    }

    // Show error message if there's an error
    if (error && !loading && !currentSession) {
        return <ErrorState message={error} />;
    }

    // Don't render anything if no questions available yet
    if (!currentSession || !questions.length) {
        return <LoadingState message="Preparing your quiz..." showBackButton={showLoadingBackButton} />;
    }

    return (
        <motion.div
            className={cx('test-process')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <TestHeader
                subjectName={subjectName}
                answeredQuestions={answeredQuestions}
                totalQuestions={totalQuestions}
                timer={timer}
            />

            <QuestionNavigation
                currentQuestion={currentQuestion}
                questions={questions}
                setCurrentQuestion={setCurrentQuestion}
                handleOpenReviewModal={handleOpenReviewModal}
            />

            <AnimatePresence mode="wait" initial={false}>
                {currentQuestionData && (
                    <QuestionDisplay
                        key={currentQuestion}
                        currentQuestionData={currentQuestionData}
                        handleSelectOption={handleSelectOption}
                    />
                )}
            </AnimatePresence>

            <NavigationButtons
                isLastQuestion={isLastQuestion}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleOpenSubmitModal={handleOpenSubmitModal}
            />

            {/* Submit Confirmation Modal */}
            <AnimatePresence>
                {openSubmitModal && (
                    <SubmitModal
                        open={openSubmitModal}
                        answeredQuestions={answeredQuestions}
                        totalQuestions={totalQuestions}
                        unansweredQuestions={unansweredQuestions}
                        formatTime={formatTime}
                        handleClose={handleCloseSubmitModal}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            {/* Review Questions Modal */}
            <AnimatePresence>
                {openReviewModal && (
                    <ReviewModal
                        open={openReviewModal}
                        questions={questions}
                        currentQuestion={currentQuestion}
                        answeredQuestions={answeredQuestions}
                        totalQuestions={totalQuestions}
                        formatTime={formatTime}
                        handleClose={handleCloseReviewModal}
                        handleGoToQuestion={handleGoToQuestion}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
