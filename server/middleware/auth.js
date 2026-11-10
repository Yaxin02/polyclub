const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Sentinelle : laisse passer seulement une requête qui porte un JWT valide.
const protect = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' })
    }

    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' })
  }
}

module.exports = { protect }
