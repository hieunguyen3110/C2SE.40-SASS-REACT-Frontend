import classNames from 'classnames/bind';
import styles from './DocumentDetailView.module.scss';
import { Sidebar } from '../components/Sidebar';
import { Content } from '../components/Content';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { useParams } from 'react-router-dom';
import { getDocumentByIDAction } from '../../../redux/DocumentSlice/documentSlice';
import Loader from '../../../components/Loader/Loader';
import { trackingViewTimeDocumentDetail, ViewTimeRequest } from '../../../services/DocumentViewAPI/DocumentViewApi';
const cx = classNames.bind(styles);

export default function DocumentDetailView() {
    const { id }: any = useParams();
    const dispatch = useAppDispatch();

    const document: any = useAppSelector((state) => state.document.DocumentDetail);

    const { loading } = useAppSelector((state) => state.document);

    // Calculate total ratings and average rating from accountRatingDtos
    const documentWithRatings = useMemo(() => {
        if (!document) return null;

        const accountRatings = document.accountRatingDtos || [];
        const totalRatings = accountRatings.length;

        // Calculate average rating if there are ratings
        const rating =
            totalRatings > 0
                ? accountRatings.reduce((sum: number, item: any) => sum + item.rating, 0) / totalRatings
                : 0;

        return {
            ...document,
            totalRatings,
            rating,
        };
    }, [document]);

    useEffect(() => {
        dispatch(getDocumentByIDAction(parseInt(id)));
    }, [dispatch, id]);
    useEffect(() => {
        const startTime = Date.now();

        const handleBeforeUnload = async () => {
            const endTime = Date.now();
            const timeSpentSeconds = Math.round((endTime - startTime) / 1000);
            if (id && timeSpentSeconds !== 0) {
                const data: ViewTimeRequest = {
                    docId: id,
                    startTime: new Date(),
                    duration: timeSpentSeconds,
                };
                await trackingViewTimeDocumentDetail(data);
            }
            console.log(`Người dùng đã ở lại trang trong: ${timeSpentSeconds} giây`);

            // Nếu bạn muốn gửi dữ liệu về server:
            // navigator.sendBeacon('/api/tracking', JSON.stringify({ timeSpentSeconds }));
        };

        // Gắn sự kiện khi unload trang
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Dọn dẹp khi component unmount (trường hợp dùng SPA)
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [id]);

    if (loading) {
        return <Loader height={100} />;
    }

    return (
        <div className={cx('document-detail-view')}>
            <Sidebar doc={documentWithRatings} />
            <Content id={Number.parseInt(id)} url={document?.filePath} />
        </div>
    );
}
