import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import { ConversationProvider } from './contexts/ConversationContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UIProvider } from './contexts/UIContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

import { useTheme } from './hooks/useTheme'

function ThemedToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      toastOptions={{
        style: theme === 'dark' ? {
          background: '#171A21',
          border: '1px solid #292E38',
          color: '#F1F3F7',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        } : {
          background: '#FFFFFF',
          border: '1px solid #D8E2EE',
          color: '#0F172A',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
        },
      }}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
            <ConversationProvider>
              <DocumentProvider>
                <ChatProvider>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat/:conversationId?"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute>
                          <DocumentsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="*" element={<SignInPage />} />
                  </Routes>
                  <ThemedToaster />
                </ChatProvider>
              </DocumentProvider>
            </ConversationProvider>
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}


export default App

