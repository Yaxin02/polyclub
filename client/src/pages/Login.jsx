import { useState } from 'react'
import api from '../api'
import Champ from '../components/Champ'
import { messageErreur } from '../utils'

export default function Login({ onSuccess, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      const reponse = await api.post('/api/auth/login', { email, password })
      onSuccess(reponse.data)
    } catch (error) {
      setErreur(messageErreur(error, 'Connexion impossible'))
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section className="page etroite">
      <form className="panneau" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <p className="aide">Entre avec l'email du club pour publier.</p>
        <Champ label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Champ
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {erreur && <p className="alerte">{erreur}</p>}
        <button type="submit" className="bouton" disabled={envoi}>
          {envoi ? 'Connexion...' : 'Se connecter'}
        </button>
        <button type="button" className="lien-texte" onClick={() => onNavigate('register')}>
          Pas encore de compte ? Inscription
        </button>
      </form>
    </section>
  )
}
