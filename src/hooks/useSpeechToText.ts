import { useEffect, useRef, useState } from 'react';

export const useSpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recgonitionRef = useRef<any>(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support the Web Speech API. Please try Google Chrome or Edge.');
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN';
        recgonitionRef.current = recognition;
        recgonitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
        };
    }, []);

    const startListening = () => {
        setTranscript('');
        setIsListening(true);
        recgonitionRef.current.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recgonitionRef.current.stop();
    };

    return { transcript, isListening, startListening, stopListening };
};
