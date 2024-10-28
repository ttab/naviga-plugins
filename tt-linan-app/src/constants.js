export const DROPDOWN_OPTIONS = [
  {
    label: 'Inrikes',
    filterProperty: {
      name: 'product',
      values: ['TTINR','TWINR','REDINFINR'],
      valueKey: 'code'
    }
  },
  {
    label: 'Utrikes',
    filterProperty: {
      name: 'product',
      values: ['TTUTR','TWUTR','REDINFUTR'],
      valueKey: 'code'
    }
  },
  {
    label: 'Sport',
    filterProperty: {
      name: 'product',
      values: ['TTSPT','TWSPT','REDINFSPT'],
      valueKey: 'code'
    }
  },
  {
    label: 'Ekonomi',
    filterProperty: {
      name: 'product',
      values: ['TTEKO','TWEKO','REDINFEKO'],
      valueKey: 'code'
    }
  },
  {
    label: 'Kultur och nöje',
    filterProperty: {
      name: 'product',
      values: ['TTNOJKUL','TWNOJ','REDINFKLN'],
      valueKey: 'code'
    }
  },
  {
    label: 'Feature',
    filterProperty: {
      name: 'product',
      values: ['FTBOS','FTRCT','FTMAT','FTGRT','FTHLS','FTKOT','FTFML','FTMMA','FTMOT','FTPEK','FTRES','FTRESPLS','FTTGF','FTNEKO','FTNHEM','FTNLIV','FTNMAT','FTNMOT','FTNRES','FTDFD'],
      valueKey: 'code'
    }
  },
  {
    label: 'Tidigare version publicerad',
    filterProperty: {
      name: 'earlierVersionPublished'
    }
  }
]

// TODO: Undvik duplicering av data här...
export const CATEGORIES = [
  {
    label: 'Inrikes',
    sector: 'INR',
    products: ['TTINR','TWINR','REDINFINR']
  },
  {
    label: 'Utrikes',
    sector: 'UTR',
    products: ['TTUTR','TWUTR','REDINFUTR']
  },
  {
    label: 'Sport',
    sector: 'SPT',
    products: ['TTSPT','TWSPT','REDINFSPT']
  },
  {
    label: 'Ekonomi',
    sector: 'EKO',
    products: ['TTEKO','TWEKO','REDINFEKO']
  },
  {
    label: 'Kultur och nöje',
    sector: 'KLT',
    products: ['TTNOJKUL','TWNOJ','REDINFKLN']
  },
  {
    label: 'Feature',
    sector: 'FEA',
    products: ['FTBOS','FTRCT','FTMAT','FTGRT','FTHLS','FTKOT','FTFML','FTMMA','FTMOT','FTPEK','FTRES','FTRESPLS','FTTGF','FTNEKO','FTNHEM','FTNLIV','FTNMAT','FTNMOT','FTNRES','FTDFD']
  }
]

export const AUTH_ENDPOINT = 'https://tt.se/o/oauth2/auth'