import React, { useEffect, useState } from 'react';

const BlockingModal = ({
  title,
  message,
  onConfirm,
  link,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  link?: string;
}) => {
  const links: { [key: string]: string } = {
  'Diario de abordo.': 'https://docs.google.com/spreadsheets/d/12cecywigTKUXEvZxPsmK7-RDCy9M0GHMkCGrcmRhbbg/edit?gid=2138230868#gid=2138230868',
  'RRHH.': 'https://docs.google.com/forms/d/e/1FAIpQLSfML6SSeCQ90qkDKs3GQAbvoNlJFnK7Koh2KUt_ndbXyxNgFg/viewform?usp=sf_link',
  'S. RRHH.': 'https://docs.google.com/forms/d/e/1FAIpQLScKWrPiQ8f_H6kXt-zDs4892CpTqOiN2E5ro8RWGXSrFlM5Aw/viewform',
  'Sucesos RRHH.': 'https://docs.google.com/forms/d/e/1FAIpQLScKWrPiQ8f_H6kXt-zDs4892CpTqOiN2E5ro8RWGXSrFlM5Aw/viewform',
  'Asistencia.': 'https://docs.google.com/spreadsheets/d/1zkUYa2EIJ1Ll5Sz8QMHr97-mYpHF7NWnNCoa2Oxd4iU/edit?gid=276018956#gid=276018956',
  'Leer mensajes.': 'https://web.whatsapp.com/',
  // Sucesos pisos eliminado
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const goToLink = () => {
    const link = links[message];
    if (link) window.open(link, '_blank');
  };

  const showIrButton = Boolean(links[message]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`
          bg-[#e9f3fb] rounded-3xl shadow-xl p-8 max-w-sm w-[90%] text-center border border-blue-200
          transform transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <h2 className="text-2xl font-bold text-red-500 mb-4">{title}</h2>
        <p className="text-gray-700 text-lg mb-8">
          {message === 'Sucesos pisos.' ? '' : (message === 'Mensajes.' ? 'Leer mensajes.' : message)}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-x-10 gap-y-4">
          {showIrButton && (
            <button
              onClick={goToLink}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-xl transition"
            >
              Ir
            </button>
          )}
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition hover:bg-[#c9ac7e] hover:text-[#3e7f82]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockingModal;
