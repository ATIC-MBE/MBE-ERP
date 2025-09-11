import React, { useState, useEffect } from 'react'
import { BsRobot, BsX } from 'react-icons/bs'
import { MdPushPin } from 'react-icons/md';
import pinesData from '../data/P1N_MCH.json';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy City. ¿En qué puedo ayudarte?' }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [preguntasSugeridas, setPreguntasSugeridas] = useState<string[]>([]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        setIsLoading(true);

        // 1. Leer datos del Sheet
        const sheetData = await getSheetData();
        const sheetContext = sheetData.map((row: SheetRow) => 
  `Dept: ${row[0] ?? ''} | Tipo: ${row[1] ?? ''} | Qué ha pasado: ${row[2] ?? ''} | Solución: ${row[3] ?? ''}`
).join('\n');

        // 2. Construir el contexto para OpenAI
        const contextMessage = {
  role: 'system',
  content: `Eres un asistente de soporte. Tienes una lista de pines (problemas y soluciones) de la empresa.
Cada pin tiene este formato: Dept, Tipo, Qué ha pasado, Solución.
Cuando el usuario pregunte por un problema, busca el pin donde la columna "Qué ha pasado" sea igual o similar a la pregunta del usuario (puedes usar coincidencias parciales o palabras clave) y responde con la solución asociada, usando este formato:
Dept: [Dept] | Tipo: [Tipo] | Qué ha pasado: [Qué ha pasado] | Solución: [Solución]
Si no encuentras ningún pin relevante, responde "No hay información suficiente en los pines para este caso".
Lista de pines:\n${sheetContext}`
};

        const newMessages = [
            contextMessage,
            ...messages,
            { role: 'user', content: inputMessage }
        ];

        setMessages(newMessages);
        setInputMessage('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: newMessages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            setMessages([
                ...newMessages,
                { role: 'assistant', content: data.choices[0].message.content }
            ]);
        } catch (error) {
            setMessages([
                ...newMessages,
                { role: 'assistant', content: 'Lo siento, hubo un error. Intenta de nuevo.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    // ← CORREGIR ESTA FUNCIÓN CON TIPOS:
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    type SheetRow = [string, string, string, string, string?, string?];

    async function getSheetData(): Promise<SheetRow[]> {
        const SHEET_ID = '1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE';
        const RANGE = 'Hoja1!A2:D';
        const API_KEY = 'AIzaSyAwM4pJC7O5p9sTCQpUFLQUYthdV8zGN7o';

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.values || [];
    }

    // Leer los pines y calcular los problemas más comunes
    useEffect(() => {
        async function calcularSugerencias() {
            const sheetData = await getSheetData();
            // Contar los problemas más repetidos en "Qué ha pasado" (columna 2)
            const problemaCount: { [key: string]: number } = {};
            sheetData.forEach((row: SheetRow) => {
                const problema = row[2]; // columna "Qué ha pasado"
                if (problema) problemaCount[problema] = (problemaCount[problema] || 0) + 1;
            });
            const problemasComunes = Object.entries(problemaCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([problema]) => problema);

            let sugeridas: string[];
            if (problemasComunes.length > 0) {
                sugeridas = problemasComunes.map(problema =>
                    `¿Cómo se soluciona el problema: "${problema}"?`
                );
            } else {
                // Preguntas por defecto si no hay datos
                sugeridas = [
                    "¿Qué pines hay para el departamento ATIC?",
                    "¿Cuál fue el último problema en CRM?",
                    "¿Qué solución se dio al pin de tipo legal?",
                    "Tengo un problema de conexión, ¿qué hago?",
                ];
            }
            setPreguntasSugeridas(sugeridas);
        }
        calcularSugerencias();
    }, [isOpen]); // recalcula cada vez que abres el chat

    useEffect(() => {
        // Sugerencias según los pines del JSON
        const problemaCount: { [key: string]: number } = {};
        pinesData.forEach((row: any) => {
            const problema = row["Que ha pasado"];
            if (problema) problemaCount[problema] = (problemaCount[problema] || 0) + 1;
        });
        const problemasComunes = Object.entries(problemaCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([problema]) => problema);

        let sugeridas: string[];
        if (problemasComunes.length > 0) {
            sugeridas = problemasComunes.map(problema =>
                `¿Cómo se soluciona el problema: "${problema}"?`
            );
        } else {
            sugeridas = [
                "¿Cómo puedo resolver un error frecuente?",
                "¿Qué hago si hay problemas con el calendario?",
                "¿Qué solución hay para falta de seguimiento?",
                "¿Cómo actuar ante errores de procedimiento?",
            ];
        }
        setPreguntasSugeridas(sugeridas);
    }, [isOpen]);

    function buscarPin(pregunta: string) {
        const preguntaLower = pregunta.toLowerCase();
        const pin = pinesData.find((row: any) =>
            row["Que ha pasado"] && row["Que ha pasado"].toLowerCase().includes(preguntaLower)
        );
        if (pin) {
            return `Departamento: ${pin.Departamento ?? ''} | Tipo: ${pin.Tipo ?? ''} | Qué ha pasado: ${pin["Que ha pasado"]} | Solución: ${pin.Solución ?? 'Sin solución registrada'}`;
        }
        return null;
    }

    return (
        <>
            {/* Botón flotante */}
            {!isOpen && (
                <div 
                    className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-secondary text-white rounded-full p-4 shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
                    onClick={() => setIsOpen(true)}
                >
                    <MdPushPin size={24} color="#ff9800" />
                </div>
            )}

            {/* Ventana del chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="bg-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <BsRobot size={22} color="rgba(206, 202, 231, 1)" />
                            <span className="font-semibold">Hola soy Citty</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-blue-600 rounded-full p-1 transition-colors"
                        >
                            <BsX size={20} />
                        </button>
                    </div>

                    {/* Sugerencias dinámicas */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="text-sm text-gray-500 mb-2">
                            ¿Te ayudo a consultar pines?
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message, index) => (
                            <div 
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.role === 'user' 
                                            ? 'bg-primary text-white' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary max-h-20"
                                rows={1}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-[#ff9800] hover:bg-orange-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatBot