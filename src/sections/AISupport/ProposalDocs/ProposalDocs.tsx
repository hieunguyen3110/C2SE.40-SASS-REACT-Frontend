import classNames from 'classnames/bind';
import styles from './ProposalDocs.module.scss';
const cx = classNames.bind(styles);
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Button } from '../../../components/Button';
import { SelectChangeEvent } from '@mui/material';
import DocumentIMG from '../../../assets/images/library.document.png';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { truncateTextWithLength } from '../../../utils/truncateText';
// import { useAppSelector } from "../../../redux/store";
// import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
// import Images from "../../../assets/images/library.document.png";

const ITEM_HEIGHT = 48;

export default function ProposalDocs() {
    const navigate = useNavigate();
    // config cho popover ...
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [isAnalysing] = useState<boolean>(false);
    const [courseName, setCourseName] = React.useState<string[]>([]);
    const { documentAnalysis } = useAppSelector((state) => state.chatbot);

    const handleChange = (event: SelectChangeEvent<typeof courseName>) => {
        const {
            target: { value },
        } = event;
        setCourseName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleAnalysing = () => {
        // setIsAnalysing(true);
        toast.info('Comming soon...');
    };

    const notifyBox = (
        <div className={cx('notify-box')}>
            <div className={cx('title')}>
                <NotificationsOutlinedIcon />
                <h3>THÔNG BÁO</h3>
            </div>
            <p>
                Hiện tại chúng tôi chưa có thông tin về thói quen sử dụng tài liệu của bạn, hãy giúp chúng tôi cung cấp
                thông tin cấn thiết để chúng tôi có thể phân tích và lựa chọn tài liệu phù hợp nhất dành cho bạn nhé.
            </p>
            <div onClick={handleAnalysing} className={cx('analyse-btn')}>
                <Button text="Phân tích ngay" fontSize={16} paddingX={14} paddingY={9} />
            </div>
        </div>
    );
    const Document = () => {
        return (
            <div className={cx('cards')}>
                {documentAnalysis && documentAnalysis.length > 0
                    ? documentAnalysis.map((document, index) => {
                          return (
                              <div key={index} className={cx('card')}>
                                  {/* <div className={cx('author')}>
                                      <IconButton
                                          aria-label="more"
                                          id={`long-button-${document.docId}`}
                                          aria-haspopup="true"
                                      >
                                          <MoreHorizIcon />
                                      </IconButton>
                                  </div> */}
                                  <img
                                      onClick={() => navigate(`/document/${document.docId}`)}
                                      src={DocumentIMG}
                                      alt="doc"
                                  />
                                  <h3 onClick={() => navigate(`/document/${document.docId}`)}>
                                      {truncateTextWithLength(document.fileName, 45)}
                                  </h3>
                                  <span>{document.subjectName}</span>
                              </div>
                          );
                      })
                    : ''}
            </div>
        );
    };

    return (
        <div className={cx('proposal-docs')}>
            <div className={cx('head')}>
                <h2>Tài liệu đề xuất</h2>
            </div>
            <Document />
            {/* {isAnalysing ? (
                <div className={cx('analyst')}>
                    <div className={cx('title')}>
                        <img src={AnalystICON} alt="analyst" />
                        <h3>Phân tích </h3>
                    </div>
                    <hr />
                    <div className={cx('content')}>
                        <div className={cx('question')}>
                            <p>Bạn đang học những môn học nào?</p>
                            <MultiSelectSubjects courseName={courseName} onChange={handleChange} />
                        </div>
                        <div className={cx('question')}>
                            <p>Câu hỏi phân tích 2 ?</p>
                            <div className=""></div>
                        </div>
                        <div className={cx('question')}>
                            <p>Câu hỏi phân tích 3 ?</p>
                            <div className=""></div>
                        </div>
                    </div>
                    <div className={cx('actions')}>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Tôi xác nhận các câu trả lời trên là đúng "
                        />
                        <Button text="Xác nhận" paddingX={41} paddingY={12.5} fontSize={13} />
                    </div>
                </div>
            ) : (
                notifyBox
            )} */}
        </div>
    );
}
