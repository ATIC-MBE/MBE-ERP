import { ModalPropsType } from '@/client/types/globalTypes';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FadeIn from 'react-fade-in';

const Modal = ({ children, title, isOpen, acceptHandler, cancelHandler }:ModalPropsType ) => {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-transparent p-6 z-[9999]">
            <FadeIn visible={isOpen} transitionDuration={700} delay={75} >
                <div className="bg-neutral rounded-xl shadow-2xl py-6 px-6 flex flex-col space-y-5 text-primary w-[28rem] max-w-[90vw]">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <hr />
                    {children}
                    {
                        acceptHandler || cancelHandler ? 
                        <div className="w-full flex space-x-3 justify-center">
                            {acceptHandler && <button className='p-2 hover:text-white text-primary border border-primary rounded-full hover:bg-secondary' onClick={acceptHandler}>Aceptar</button>}
                            {cancelHandler && <button className='p-2 hover:text-white text-orange-600 border border-[#ed7233] rounded-full hover:bg-[#ed7233]' onClick={cancelHandler}>Cancelar</button>}
                        </div>
                        :
                        ''
                    }
                </div>
            </FadeIn>
        </div>,
        document.body
    );
};

export default Modal;
