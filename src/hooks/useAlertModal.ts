import { useState } from 'react';

interface UseAlertModalProps {
    defaultTitle?: string;
}

export const useAlertModal = ({ defaultTitle = 'Confirm' }: UseAlertModalProps = {}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(defaultTitle);
    const [content, setContent] = useState<React.ReactNode>(null);
    const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [confirmText, setConfirmText] = useState('OK');

    const openModal = ({
        title = defaultTitle,
        content,
        onConfirm,
        confirmText = 'OK',
    }: {
        title?: string;
        content: React.ReactNode;
        onConfirm?: () => void;
        confirmText?: string;
    }) => {
        setTitle(title);
        setContent(content);
        setOnConfirm(() => onConfirm);
        setConfirmText(confirmText);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        title,
        content,
        onConfirm,
        confirmText,
        openModal,
        closeModal,
    };
};
