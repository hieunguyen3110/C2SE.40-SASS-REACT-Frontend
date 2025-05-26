import classNames from 'classnames/bind';
import styles from './MembersDrawer.module.scss';
import { IconButton } from '@mui/material';
import { SearchOutlined, Close } from '@mui/icons-material';
import { useState } from 'react';

const cx = classNames.bind(styles);

interface Member {
    memberId: number;
    name: string;
    email: string;
}

interface MembersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    members: Member[];
    ownerId: number | undefined;
}

export default function MembersDrawer({ isOpen, onClose, members, ownerId }: MembersDrawerProps) {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={cx('membersDrawer')}>
            <header className={cx('drawerHeader')}>
                <h2 className={cx('title')}>Members</h2>
                <IconButton onClick={onClose} className={cx('closeButton')}>
                    <Close />
                </IconButton>
            </header>

            <div className={cx('searchContainer')}>
                <div className={cx('searchInputWrapper')}>
                    <SearchOutlined className={cx('searchIcon')} />
                    <input
                        type="text"
                        placeholder="Search members"
                        className={cx('searchInput')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={cx('membersContent')}>
                <div className={cx('memberCategory')}>
                    <h3 className={cx('categoryTitle')}>ADMINISTRATORS</h3>
                    <ul className={cx('membersList')}>
                        {filteredMembers
                            .filter((member) => member.memberId === ownerId)
                            .map((member) => (
                                <li key={member.memberId} className={cx('memberItem')}>
                                    <div className={cx('memberAvatar')}>
                                        <span>{member.name.charAt(0)}</span>
                                        <span className={cx('statusIndicator')}></span>
                                    </div>
                                    <div className={cx('memberInfo')}>
                                        <span className={cx('memberName')}>{member.name}</span>
                                        <span
                                            className={cx('memberRole', {
                                                admin: true,
                                            })}
                                        >
                                            Administrator
                                        </span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className={cx('divider')}></div>

                <div className={cx('memberCategory')}>
                    <h3 className={cx('categoryTitle')}>MEMBERS</h3>
                    <ul className={cx('membersList')}>
                        {filteredMembers
                            .filter((member) => member.memberId !== ownerId)
                            .map((member) => (
                                <li key={member.memberId} className={cx('memberItem')}>
                                    <div className={cx('memberAvatar')}>
                                        <span>{member.name.charAt(0)}</span>
                                        <span className={cx('statusIndicator')}></span>
                                    </div>
                                    <div className={cx('memberInfo')}>
                                        <span className={cx('memberName')}>
                                            {member.name === 'null null' ? member.email : member.name}
                                        </span>
                                        <span className={cx('memberRole')}>Member</span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
