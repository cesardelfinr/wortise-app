
import { Ionicons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import { Button, Input, XStack } from 'tamagui'

export default function InputBar({ onSend }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
    Keyboard.dismiss()
  }

  return (
    <XStack
      space="$2"
      ai="center"
      px="$3"
      py="$2"
      bc="rgba(255,255,255,0.95)"
      borderTopWidth={1}
      borderColor="#e5e7eb"
      style={{ borderRadius: 16, margin: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
    >
      <Input
        ref={inputRef}
        flex={1}
        value={text}
        onChangeText={setText}
        placeholder="Escribe tu mensaje"
        size="$4"
        borderRadius="$4"
        backgroundColor="#f8fafc"
        borderWidth={1}
        borderColor="#e5e7eb"
        focusStyle={{ borderColor: '#4f46e5' }}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        blurOnSubmit={false}
        style={{ fontSize: 16, paddingLeft: 10 }}
      />
      <Button
        size="$4"
        borderRadius="$4"
        onPress={handleSend}
        disabled={!text.trim()}
        hoverStyle={{ scale: 1.08, bg: '#e0e7ef' }}
        pressStyle={{ scale: 0.97 }}
        style={{ marginLeft: 4, backgroundColor: '#4f46e5' }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Button>
    </XStack>
  )
}
