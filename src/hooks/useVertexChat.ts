import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

export type ChatMessage = {
    id: string
    text: string
    sender: 'user' | 'ai' | 'error'
}

// Detectar si es emulador Android para usar la IP especial
let API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.4:3000/api/chat-vertex';
if (Platform.OS === 'android' && !process.env.EXPO_PUBLIC_BACKEND_URL) {
    API_URL = 'http://10.0.2.2:3000/api/chat-vertex';
}

// Mock local para fallback
const fallbackMock = (msg: string) => `¡Ups! No pude conectarme al servidor, pero aquí va una respuesta simulada para que sigas probando la experiencia: “${msg}” ¿Te gustaría preguntarme otra cosa?`;

export function useVertexChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isTyping, setIsTyping] = useState(false)

    const sendMessage = useCallback(async (text: string) => {
        if (!text) return
        const userMessage: ChatMessage = { id: `${Date.now()}-${Math.random()}`, text, sender: 'user' }
        setMessages(prev => [...prev, userMessage])
        setIsTyping(true)

        try {
            // Llamada real al backend local
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            })

            console.log('Status de la respuesta:', response.status, 'OK:', response.ok)

            let aiText = '';
            try {
                const rawText = await response.text();
                console.log('Raw text recibido del backend:', JSON.stringify(rawText));
                const data = JSON.parse(rawText);
                console.log('Objeto JSON recibido del backend:', data);
                aiText = data.text || '';
                console.log('Texto crudo recibido del backend:', JSON.stringify(aiText));
            } catch (parseError) {
                console.error('Error parseando JSON del backend:', parseError);
            }
            // Mostrar el texto recibido aunque sea solo espacios/blancos para depuración
            let textoAMostrar = aiText;
            if (!aiText.trim()) {
                textoAMostrar = '[Respuesta vacía del backend]';
            }
            console.log('Texto final mostrado en el frontend:', textoAMostrar)
            setMessages(prev => [
                ...prev.filter(m => m.id !== 'streaming'),
                { id: `${Date.now()}-${Math.random()}`, text: textoAMostrar, sender: 'ai' }
            ])
        } catch (error: any) {
            // Si hay error de red, mostrar el error crudo
            console.error('Error en fetch:', error)
            setMessages(prev => [
                ...prev,
                { id: `${Date.now()}-${Math.random()}`, text: `[Error de red]: ${error?.message || error}`, sender: 'ai' }
            ])
        } finally {
            setIsTyping(false)
        }
    }, [])

    return { messages, isTyping, sendMessage }
} 