import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { UIProvider } from './contexts/UIContext'
import { ChatProvider } from './contexts/ChatContext'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UIProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/chat/:conversationId?" element={<ChatPage />} />
              <Route path="*" element={<ChatPage />} />
            </Routes>
          </ChatProvider>
        </UIProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
