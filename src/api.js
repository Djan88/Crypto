const API_KEY = "125a4fcba89334b404b1060a1456be5995e6384a201fc0c775369dcb938e89b5"

const tickersHadlers = new Map()

// export const loadTickers = (tickersNames) =>
//   fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersNames.join()}&tsyms=USD&api_key=${API_KEY}`
//   )
//     .then(r => r.json())
//     .then(rawData =>
//       Object.fromEntries(
//         Object.entries(rawData).map(([key, value]) => [key, value.USD])
//       )
//     );

const loadTickers = () => {
  if (tickersHadlers.size === 0) {
    return
  }
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHadlers.keys()].join()}&tsyms=USD&api_key=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHadlers.get(currency) ?? []
        handlers.forEach(fn => fn(newPrice));
      })
    });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHadlers.get(ticker) || []
  tickersHadlers.set(ticker, [...subscribers, cb])
}
export const unsubscribeFromTicker = (ticker) => {
  tickersHadlers.delete(ticker)
  // const subscribers = tickersHadlers.get(ticker) || []
  // tickersHadlers.set(ticker, subscribers.filter(fn => fn !== cb))
}

setInterval(loadTickers, 5000)
window.tickers = tickersHadlers