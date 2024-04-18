export const usedateTimeForamat = (date:string, options:any={}) => {
  const formatoptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
   
    ...options
  }
  let localeLg = 'fr-FR'

  let baseFormat = 'Y/m/d '

  switch (options?.format) {
    case 'date':
      baseFormat = 'Y/m/d '
      break;
    case 'time':
      baseFormat = 'H:i:s '
      break;
    case 'datetime':
      baseFormat = 'Y/m/d H:i:s '
      break;
    default:
      baseFormat = 'Y/m/d '
      break;
  }

  switch (options?.local) {
    case 'en':
      localeLg = 'en-US'
      break;
    case 'fr':
      localeLg = 'fr-FR'
      break;
    default:
      localeLg = 'fr-FR'
      break;
  }
  let subdate = new Date(date)
  if(options.sub){
    //soustraction de jours
    subdate.setDate(subdate.getDate() - options.sub)

  }

  if(!date) return new Date().toLocaleDateString(localeLg).split('/').join('-')
  return subdate.toLocaleDateString(localeLg).split('-').join('/')
  
}
