import classNames from 'classnames/bind';
import styles from './DocumentsView.module.scss';
const cx = classNames.bind(styles);
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import {
    approveDocuments,
    checkDocument,
    clearError,
    clearMessage,
    deleteDocuments,
    getDocumentsForAdmin,
    getStatsForAdmin,
} from '../../../../redux/AdminDashboardSlice/AdminDashboardSlice';
import AlertDialog from '../../Users/components/AlertDialog';
import ApproveDialog from '../../Users/components/ApproveDialog';
import Loader from '../../../../components/Loader/Loader';
import { toast } from 'react-toastify';

export default function DocumentsView() {
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const dispatch = useAppDispatch();

    const documents: any[] = useAppSelector((state: any) => state.adminDashboard.documents?.content);
    const { loading, successMessage, error } = useAppSelector((state) => state.adminDashboard);
    const { data: statsData, loading: statsLoading } = useAppSelector((state) => state.adminDashboard);

    useEffect(() => {
        if (documents && documents.length !== 0) {
            setData(documents);
        }
    }, [documents]);

    useEffect(() => {
        dispatch(getStatsForAdmin());
        dispatch(getDocumentsForAdmin({ page, size: 10 }));
    }, [dispatch, page]);

    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);

    const handleOpenAlertDialog = () => {
        if (selectedIds.length !== 0) {
            setOpenAlertDialog(true);
        } else {
            toast.error('Phải chọn ít nhất 1 tài liệu');
        }
    };
    
    const handleOpenApproveDialog = () => {
        if (selectedIds.length !== 0) {
            setOpenApproveDialog(true);
        } else {
            toast.error('Phải chọn ít nhất 1 tài liệu');
        }
    };
    
    const handleCloseAlertDialog = () => setOpenAlertDialog(false);
    const handleCloseApproveDialog = () => setOpenApproveDialog(false);

    const handleDeleteUsers = () => {
        try {
            dispatch(deleteDocuments(selectedIds));
        } catch (error: any) {
            toast.error('Xảy ra lỗi, vui lòng thử lại sau');
        }
    };

    const handleApproveDocuments = () => {
        try {
            dispatch(approveDocuments(selectedIds));
        } catch (error: any) {
            toast.error('Xảy ra lỗi, vui lòng thử lại sau');
        }
    };

    const handleReloadTable = () => {
        try {
            dispatch(getDocumentsForAdmin({ page, size: 10 }));
        } catch (error) {
            console.log(error);
            toast.error('Xảy ra lỗi, vui lòng thử lại sau');
        }
    };

    const handleCheckDocument = () => {
        try {
            if (selectedIds.length !== 1) {
                toast.error('Chọn duy nhất 1 tài liệu để kiểm tra');
                return;
            }
            dispatch(checkDocument(selectedIds[0]));
        } catch (error) {
            console.log(error);
            toast.error('Xảy ra lỗi, vui lòng thử lại sau');
        }
    };

    const handleToggleSelectDocument = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAllDocuments = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map((item: any) => item.docId));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setSelectedIds([]);
    };

    useEffect(() => {
        if (successMessage !== '') {
            if (openAlertDialog) {
                setOpenAlertDialog(false);
            } else {
                setOpenApproveDialog(false);
            }
            toast.success(successMessage);
            dispatch(clearMessage());
            setSelectedIds([]);
            handleReloadTable();
        }
    }, [successMessage]);

    useEffect(() => {
        if (error !== '') {
            if (openAlertDialog) {
                setOpenAlertDialog(false);
            } else {
                setOpenApproveDialog(false);
            }
            toast.error(error);
            dispatch(clearError());
            setSelectedIds([]);
            handleReloadTable();
        }
    }, [error]);

    return (
        <motion.div 
            className={cx('admin-documents-view')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className={cx('header')}>
                <h2 className={cx('title')}>DTUDASHBOARD / Quản lý tài liệu</h2>
                <div className={cx('search-container')}>
                    <input
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        placeholder="Tìm kiếm tài liệu..."
                        type="text"
                    />
                    <SearchIcon className={cx('search-icon')} />
                </div>
            </div>

            <div className={cx('actions-bar')}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cx('action-btn', 'check-btn')}
                    onClick={handleCheckDocument}
                >
                    Kiểm tra
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cx('action-btn', 'delete-btn')}
                    onClick={handleOpenAlertDialog}
                >
                    Xoá
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cx('action-btn', 'approve-btn')}
                    onClick={handleOpenApproveDialog}
                >
                    Duyệt tài liệu
                </motion.button>
            </div>

            {loading || statsLoading ? (
                <Loader height={1} />
            ) : (
                <div className={cx('table-container')}>
                    <table className={cx('documents-table')}>
                        <thead>
                            <tr>
                                <th className={cx('checkbox-column')}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === data.length && data.length > 0}
                                        onChange={handleSelectAllDocuments}
                                    />
                                </th>
                                <th>ID</th>
                                <th>Tên tài liệu</th>
                                <th>Môn học</th>
                                <th>Thư mục</th>
                                <th>Ngày tạo</th>
                                <th>Tác giả</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row: any) => (
                                    <motion.tr 
                                        key={row.docId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cx({ 'selected-row': selectedIds.includes(row.docId) })}
                                    >
                                        <td className={cx('checkbox-column')}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(row.docId)}
                                                onChange={() => handleToggleSelectDocument(row.docId)}
                                            />
                                        </td>
                                        <td>{row.docId}</td>
                                        <td className={cx('title-cell')}>{row.title}</td>
                                        <td>{row.subjectName}</td>
                                        <td>{row.folderName}</td>
                                        <td>{row.createdAt}</td>
                                        <td>{row.authorName}</td>
                                        <td className={cx('status-cell')}>
                                            <span className={cx('status-badge', { 'approved': row.isActive })}>
                                                {row.isActive ? 'Đã duyệt' : 'Chưa duyệt'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className={cx('empty-table')}>Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    <div className={cx('pagination')}>
                        <button 
                            disabled={page === 1} 
                            onClick={() => handlePageChange(page - 1)}
                            className={cx('pagination-btn')}
                        >
                            Trang trước
                        </button>
                        <span className={cx('page-indicator')}>
                            Trang {page} / {Math.ceil(statsData?.totalDocuments / 10)}
                        </span>
                        <button 
                            disabled={page >= Math.ceil(statsData?.totalDocuments / 10)} 
                            onClick={() => handlePageChange(page + 1)}
                            className={cx('pagination-btn')}
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            )}
            
            <AlertDialog
                open={openAlertDialog}
                onClose={handleCloseAlertDialog}
                onDelete={handleDeleteUsers}
                ids={selectedIds}
                title="tài liệu"
            />
            <ApproveDialog
                open={openApproveDialog}
                onClose={handleCloseApproveDialog}
                onApprove={handleApproveDocuments}
                ids={selectedIds}
                title="tài liệu"
            />
        </motion.div>
    );
}
