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
import DrugLibraryPage from './pages/DrugLibraryPage'
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
                    {/* Public Landing Page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Drug Library Reference */}
                    <Route path="/drugs" element={<DrugLibraryPage />} />

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

                    {/* Auth Routes */}
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>

                  <Toaster
                    position="bottom-right"
                    theme="light"
                    toastOptions={{
                      style: {
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-foreground)',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: 'var(--shadow-card)',
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
