
import * as Clipboard from 'expo-clipboard';
import { useEffect } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, ToastAndroid } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export default function MessageBubble({ message }: { message: { id: string; text: string; sender: string } }) {
  const fade = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    fade.value = withTiming(1, { duration: 350 })
  }, [])

  const isUser = message.sender === 'user'
  const isError = message.sender === 'error'

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
    shadowOpacity: scale.value < 1 ? 0.18 : 0.08,
    shadowRadius: scale.value < 1 ? 10 : 6,
    elevation: scale.value < 1 ? 6 : 2,
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.97)
  }
  const handlePressOut = () => {
    scale.value = withSpring(1)
  }
  const handleLongPress = () => {
    Clipboard.setStringAsync(message.text)
    if (Platform.OS === 'android') {
      ToastAndroid.show('¡Texto copiado!', ToastAndroid.SHORT)
    } else {
      Alert.alert('Copiado', 'El texto se copió al portapapeles')
    }
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={300}
    >
      <Animated.View
        style={[
          styles.bubble,
          isUser ? styles.user : isError ? styles.error : styles.ai,
          animatedStyle,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.textUser : isError ? styles.textError : styles.textAI]}>{message.text}</Text>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  user: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-end',
    borderTopRightRadius: 6,
  },
  ai: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 6,
  },
  error: {
    backgroundColor: '#fee2e2',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  textUser: {
    color: '#1e293b',
  },
  textAI: {
    color: '#334155',
  },
  textError: {
    color: '#b91c1c',
    fontStyle: 'italic',
  },
})
