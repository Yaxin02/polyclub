require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const annonceRoutes = require('./routes/annonces')
const avisRoutes = require('./routes/avis')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
)

// Lit le JSON du body et le place dans req.body. Doit être avant les routes.
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API PolyClub opérationnelle' })
})

app.use('/api/auth', authRoutes)
app.use('/api/annonces', annonceRoutes)
app.use('/api/avis', avisRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' })
})

const PORT = process.env.PORT || 5000

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('MONGO_URI et JWT_SECRET sont obligatoires dans le fichier .env')
  process.exit(1)
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Connexion MongoDB échouée:', error.message)
    process.exit(1)
  })
