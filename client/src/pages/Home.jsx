import { useEffect, useState } from 'react'
import api from '../api'
import AnnonceCard from '../components/AnnonceCard'
import AnnonceForm from '../components/AnnonceForm'
import { messageErreur } from '../utils'

export default function Home({ user, onOpen }) {
  const [annonces, setAnnonces] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  async function charger() {
    try {
      setChargement(true)
      const reponse = await api.get('/api/annonces')
      setAnnonces(reponse.data)
      setErreur('')
    } catch (error) {
      setErreur(messageErreur(error, 'Impossible de charger les annonces'))
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  return (
    <section className="page">
      <div className="intro">
        <p className="surtitre">École Polytechnique de Sousse</p>
        <h1>Le tableau du club informatique</h1>
        <p>
          Ateliers, sorties et annonces des membres. La lecture est ouverte à tous.
          Publier ou supprimer demande un compte.
        </p>
      </div>

      {user ? (
        <AnnonceForm onCree={charger} />
      ) : (
        <p className="bandeau">Mode visiteur : connectez-vous pour publier une annonce ou laisser un avis.</p>
      )}

      {chargement && <p className="info">Chargement des annonces...</p>}
      {erreur && <p className="alerte">{erreur}</p>}

      {!chargement && annonces.length === 0 && (
        <p className="info">Aucune annonce pour le moment.</p>
      )}

      <div className="grille">
        {annonces.map((annonce) => (
          <AnnonceCard key={annonce._id} annonce={annonce} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
