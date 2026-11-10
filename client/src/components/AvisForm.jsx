import { useState } from 'react'
import api from '../api'
import Champ from './Champ'
import { messageErreur } from '../utils'

export default function AvisForm({ annonceId, onCree }) {
  const [texte, setTexte] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      await api.post(`/api/annonces/${annonceId}/avis`, { texte })
      setTexte('')
      onCree()
    } catch (error) {
      setErreur(messageErreur(error, "Impossible d'envoyer l'avis"))
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <form className="panneau" onSubmit={handleSubmit}>
      <h2>Laisser un avis</h2>
      <Champ
        label="Votre message"
        type="textarea"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        maxLength={500}
        rows={3}
        required
      />
      {erreur && <p className="alerte">{erreur}</p>}
      <button type="submit" className="bouton" disabled={envoi}>
        {envoi ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  )
}
