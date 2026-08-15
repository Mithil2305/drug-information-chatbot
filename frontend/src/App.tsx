import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import { ConversationProvider } from './contexts/ConversationContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UIProvider } from './contexts/UIContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import ComparePage from './pages/ComparePage'
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
        style: {
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-foreground)',
          borderRadius: '14px',
          fontSize: '13px',
          boxShadow: 'var(--shadow-card)',
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
                    {/* Public Landing Page */}
                    <Route path="/home" element={<HomePage />} />

                    {/* Protected AI Chat Assistant */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/:conversationId?"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Protected AI Chat Assistant */}
                    <Route
                      path="/chat"
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

                    {/* Protected Document Label Management */}
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute>
                          <DocumentsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Drug Comparison */}
                    <Route
                      path="/compare"
                      element={
                        <ProtectedRoute>
                          <ComparePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Auth Routes */}
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="/register" element={<SignUpPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
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
