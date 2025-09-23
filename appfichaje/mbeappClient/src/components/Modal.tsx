import { ModalPropsType } from '@/client/types/globalTypes';
import React from 'react';
import FadeIn from 'react-fade-in';

const Modal = ({ children, title, isOpen, acceptHandler, cancelHandler }:ModalPropsType ) => {

    return (
        <>

            {isOpen && (
                <div className="fixed inset-0 flex items-start justify-center bg-[#00000055] p-10 z-10">
                    <FadeIn visible={isOpen} transitionDuration={700} delay={75} >
                        <div className="bg-neutral rounded-xl py-6 px-6 flex flex-col space-y-5 text-primary min-w-[12rem]">
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
                            {/* <div className="w-full flex space-x-3 justify-center">
                                {acceptHandler && <button className='p-2 hover:text-white text-blue-700 border border-[#005360] rounded-full hover:bg-[#005360]' onClick={acceptHandler}>Aceptar</button>}
                                {cancelHandler && <button className='p-2 hover:text-white text-orange-600 border border-[#ed7233] rounded-full hover:bg-[#ed7233]' onClick={cancelHandler}>Cancelar</button>}
                            </div> */}
                        </div>
                    </FadeIn>
                </div>
            )}
        </>
    )
};

export default Modal;
