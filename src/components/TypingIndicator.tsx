
import { Text, View, StyleSheet, Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export default function TypingIndicator() {
  const dotAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Escribiendo</Text>
      <Animated.Text style={[styles.dot, { opacity: dotAnim }]}>...</Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  text: { fontStyle: 'italic', marginRight: 5 },
  dot: { fontSize: 20 }
})
