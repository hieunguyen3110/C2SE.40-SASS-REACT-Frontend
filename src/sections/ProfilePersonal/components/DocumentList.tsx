import { motion } from 'framer-motion';
import classnames from 'classnames/bind';
import styles from './ProfilePersonalComponents.module.scss';
import DocumentListItem from './DocumentListItem';

// Types
import { GetDocument } from '../../../services/DocumentAPI/DocumentAPI';
import { GetProfileRequest } from '../../../services/ProfilePersonalAPI/ProfilePersonalAPI';

const cx = classnames.bind(styles);

interface DocumentListProps {
  documents: GetDocument[];
  profileData: GetProfileRequest;
  onDownload: (docId: number) => void;
  onShare: (doc: GetDocument) => void;
  onEdit: (document: GetDocument, profileData: GetProfileRequest) => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DocumentList = ({ documents, profileData, onDownload, onShare, onEdit }: DocumentListProps) => {
  const emptyDocuments = documents.length === 0;

  return (
    <motion.div 
      className={cx('conponent-file-bottom')} 
      variants={fadeIn}
      whileHover={{ boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.08)' }}
      transition={{ duration: 0.3 }}
    >
      <div className={cx('file-bottom-title')}>
        <h3>TÀI LIỆU ĐÃ TẢI LÊN</h3>
      </div>
      
      {emptyDocuments ? (
        <motion.div 
          className={cx('empty-documents')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>Bạn chưa tải lên tài liệu nào</p>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: '#e62e2e' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Tải lên tài liệu mới
          </motion.button>
        </motion.div>
      ) : (
        <div className={cx('file-bottom-list')}>
          <div className={cx('bottom-list-title')}>
            <p>Tiêu đề tài liệu</p>
            <p>Chức năng</p>
          </div>
          <motion.div 
            className={cx('bottom-list-table')} 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {documents.map((document) => (
              <DocumentListItem
                key={document.docId}
                document={document}
                profileData={profileData}
                onDownload={onDownload}
                onShare={onShare}
                onEdit={onEdit}
              />
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentList; 