import { formaterDate } from '../utils'

export default function AnnonceCard({ annonce, onOpen }) {
  const nomAuteur = annonce.auteur?.nom || 'Membre'

  return (
    <button type="button" className="carte" onClick={() => onOpen(annonce._id)}>
      <p className="etiquette">Événement · {formaterDate(annonce.dateEvenement)}</p>
      <h2>{annonce.titre}</h2>
      <p className="extrait">{annonce.contenu}</p>
      <p className="meta">Par {nomAuteur}</p>
    </button>
  )
}
