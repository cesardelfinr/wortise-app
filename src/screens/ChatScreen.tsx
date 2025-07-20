
import { Ionicons } from '@expo/vector-icons'
import * as Google from 'expo-auth-session/providers/google'
import { LinearGradient } from 'expo-linear-gradient'
import * as Speech from 'expo-speech'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useRef, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import InputBar from '../components/InputBar'
import MessageBubble from '../components/MessageBubble'
import TypingIndicator from '../components/TypingIndicator'
import { useVertexChat } from '../hooks/useVertexChat'

WebBrowser.maybeCompleteAuthSession()

export default function ChatScreen() {
  const { messages, isTyping, sendMessage } = useVertexChat()
  const lastSpokenId = useRef<string | null>(null)

  // Google Auth
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null)
  // Usa variables de entorno públicas de Expo para los clientId
  // Definí EXPO_PUBLIC_GOOGLE_CLIENT_ID, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, etc. en tu .env o app config
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then(res => res.json())
        .then(data => setUser({ name: data.name, picture: data.picture }))
    }
  }, [response])

  // Síntesis de voz: lee la última respuesta de la IA
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.sender === 'ai' && last.id !== lastSpokenId.current) {
      Speech.speak(last.text, { language: 'es-ES' })
      lastSpokenId.current = last.id
    }
  }, [messages])

  return (
    <LinearGradient colors={['#f8fafc', '#e0e7ef']} style={styles.gradient}>
      {/* Header moderno */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="chatbubbles" size={28} color="#4f46e5" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Chat IA</Text>
        </View>
        {/* Botón de Google o avatar */}
        {user ? (
          <View style={styles.userInfo}>
            <Image source={{ uri: user.picture }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Ionicons name="logo-google" size={22} color="#fff" />
            <Text style={styles.googleBtnText}>Google</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Chat */}
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
        />
        {isTyping && <TypingIndicator />}
        <InputBar onSend={sendMessage} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  googleBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  userName: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 15,
  },
})
