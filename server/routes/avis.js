const express = require('express')
const mongoose = require('mongoose')
const Avis = require('../models/Avis')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide' })
    }

    const avis = await Avis.findById(req.params.id)
    if (!avis) {
      return res.status(404).json({ message: 'Avis introuvable' })
    }

    if (avis.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres avis' })
    }

    await avis.deleteOne()
    return res.status(200).json({ message: 'Avis supprimé' })
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
