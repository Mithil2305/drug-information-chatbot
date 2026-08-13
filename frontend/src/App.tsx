import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './stores/chatStore'
import { DocumentProvider } from './stores/documentStore'
import { ViewerProvider } from './stores/viewerStore'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <DocumentProvider>
            <ViewerProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50 text-gray-900">
                        <h1 className="text-3xl font-bold p-6">Drug Information Chatbot</h1>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ViewerProvider>
          </DocumentProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
