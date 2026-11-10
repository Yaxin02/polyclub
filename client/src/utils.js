export function formaterDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Tunis'
  })
}

export function messageErreur(error, secours) {
  return error.response?.data?.message || secours
}
