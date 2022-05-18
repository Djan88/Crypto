const API_KEY = "125a4fcba89334b404b1060a1456be5995e6384a201fc0c775369dcb938e89b5"

export const loadTickers = (tickersNames) =>
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersNames.join()}&tsyms=USD&api_key=${API_KEY}`
  )
  .then(r => r.json())
  .then(rawData => 
    Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value.USD])
    )
  )