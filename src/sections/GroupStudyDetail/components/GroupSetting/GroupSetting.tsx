import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './GroupSetting.module.scss';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { deleteGroupAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import { motion } from 'framer-motion';

// Components
import GroupEditForm from '../GroupEditForm/GroupEditForm';

// MUI components
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Slide,
    Zoom,
    Alert,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import React from 'react';

const cx = classNames.bind(styles);

// Dialog transition
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
    },
};

export default function GroupSetting() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const groupId = id ? parseInt(id) : 0;

    // Get authentication state and group data
    const { accountId } = useAppSelector((state) => state.authentication);
    const { currentGroup } = useAppSelector((state) => state.groupStudy);

    // Check if current user is the owner
    const isOwner = currentGroup?.userId === accountId;

    // State for dialogs
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

    // Handle edit dialog
    const handleOpenEditDialog = () => setOpenEditDialog(true);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    // Handle delete dialog
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    // Handle leave group dialog
    const handleOpenLeaveDialog = () => setOpenLeaveDialog(true);
    const handleCloseLeaveDialog = () => setOpenLeaveDialog(false);

    // Handle confirm dialog
    const handleOpenConfirmDialog = () => {
        handleCloseDeleteDialog();
        setOpenConfirmDialog(true);
        setConfirmText('');
        setIsDeleteEnabled(false);
    };
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setConfirmText('');
    };

    // Check if delete should be enabled
    useEffect(() => {
        setIsDeleteEnabled(confirmText === 'XOÁ');
    }, [confirmText]);

    // Handle confirm text change
    const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmText(e.target.value);
    };

    // Handle delete group
    const handleDeleteGroup = async () => {
        try {
            await dispatch(deleteGroupAction(groupId)).unwrap();
            handleCloseConfirmDialog();
            navigate('/group-study');
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    // Handle leave group
    const handleLeaveGroup = async () => {
        try {
            // Assuming there's a leaveGroupAction in your Redux slice, if not, you'll need to create it
            // await dispatch(leaveGroupAction(groupId)).unwrap();
            // For now, just navigate back to group-study page
            handleCloseLeaveDialog();
            navigate('/group-study');
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    return (
        <motion.div className={cx('container')} variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className={cx('header')} variants={itemVariants}>
                <SettingsIcon className={cx('icon')} />
                <h2>Cài đặt nhóm</h2>
            </motion.div>

            {!isOwner && (
                <motion.div variants={itemVariants} className={cx('owner-warning')}>
                    <Alert severity="warning" icon={<LockIcon />} sx={{ marginBottom: '20px' }}>
                        Chỉ có chủ nhóm mới được phép chỉnh sửa hoặc xoá nhóm học tập này.
                    </Alert>
                </motion.div>
            )}

            <div className={cx('content')}>
                <motion.section className={cx('section')} variants={itemVariants}>
                    <h3>Chỉnh sửa thông tin nhóm</h3>
                    <p>Thay đổi thông tin nhóm, thiết lập quyền riêng tư và cài đặt khác</p>
                    <motion.div
                        whileHover={isOwner ? { scale: 1.02 } : { scale: 1 }}
                        whileTap={isOwner ? { scale: 0.98 } : { scale: 1 }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            className={cx('action-button')}
                            onClick={handleOpenEditDialog}
                            disabled={!isOwner}
                        >
                            Chỉnh sửa nhóm
                        </Button>
                    </motion.div>
                </motion.section>

                <Divider className={cx('divider')} />

                {!isOwner && (
                    <>
                        <motion.section className={cx('section', 'leave-section')} variants={itemVariants}>
                            <h3>Rời khỏi nhóm học tập</h3>
                            <p>Bạn sẽ không còn được tham gia các hoạt động của nhóm sau khi rời đi</p>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    startIcon={<ExitToAppIcon />}
                                    className={cx('leave-button')}
                                    onClick={handleOpenLeaveDialog}
                                >
                                    Rời nhóm
                                </Button>
                            </motion.div>
                        </motion.section>

                        <Divider className={cx('divider')} />
                    </>
                )}

                {isOwner && (
                    <motion.section className={cx('section', 'danger-zone')} variants={itemVariants}>
                        <div className={cx('danger-header')}>
                            <WarningIcon className={cx('warning-icon')} />
                            <h3>Vùng nguy hiểm</h3>
                        </div>

                        <div className={cx('danger-action')}>
                            <div>
                                <h4>Xoá nhóm học tập</h4>
                                <p>Hành động này không thể hoàn tác. Tất cả dữ liệu nhóm sẽ bị xoá vĩnh viễn.</p>
                            </div>
                            <motion.div
                                whileHover={isOwner ? { scale: 1.05 } : { scale: 1 }}
                                whileTap={isOwner ? { scale: 0.95 } : { scale: 1 }}
                            >
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    className={cx('delete-button')}
                                    onClick={handleOpenDeleteDialog}
                                    disabled={!isOwner}
                                >
                                    Xoá nhóm
                                </Button>
                            </motion.div>
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Edit Dialog */}
            <GroupEditForm open={openEditDialog} onClose={handleCloseEditDialog} />

            {/* Delete Warning Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                TransitionComponent={Transition}
                aria-labelledby="delete-dialog-title"
                PaperProps={{
                    className: cx('dialog-paper'),
                }}
            >
                <DialogTitle id="delete-dialog-title" className={cx('delete-dialog-title')}>
                    <WarningIcon className={cx('warning-icon')} />
                    Xác nhận xoá nhóm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={cx('delete-dialog-content')}>
                        Bạn chắc chắn muốn xoá nhóm học tập này? Hành động này sẽ xoá vĩnh viễn toàn bộ dữ liệu của
                        nhóm, bao gồm các bài đăng, tài liệu và thông tin thành viên. Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={cx('delete-dialog-actions')}>
                    <Button onClick={handleCloseDeleteDialog} className={cx('cancel-button')}>
                        Huỷ
                    </Button>
                    <Zoom in={openDeleteDialog} style={{ transitionDelay: '200ms' }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleOpenConfirmDialog}
                            className={cx('confirm-button')}
                        >
                            Xoá nhóm
                        </Button>
                    </Zoom>
                </DialogActions>
            </Dialog>

            {/* Leave Group Dialog */}
            <Dialog
                open={openLeaveDialog}
                onClose={handleCloseLeaveDialog}
                TransitionComponent={Transition}
                aria-labelledby="leave-dialog-title"
                PaperProps={{
                    className: cx('dialog-paper'),
                }}
            >
                <DialogTitle id="leave-dialog-title" className={cx('leave-dialog-title')}>
                    <ExitToAppIcon className={cx('warning-icon')} />
                    Xác nhận rời nhóm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={cx('leave-dialog-content')}>
                        Bạn chắc chắn muốn rời khỏi nhóm học tập này? Sau khi rời đi, bạn sẽ không thể tham gia vào các
                        hoạt động của nhóm và không thể xem các tài liệu của nhóm nữa.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={cx('leave-dialog-actions')}>
                    <Button onClick={handleCloseLeaveDialog} className={cx('cancel-button')}>
                        Huỷ
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleLeaveGroup}
                        className={cx('confirm-button')}
                    >
                        Rời nhóm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Final Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                TransitionComponent={Transition}
                aria-labelledby="confirm-dialog-title"
                PaperProps={{
                    className: cx('dialog-paper'),
                }}
            >
                <DialogTitle id="confirm-dialog-title" className={cx('confirm-dialog-title')}>
                    <WarningIcon className={cx('warning-icon')} />
                    Xác nhận cuối cùng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={cx('confirm-dialog-content')}>
                        ĐÂY LÀ HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC! Nhập "XOÁ" vào ô bên dưới để xác nhận rằng bạn hiểu và muốn
                        tiếp tục.
                    </DialogContentText>
                    <input
                        type="text"
                        placeholder="Nhập 'XOÁ' để xác nhận"
                        className={cx('confirm-input')}
                        value={confirmText}
                        onChange={handleConfirmTextChange}
                    />
                </DialogContent>
                <DialogActions className={cx('confirm-dialog-actions')}>
                    <Button onClick={handleCloseConfirmDialog} className={cx('cancel-button')}>
                        Huỷ
                    </Button>
                    <Zoom in={isDeleteEnabled} style={{ transitionDelay: isDeleteEnabled ? '100ms' : '0ms' }}>
                        <span>
                            {' '}
                            {/* Wrap in span for the disabled state to show properly */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteGroup}
                                className={cx('delete-button')}
                                disabled={!isDeleteEnabled}
                            >
                                Xoá vĩnh viễn
                            </Button>
                        </span>
                    </Zoom>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}
