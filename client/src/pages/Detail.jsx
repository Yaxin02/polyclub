import { useEffect, useState } from 'react'
import api from '../api'
import AvisForm from '../components/AvisForm'
import { formaterDate, messageErreur } from '../utils'

export default function Detail({ user, annonceId, onBack }) {
  const [annonce, setAnnonce] = useState(null)
  const [avis, setAvis] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  async function charger() {
    try {
      setChargement(true)
      const reponse = await api.get(`/api/annonces/${annonceId}`)
      setAnnonce(reponse.data.annonce)
      setAvis(reponse.data.avis)
      setErreur('')
    } catch (error) {
      setErreur(messageErreur(error, "Impossible d'ouvrir cette annonce"))
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [annonceId])

  async function supprimerAnnonce() {
    const confirme = window.confirm('Supprimer cette annonce et ses avis ?')
    if (!confirme) return

    try {
      await api.delete(`/api/annonces/${annonce._id}`)
      onBack()
    } catch (error) {
      setErreur(messageErreur(error, 'Suppression impossible'))
    }
  }

  async function supprimerAvis(id) {
    const confirme = window.confirm('Supprimer cet avis ?')
    if (!confirme) return

    try {
      await api.delete(`/api/avis/${id}`)
      charger()
    } catch (error) {
      setErreur(messageErreur(error, 'Suppression impossible'))
    }
  }

  if (chargement) {
    return (
      <section className="page">
        <p className="info">Chargement...</p>
      </section>
    )
  }

  if (!annonce) {
    return (
      <section className="page">
        <button type="button" className="lien-texte" onClick={onBack}>
          Retour aux annonces
        </button>
        <p className="alerte">{erreur || 'Annonce introuvable'}</p>
      </section>
    )
  }

  const estAuteur = user && String(user._id) === String(annonce.auteur?._id)

  return (
    <section className="page">
      <button type="button" className="lien-texte" onClick={onBack}>
        ← Retour aux annonces
      </button>

      <article className="detail">
        <p className="etiquette">Événement · {formaterDate(annonce.dateEvenement)}</p>
        <h1>{annonce.titre}</h1>
        <p className="meta">
          Publié par {annonce.auteur?.nom || 'Membre'} · {formaterDate(annonce.createdAt)}
        </p>
        <p className="corps">{annonce.contenu}</p>
        {estAuteur && (
          <button type="button" className="bouton danger" onClick={supprimerAnnonce}>
            Supprimer mon annonce
          </button>
        )}
      </article>

      {erreur && <p className="alerte">{erreur}</p>}

      <h2 className="titre-section">Avis des membres ({avis.length})</h2>

      {user ? (
        <AvisForm annonceId={annonce._id} onCree={charger} />
      ) : (
        <p className="bandeau">Connectez-vous pour laisser un avis.</p>
      )}

      {avis.length === 0 && <p className="info">Pas encore d'avis.</p>}

      <ul className="liste-avis">
        {avis.map((item) => {
          const peutSupprimer = user && String(user._id) === String(item.auteur?._id)
          return (
            <li key={item._id} className="avis">
              <div>
                <strong>{item.auteur?.nom || 'Membre'}</strong>
                <span>{formaterDate(item.createdAt)}</span>
                <p>{item.texte}</p>
              </div>
              {peutSupprimer && (
                <button type="button" className="bouton danger leger" onClick={() => supprimerAvis(item._id)}>
                  Supprimer
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
