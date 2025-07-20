// api/chat-vertex.ts Backend para el chat con Vertex AI

import { VertexAI } from '@google-cloud/vertexai'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleAuth } from 'google-auth-library'

// Configuración: lee las variables de entorno
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-vertex-service-account.json'
const project = process.env.VERTEX_PROJECT_ID || 'wortise'
const location = process.env.VERTEX_LOCATION || 'us-central1' // región del proyecto

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    const { message } = req.body
    if (!message) {
        return res.status(400).json({ error: 'Falta el mensaje' })
    }

    try {
        // Autenticación con Google
        const auth = new GoogleAuth({ keyFile, scopes: 'https://www.googleapis.com/auth/cloud-platform' })
        const vertexAI = new VertexAI({ project, location, auth })

        // Configura el modelo (ajusta el nombre si usas otro modelo)
        const model = 'chat-bison'
        const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`

        // Llama al modelo de Vertex AI
        const result = await vertexAI.predict({
            endpoint,
            instances: [{ content: message }],
            parameters: { temperature: 0.2 }
        })

        // Devuelve la respuesta
        res.status(200).json({ response: result.predictions[0].content })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
} 