import { useState } from 'react'
import api from '../api'
import Champ from './Champ'
import { messageErreur } from '../utils'

export default function AnnonceForm({ onCree }) {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [dateEvenement, setDateEvenement] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      await api.post('/api/annonces', { titre, contenu, dateEvenement })
      setTitre('')
      setContenu('')
      setDateEvenement('')
      onCree()
    } catch (error) {
      setErreur(messageErreur(error, 'Publication impossible'))
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <form className="panneau" onSubmit={handleSubmit}>
      <h2>Nouvelle annonce</h2>
      <Champ label="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required maxLength={120} />
      <Champ
        label="Contenu"
        type="textarea"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        required
        maxLength={2000}
        rows={4}
      />
      <Champ
        label="Date de l'événement"
        type="date"
        value={dateEvenement}
        onChange={(e) => setDateEvenement(e.target.value)}
        required
      />
      {erreur && <p className="alerte">{erreur}</p>}
      <button type="submit" className="bouton" disabled={envoi}>
        {envoi ? 'Publication...' : 'Publier'}
      </button>
    </form>
  )
}
