import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import AssignmentList from './pages/AssignmentList/AssignmentList'
import AssignmentAttempt from './pages/AssignmentAttempt/AssignmentAttempt'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<AssignmentList />} />
              <Route path="/assignment/:id" element={<AssignmentAttempt />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
