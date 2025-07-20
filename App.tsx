
import { TamaguiProvider, Theme } from 'tamagui'
import config from './tamagui.config'
import { useColorScheme } from 'react-native'
import ChatScreen from './src/screens/ChatScreen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  const scheme = useColorScheme()
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name={scheme === 'dark' ? 'dark' : 'light'}>
          <ChatScreen />
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
