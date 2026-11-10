import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Detail from './pages/Detail'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('accueil')
  const [annonceId, setAnnonceId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (!saved) return

    try {
      setUser(JSON.parse(saved))
    } catch (error) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }, [])

  function ouvrirSession(data) {
    const session = { _id: data._id, nom: data.nom, email: data.email }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(session))
    setUser(session)
    setPage('accueil')
  }

  function fermerSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setAnnonceId(null)
    setPage('accueil')
  }

  function ouvrirAnnonce(id) {
    setAnnonceId(id)
    setPage('detail')
  }

  return (
    <div className="app">
      <Navbar user={user} page={page} onNavigate={setPage} onLogout={fermerSession} />
      <main>
        {page === 'accueil' && <Home user={user} onOpen={ouvrirAnnonce} />}
        {page === 'login' && <Login onSuccess={ouvrirSession} onNavigate={setPage} />}
        {page === 'register' && <Register onSuccess={ouvrirSession} onNavigate={setPage} />}
        {page === 'detail' && (
          <Detail user={user} annonceId={annonceId} onBack={() => setPage('accueil')} />
        )}
      </main>
      <footer>
        Mohamed Yassine Mokni · PolyClub · Projet MERN 2025–2026 · École Polytechnique de Sousse
      </footer>
    </div>
  )
}
