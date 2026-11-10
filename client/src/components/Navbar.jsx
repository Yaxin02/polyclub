export default function Navbar({ user, page, onNavigate, onLogout }) {
  return (
    <header className="nav">
      <button type="button" className="marque" onClick={() => onNavigate('accueil')}>
        <span className="logo">PC</span>
        <span>
          <strong>PolyClub</strong>
          <small>Club Informatique · EPS</small>
        </span>
      </button>

      <nav>
        <button
          type="button"
          className={page === 'accueil' ? 'lien actif' : 'lien'}
          onClick={() => onNavigate('accueil')}
        >
          Annonces
        </button>

        {user ? (
          <>
            <span className="qui">{user.nom}</span>
            <button type="button" className="lien danger" onClick={onLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={page === 'login' ? 'lien actif' : 'lien'}
              onClick={() => onNavigate('login')}
            >
              Connexion
            </button>
            <button type="button" className="bouton" onClick={() => onNavigate('register')}>
              Inscription
            </button>
          </>
        )}
      </nav>
    </header>
  )
}
