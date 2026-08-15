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
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="*" element={<SignInPage />} />
                  </Routes>

                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-foreground)',
                        fontSize: '14px',
                        borderRadius: '10px',
                      },
                    }}
                  />
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
