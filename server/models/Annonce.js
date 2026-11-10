const mongoose = require('mongoose')

const annonceSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: 120
    },
    contenu: {
      type: String,
      required: [true, 'Le contenu est obligatoire'],
      maxlength: 2000
    },
    dateEvenement: {
      type: Date,
      required: [true, "La date de l'événement est obligatoire"]
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Annonce', annonceSchema)
