import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSharingModal } from '../../contexts/SharingModalContext';
import { Button } from '../Button';
import styles from './SharingModal.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);
import emailjs from '@emailjs/browser';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { toast } from 'react-toastify';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getGroupOfUserAction } from '../../redux/GroupStudySlice/GroupStudySlice';
import Loader from '../Loader/Loader';
import { sendGroupChatMessage } from '../../utils/Websocket';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export type DocumentAttached= {
    documentId : string;
    documentName: string;
    docFilePath: string;
}

export default function SharingModal() {
    const [email, setEmail] = useState<string>('');
    const fromName = useAppSelector((state: any) => state.authentication.username);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSendingGroup, setIsSendingGroup] = useState<boolean>(false);
    const [groupRender, setGroupRender] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const { userGroups, loading } = useAppSelector((state) => state.groupStudy);

    // config đóng mở modal
    const { open, closeSharingModal, url, doc } = useSharingModal();

    // config copy url
    const [isCopied, setIsCopied] = useState<boolean>(false);

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy url: ', error);
        }
    };

    // config cho send email
    const sendEmail = () => {
        if (!isValidEmail(email)) {
            toast.error('Email này không tồn tại!');
            return;
        }
        if (isSending) return;
        setIsSending(true);
        const templateParams = {
            from_name: fromName,
            message: url,
            to_email: email,
        };
        emailjs
            .send(import.meta.env.VITE_EMAILJS_KEY, import.meta.env.VITE_EMAILJS_TEMPLATE, templateParams, {
                publicKey: 'UasBeH0VctySK7UHo',
            })
            .then(
                () => {
                    toast.success('Chia sẻ thành công!');
                    setEmail('');
                    closeSharingModal();
                },
                (error) => {
                    setEmail('');
                    toast.error('Xảy ra lỗi khi chia sẻ tài liệu!');
                },
            );

        setTimeout(() => {
            setIsSending(false);
        }, 3000);
    };
    const handleChange = (event: SelectChangeEvent<typeof groupRender>) => {
        const {
            target: { value },
        } = event;
        setGroupRender(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const sendToGroup = () => {
        if(groupRender.length>0){
            const filterGroup = userGroups.filter(group =>{
                if(group.groupName!==null){
                    return groupRender.includes(group.groupName);
                }
            });
            console.log(filterGroup);
            filterGroup.forEach(group=>{
                sendGroupChatMessage(group.groupId,"Đã chia sẽ tài liệu vào nhóm.","DOCUMENT", doc);
            })
            setIsSendingGroup(true);
            setTimeout(()=>{
                setIsSendingGroup(false);
                setGroupRender([]);
                closeSharingModal();
            },1500);
            
        }
    }

    useEffect(() => {
        if(open){
            dispatch(getGroupOfUserAction());
        }
    }, [dispatch, open]);

    return (
        <Modal
            open={open}
            onClose={closeSharingModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {loading ? (
                <Loader height={20} />
            ) : (
                <Box sx={style}>
                    <Typography
                        sx={{
                            fontFamily: 'Montserrat',
                            fontSize: '20px',
                            fontWeight: 700,
                            lineHeight: '29.26px',
                        }}
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Chia sẻ tài liệu này
                    </Typography>
                    <div className={cx('email-form')}>
                        <input
                            placeholder="Chia sẻ liên kết qua email"
                            className={cx('email-input')}
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            text={isSending ? 'Đang gửi' : 'Gửi Email'}
                            paddingX={20}
                            paddingY={11}
                            fontSize={15}
                            onClick={sendEmail}
                        />
                    </div>
                    <div className={cx('email-form')} style={{ alignItems: 'center' }}>
                        <FormControl sx={{ m: 1, width: '360px', background: '#eaeaea' }}>
                            <InputLabel id="demo-multiple-checkbox-label">Nhóm của bạn</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={groupRender}
                                onChange={handleChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {userGroups && userGroups.length > 0
                                    ? userGroups.map((group, index) => {
                                          return (
                                              <MenuItem key={index} value={group.groupName ? group.groupName : ''}>
                                                  <Checkbox checked={groupRender.includes(group.groupName ? group.groupName : '')} />
                                                  <ListItemText primary={group.groupName} />
                                              </MenuItem>
                                          );
                                      })
                                    : ''}
                            </Select>
                        </FormControl>
                        <Button
                            text={isSendingGroup ? 'Đang gửi' : 'Gửi đến nhóm'}
                            paddingX={20}
                            paddingY={11}
                            fontSize={15}
                            onClick={sendToGroup}
                        />
                    </div>
                    <input className={cx('input-url')} type="text" value={url} readOnly />
                    <div className={cx('actions')}>
                        <button onClick={handleCopy}>
                            {!isCopied ? 'Sao chép đường liên kết' : 'Sao chép thành công'}
                        </button>
                        <Button text="Xong" paddingX={35} paddingY={11} fontSize={15} onClick={closeSharingModal} />
                    </div>
                </Box>
            )}
        </Modal>
    );
}
