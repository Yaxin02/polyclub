const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/register', async (req, res) => {
  try {
    const { nom, email, password } = req.body

    if (!nom || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailValide.test(email)) {
      return res.status(400).json({ message: 'Email invalide' })
    }

    const existe = await User.findOne({ email: email.toLowerCase() })
    if (existe) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    // 10 = cost factor : bcrypt répète le hachage 2^10 fois.
    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      nom,
      email,
      password: hash
    })

    return res.status(201).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      token: genererToken(user._id)
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const motDePasseOk = await bcrypt.compare(password, user.password)
    if (!motDePasseOk) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    return res.status(200).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      token: genererToken(user._id)
    })
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
