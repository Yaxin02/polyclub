import { useState } from 'react'
import api from '../api'
import Champ from '../components/Champ'
import { messageErreur } from '../utils'

export default function Register({ onSuccess, onNavigate }) {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      const reponse = await api.post('/api/auth/register', { nom, email, password })
      onSuccess(reponse.data)
    } catch (error) {
      setErreur(messageErreur(error, 'Inscription impossible'))
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section className="page etroite">
      <form className="panneau" onSubmit={handleSubmit}>
        <h1>Inscription</h1>
        <p className="aide">Crée ton compte membre. Le mot de passe fait au moins 6 caractères.</p>
        <Champ label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <Champ label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Champ
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {erreur && <p className="alerte">{erreur}</p>}
        <button type="submit" className="bouton" disabled={envoi}>
          {envoi ? 'Création...' : 'Créer le compte'}
        </button>
        <button type="button" className="lien-texte" onClick={() => onNavigate('login')}>
          Déjà inscrit ? Connexion
        </button>
      </form>
    </section>
  )
}
