import { useState } from 'react';
import styles from './TestProcess.module.scss';
import classNames from 'classnames/bind';
import { BarChart, NavigateBefore, NavigateNext, Close, Warning } from '@mui/icons-material';
import { Modal, Typography } from '@mui/material';

const cx = classNames.bind(styles);

interface Question {
    id: number;
    text: string;
    options: { id: number; text: string }[];
    selectedAnswer?: number;
}

export default function TestProcess() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: 'What is the formula for the area of a circle?',
            options: [
                { id: 1, text: 'A = πr²' },
                { id: 2, text: 'A = 2πr' },
                { id: 3, text: 'A = πd' },
                { id: 4, text: 'A = r²' },
            ],
        },
        {
            id: 2,
            text: 'Question 2',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
        {
            id: 3,
            text: 'What is the value of x in the equation 2x + 5 = 15?',
            options: [
                { id: 1, text: 'x = 5' },
                { id: 2, text: 'x = 7' },
                { id: 3, text: 'x = 10' },
                { id: 4, text: 'x = 20' },
            ],
            selectedAnswer: 1,
        },
        {
            id: 4,
            text: 'Question 4',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
        {
            id: 5,
            text: 'Question 5',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
    ]);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);

    const currentQuestionData = questions.find((q) => q.id === currentQuestion) || questions[0];
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter((q) => q.selectedAnswer !== undefined).length;
    const isLastQuestion = currentQuestion === totalQuestions;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    const handleSelectOption = (optionId: number) => {
        // Automatically save the answer when selecting an option
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === currentQuestion ? { ...question, selectedAnswer: optionId } : question,
            ),
        );

        // Optional: automatically move to next question after selection
        // if (currentQuestion < totalQuestions) {
        //   setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
        // }
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
        // Xử lý logic khi người dùng nộp bài kiểm tra
        console.log('Bài kiểm tra đã được nộp', questions);

        // Đóng modal
        setOpenSubmitModal(false);

        // Có thể xử lý dữ liệu ở đây hoặc gửi lên server
        // Ví dụ: gửi kết quả lên server API
        // submitTestResults(questions);

        // Sau đó có thể chuyển hướng đến trang kết quả
        // navigate('/test-results', { state: { answers: questions } });
    };

    return (
        <div className={cx('test-process')}>
            <div className={cx('header')}>
                <div className={cx('title')}>
                    <BarChart className={cx('icon')} />
                    <h1>Mathematics</h1>
                    <span className={cx('test-label')}>Test</span>
                </div>
                <div className={cx('progress-container')}>
                    <div className={cx('progress-bar')}>
                        <div
                            className={cx('progress')}
                            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                    <span className={cx('progress-text')}>
                        {answeredQuestions}/{totalQuestions} Questions Answered
                    </span>
                </div>
            </div>

            <div className={cx('question-nav')}>
                {questions.map((question) => (
                    <button
                        key={question.id}
                        className={cx('question-number', {
                            active: question.id === currentQuestion,
                            answered: question.selectedAnswer !== undefined,
                        })}
                        onClick={() => setCurrentQuestion(question.id)}
                    >
                        {question.id}
                    </button>
                ))}
            </div>

            <div className={cx('question-container')}>
                <div className={cx('question-header')}>
                    <div className={cx('question-label')}>Question {currentQuestion}</div>
                </div>

                <div className={cx('question-text')}>{currentQuestionData.text}</div>

                <div className={cx('options-container')}>
                    {currentQuestionData.options.map((option) => (
                        <div
                            key={option.id}
                            className={cx('option', {
                                selected: option.id === currentQuestionData.selectedAnswer,
                            })}
                            onClick={() => handleSelectOption(option.id)}
                        >
                            <div className={cx('radio')}>
                                {option.id === currentQuestionData.selectedAnswer && (
                                    <div className={cx('radio-dot')}></div>
                                )}
                            </div>
                            <span>{option.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('navigation')}>
                <button className={cx('nav-button', 'prev')} onClick={handlePrevious}>
                    <NavigateBefore />
                    <span>Previous</span>
                </button>

                {isLastQuestion ? (
                    <button className={cx('nav-button', 'submit')} onClick={handleOpenSubmitModal}>
                        <span>Submit</span>
                    </button>
                ) : (
                    <button className={cx('nav-button', 'next')} onClick={handleNext}>
                        <span>Next</span>
                        <NavigateNext />
                    </button>
                )}
            </div>

            {/* Submit Confirmation Modal */}
            <Modal
                open={openSubmitModal}
                onClose={handleCloseSubmitModal}
                aria-labelledby="submit-modal-title"
                aria-describedby="submit-modal-description"
            >
                <div className={cx('submit-modal')}>
                    <div className={cx('submit-modal-header')}>
                        <Typography id="submit-modal-title" variant="h6" component="h2">
                            Xác nhận nộp bài
                        </Typography>
                        <button className={cx('close-button')} onClick={handleCloseSubmitModal}>
                            <Close />
                        </button>
                    </div>

                    <div className={cx('submit-modal-content')}>
                        <div className={cx('progress-summary')}>
                            <div className={cx('progress-circle-container')}>
                                <div
                                    className={cx('progress-circle')}
                                    style={{
                                        background: `conic-gradient(
                      #ff0000 0% ${(answeredQuestions / totalQuestions) * 100}%, 
                      #f0f0f0 ${(answeredQuestions / totalQuestions) * 100}% 100%
                    )`,
                                    }}
                                >
                                    <div className={cx('progress-circle-inner')}>
                                        <span className={cx('progress-percentage')}>
                                            {Math.round((answeredQuestions / totalQuestions) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('progress-text-summary')}>
                                    <span className={cx('answered-text')}>
                                        Đã trả lời: <strong>{answeredQuestions}</strong>
                                    </span>
                                    <span className={cx('total-text')}>
                                        Tổng số câu: <strong>{totalQuestions}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {unansweredQuestions > 0 && (
                            <div className={cx('warning-message')}>
                                <Warning className={cx('warning-icon')} />
                                <Typography>
                                    Bạn còn <strong>{unansweredQuestions}</strong> câu hỏi chưa trả lời.
                                </Typography>
                            </div>
                        )}

                        <Typography id="submit-modal-description" className={cx('confirmation-text')}>
                            Bạn có chắc chắn muốn nộp bài kiểm tra này?
                        </Typography>
                    </div>

                    <div className={cx('submit-modal-actions')}>
                        <button className={cx('modal-button', 'cancel')} onClick={handleCloseSubmitModal}>
                            Quay lại
                        </button>
                        <button className={cx('modal-button', 'confirm')} onClick={handleSubmit}>
                            Nộp bài
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
