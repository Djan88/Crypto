const API_KEY = "125a4fcba89334b404b1060a1456be5995e6384a201fc0c775369dcb938e89b5"

const tickersHadlers = new Map()

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)
const AGGREGATE_INDEX = '5';

socket.addEventListener('message', e => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || !newPrice) {
    return;
  }
  const handlers = tickersHadlers.get(currency) ?? []
  handlers.forEach(fn => fn(newPrice));
})


function sendToWS(message){
  const stringifiedMessage = JSON.stringify(message);
  if(socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage)
    return
  }
  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage)
  }, {once: true})
}

function subscribeToTickerOnWs(ticker) {
  sendToWS({
    "action": "SubAdd",
    "subs": [`5~CCCAGG~${ticker}~USD`]
  })
}

function unsubscribeToTickerOnWs(ticker) {
  sendToWS({
    "action": "SubRemove",
    "subs": [`5~CCCAGG~${ticker}~USD`]
  })
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHadlers.get(ticker) || []
  tickersHadlers.set(ticker, [...subscribers, cb])
  subscribeToTickerOnWs(ticker)
}
export const unsubscribeFromTicker = (ticker) => {
  tickersHadlers.delete(ticker)
  unsubscribeToTickerOnWs(ticker)
}