const express = require('express')
const mongoose = require('mongoose')
const Annonce = require('../models/Annonce')
const Avis = require('../models/Avis')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const annonces = await Annonce.find()
      .populate('auteur', 'nom email')
      .sort({ createdAt: -1 })

    return res.status(200).json(annonces)
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide' })
    }

    const annonce = await Annonce.findById(req.params.id).populate('auteur', 'nom email')
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce introuvable' })
    }

    const avis = await Avis.find({ annonce: annonce._id })
      .populate('auteur', 'nom')
      .sort({ createdAt: -1 })

    return res.status(200).json({ annonce, avis })
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const { titre, contenu, dateEvenement } = req.body

    if (!titre || !contenu || !dateEvenement) {
      return res.status(400).json({ message: 'Titre, contenu et date sont obligatoires' })
    }

    const annonce = await Annonce.create({
      titre,
      contenu,
      dateEvenement,
      auteur: req.user._id
    })

    const complete = await Annonce.findById(annonce._id).populate('auteur', 'nom email')
    return res.status(201).json(complete)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Données invalides' })
    }
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide' })
    }

    const annonce = await Annonce.findById(req.params.id)
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce introuvable' })
    }

    if (annonce.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres annonces' })
    }

    // Relation 1-N : une annonce possède plusieurs avis. On les retire avec elle.
    await Avis.deleteMany({ annonce: annonce._id })
    await annonce.deleteOne()

    return res.status(200).json({ message: 'Annonce supprimée' })
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/:id/avis', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide' })
    }

    const annonce = await Annonce.findById(req.params.id)
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce introuvable' })
    }

    const texte = req.body.texte
    if (!texte || !texte.trim()) {
      return res.status(400).json({ message: "L'avis est obligatoire" })
    }

    const avis = await Avis.create({
      texte: texte.trim(),
      annonce: annonce._id,
      auteur: req.user._id
    })

    const complet = await Avis.findById(avis._id).populate('auteur', 'nom')
    return res.status(201).json(complet)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Données invalides' })
    }
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
