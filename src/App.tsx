import './App.css';
import { SharingModal } from './components/SharingModal';
import { SharingModalProvider } from './contexts/SharingModalContext';
import Router from './routes/section';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertProvider } from './contexts/AlertContext';

function App() {
    return (
        <AlertProvider>
            <SharingModalProvider>
                <SharingModal />
                <ToastContainer autoClose={3000} />
                <Router />
            </SharingModalProvider>
        </AlertProvider>
    );
}

export default App;
