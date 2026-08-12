import { ChatProvider } from './stores/chatStore'
import { DocumentProvider } from './stores/documentStore'
import { ViewerProvider } from './stores/viewerStore'

function App() {
  return (
    <ChatProvider>
      <DocumentProvider>
        <ViewerProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <h1 className="text-3xl font-bold p-6">Drug Information Chatbot</h1>
          </div>
        </ViewerProvider>
      </DocumentProvider>
    </ChatProvider>
  )
}

export default App
