<!-- Обработать ошибки API -->
<!-- Сохранять список токенов в URL -->
<!-- Если монтеки нет в списке монет, то выделять ее красным -->
<template>
<div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <app-paranja :fetchedCoinList="fetchedCoinList"></app-paranja>
    <div class="container">
        <app-ticker :tAdded="tAdded" :fetchedCoinList = "fetchedCoinList" @add-ticker="addTicker"/>
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
            <button v-if="page > 1" @click="page -= 1" class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Назад</button>
            <button v-if="hasNextPage" @click="page += 1" class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Вперед</button>
            <span>Фильтр: </span>
            <input v-model="filterParam" type="text" class="pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md" placeholder="Что искать?" />
        </div>
        <template v-if="this.tickers.length">
            <hr class="w-full border-t border-gray-600 my-4" />
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div v-for="t in paginatedTickers" :key="t.name" @click="curTicker = t" :class="{ 'border-4': t === curTicker }" class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer">
                    <div class="px-4 py-5 sm:p-6 text-center">
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            {{ t.name }} - USD
                        </dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ formatedPrice(t.value) }}
                        </dd>
                    </div>
                    <div class="w-full border-t border-gray-200"></div>
                    <button @click.stop="removeTicker(t)" class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#718096" aria-hidden="true">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>Удалить
                    </button>
                </div>
            </dl>
            <hr class="w-full border-t border-gray-600 my-4" />
        </template>
        <div v-if="!this.filtredTickers.length">Нет добавленных счетчиков или нет результатов удовлетворяющих фильтру
        </div>
        <app-graph @remove-cur-ticker="curTicker = null" :curTicker="curTicker" :graphList="graphList"></app-graph>
    </div>
</div>
</template>

<script>
import {subscribeToTicker, unsubscribeFromTicker} from './api'
import AppTicker from './components/AppTicker.vue'
import AppParanja from './components/AppParanja.vue'
import AppGraph from './components/AppGraph.vue'

export default {
    name: 'App',
    data() {
        return {
            filterParam: '',
            tAdded: false,
            tickers: [],
            fetchedCoinList: [],
            curTicker: null,
            graphList: [],
            page: 1,
        }
    },
    components: {
        AppTicker,
        AppParanja,
        AppGraph
    },
    mounted() {
        // Получаем тикеры из LS, если они есть
        this.tickers = JSON.parse(window.localStorage.getItem('tickerList'))
        this.tickers.forEach( t => {
            subscribeToTicker(t.name, (value) => {
                this.updateTickers(t.name, value)
            })
        })
        
        // Получение параметров из URL
        const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())
        if (windowData.filterParam) {
            this.filterParam = windowData.filterParam
        }
        if (windowData.page) {
            this.page = Number(windowData.page)
        }
        // Получаем список имен криптовалют
        this.fetchCoinNames()
        window.addEventListener('resize', this.calculateMaxGraphElements())
    },
    beforeMount(){
        window.removeEventListener('resize', this.calculateMaxGraphElements())
    },
    computed: {
        // Диапазон тикеров на страницу
        fromIndex() {
            return (this.page - 1) * 6;
        },
        toIndex() {
            return this.page * 6;
        },
        // Фильтрованные тикеры
        filtredTickers() {
            return this.tickers.filter(elem => elem.name.toUpperCase().includes(this.filterParam.toUpperCase()))
        },
        // Постраничная пагинация
        paginatedTickers() {
            return this.filtredTickers.slice(this.fromIndex, this.toIndex);
        },
        // Есть ли еще страницы
        hasNextPage() {
            return this.filtredTickers.length > this.toIndex
        },
        // Обновление параметров в URL
        pageStateOptions(){
            return {
                filterParam: this.filterParam,
                page: this.page
            }
        }
    },
    watch: {
        filterParam() {
            this.page = 1;
        },
        pageStateOptions(value) {
            window.history.pushState(null, '', `${window.location.pathname}?filterParam=${value.filterParam}&page=${value.page}`)
        },
        tickers() {
            window.localStorage.setItem('tickerList', JSON.stringify(this.tickers));
        },
        curTicker() {
            this.graphList = []
        }
    },
    methods: {
        // Получение списка названий монет
        fetchCoinNames() {
            fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
            .then((response) => {
                return response.json()
            })
            .then((dataExchange) => {
                for (let elem in dataExchange.Data) {
                dataExchange.Data[elem].Id = Number(dataExchange.Data[elem].Id)
                this.fetchedCoinList.push(dataExchange.Data[elem])
                }
                this.fetchedCoinList.sort((a, b) => {
                    return a.Symbol.length - b.Symbol.length
                })
            })
            this.$emit('coin-list', this.fetchedCoinList)
        },
        calculateMaxGraphElements(){
            if (this.$refs.graphElem) {
                return this.$refs.graph.offsetWidth / this.$refs.graphElem[0].offsetWidth
            }
        },
        updateTickers(tickerName, value) {
            this.tickers
                .filter(t => t.name === tickerName)
                .forEach(t => {
                    if(t === this.curTicker){
                        this.graphList.push(value)
                    }
                    t.value = value
                })
            if(this.graphList.length > this.calculateMaxGraphElements()){
                this.graphList = this.graphList.slice(this.graphList.length - this.calculateMaxGraphElements(), this.graphList.length)
            }
            this.calculateMaxGraphElements()
        },
        // Приведение курса к нормальному виду
        formatedPrice(price){
            if (!price || price === '-') {
                return
            }
            return price > 1 ? price.toFixed(2) : price.toPrecision(2)
        },
        addTicker(ticker) {
            const newTicker = {
                name: ticker.toUpperCase(),
                value: '-',
                isExist: true
            };
            // Если такой тикер уже есть, выходим
            if (this.tickers.find(t => t.name === newTicker.name)) {
                this.tAdded = true
                setTimeout(() => this.tAdded = false, 2000)
                return
            }
            this.tickers.push(newTicker)
            this.tickers = [...this.tickers]
            subscribeToTicker(newTicker.name, value => {
                this.updateTickers(newTicker.name, value)
            })
        },
        // Удаление тикера
        removeTicker(n) {
            this.tickers = this.tickers.filter((elem) => elem !== n)
            unsubscribeFromTicker(n.name)
            if (this.tickers.length < 1 || this.curTicker === n) {
                this.curTicker = null
            }
            // Если на странице пагинации не осталось тикеров, переходим на предыдущую
            if (this.paginatedTickers.length === 0 && this.page > 1) {
                this.page -= 1
            }
        },
        
    }
}
</script>

<style>
.disabled {
    opacity: 0.5;
}
</style>
