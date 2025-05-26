import { motion } from 'framer-motion';
import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './ProfilePersonalComponents.module.scss';

// Icons
import File from '../../../assets/images/File_dock.svg';
import EditIcon from '../../../assets/images/edit-05.png';
import ImportLight from '../../../assets/images/Import_light.png';
import Share from '../../../assets/images/fi_share-2.png';

// Types
import { GetDocument } from '../../../services/DocumentAPI/DocumentAPI';
import { GetProfileRequest } from '../../../services/ProfilePersonalAPI/ProfilePersonalAPI';

const cx = classnames.bind(styles);

interface DocumentListItemProps {
  document: GetDocument;
  onDownload: (docId: number) => void;
  onShare: (doc: GetDocument) => void;
  onEdit: (document: GetDocument, profileData: GetProfileRequest) => void;
  profileData: GetProfileRequest;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const DocumentListItem = ({ document, onDownload, onShare, onEdit, profileData }: DocumentListItemProps) => {
  return (
    <motion.div
      className={cx('bottom-list-item')}
      key={document.docId}
      variants={fadeIn}
      whileHover={{ backgroundColor: 'rgba(255, 60, 60, 0.05)' }}
    >
      <div className={cx('list-item-left')}>
        <img src={File} alt="file" />
        <Link
          style={{
            fontSize: '16px',
            lineHeight: '20px',
            fontWeight: 600,
            color: 'var(--primary-color)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          to={`/document/${document.docId}`}
        >
          {document.title}
        </Link>
      </div>
      <div className={cx('list-item-right')}>
        <motion.img
          src={ImportLight}
          alt="download"
          onClick={() => onDownload(document.docId)}
          whileHover={{ y: -2 }}
        />
        <motion.img
          src={Share}
          alt="share"
          onClick={() => onShare(document)}
          whileHover={{ y: -2 }}
        />
        <motion.img
          src={EditIcon}
          alt="EditIcon"
          onClick={() => onEdit(document, profileData)}
          whileHover={{ y: -2 }}
        />
      </div>
    </motion.div>
  );
};

export default DocumentListItem; 