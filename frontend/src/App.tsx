import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ChatProvider } from './contexts/ChatContext'
import { ConversationProvider } from './contexts/ConversationContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UIProvider } from './contexts/UIContext'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UIProvider>
          <ConversationProvider>
            <DocumentProvider>
              <ChatProvider>
                <Routes>
                  <Route path="/" element={<ChatPage />} />
                  <Route path="/chat/:conversationId?" element={<ChatPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="*" element={<ChatPage />} />
                </Routes>
                <Toaster
                  position="bottom-right"
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-foreground)',
                    },
                  }}
                />
              </ChatProvider>
            </DocumentProvider>
          </ConversationProvider>
        </UIProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
