const mongoose = require('mongoose')

const avisSchema = new mongoose.Schema(
  {
    texte: {
      type: String,
      required: [true, "L'avis est obligatoire"],
      trim: true,
      maxlength: 500
    },
    annonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Annonce',
      required: true
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Avis', avisSchema)
