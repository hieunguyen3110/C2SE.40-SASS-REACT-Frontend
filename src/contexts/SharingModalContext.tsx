import React, { createContext, useContext, useState } from 'react';
import { DocumentResponse } from '../redux/DocumentSlice/InterfaceResponse';
import { DocumentAttached } from '../components/SharingModal/SharingModal';


interface SharingModalContextType {
    open: boolean;
    url: string;
    doc: DocumentAttached | null;
    setUrl: (url: string) => void;
    setDoc: (doc: DocumentAttached | null) => void;
    openSharingModal: () => void;
    closeSharingModal: () => void;
}

const SharingModalContext = createContext<SharingModalContextType | undefined>(undefined);

export const SharingModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [doc,setDoc] = useState<DocumentAttached|null>(null);

    const openSharingModal = () => {
        setOpen(true);
    };
    const closeSharingModal = () => setOpen(false);

    return (
        <SharingModalContext.Provider value={{ open, url,doc, setUrl, openSharingModal, closeSharingModal,setDoc }}>
            {children}
        </SharingModalContext.Provider>
    );
};

export const useSharingModal = () => {
    const context = useContext(SharingModalContext);
    if (!context) {
        throw new Error('useSharingModal must be used within a SharingModalProvider');
    }
    return context;
};
