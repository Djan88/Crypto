<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700">Тикер</label>
        <div class="mt-1 relative rounded-md shadow-md">
          <input 
            @keyup="inputHelper" 
            @keypress.enter="addTicker"
            v-model="ticker" 
            type="text" 
            name="wallet" 
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE" />
        </div>
        <div 
          v-if="ticker" 
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span 
            @click="appendCoin(coinItem.Symbol)" 
            v-for="coinItem in actualaizedCoinList"
            :key="coinItem.Id"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ coinItem.Symbol }}
          </span>
        </div>
        <div v-if="this.tAdded === true" class="text-sm text-red-600">Такой тикер уже добавлен</div>
      </div>
    </div>
    <app-button
      @click="addTicker" 
      type="button" 
      :class="{
        'disabled': !this.ticker.length
      }"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <template v-slot:icon>
        <icon-plus></icon-plus>
      </template>
      <template v-slot:title>
          Добавить
      </template>
    </app-button>
  </section>
</template>
<script>
import AppButton from './AppButton.vue'
import IconPlus from './icons/IconPlus.vue';

export default {
  components: {
    AppButton,
    IconPlus
  },
  props: {
    tAdded: {
      type: Boolean,
      required: false,
      default: false
    },
    fetchedCoinList: {
      type: Array
    }
  },
  emits: {
    "add-ticker": value => typeof value === 'string' && value.length > 0
  },
  data() {
    return {
      ticker: '',
      maxInputs: 4,
      actualaizedCoinList: []
    }
  },
  methods: {
    // Подсказки при вводе криптовалют
    inputHelper() {
      let counter = 0;
      this.actualaizedCoinList = [];
      for (let i = 0; i <= this.fetchedCoinList.length - 1; i++) {
        if (this.fetchedCoinList[i].Symbol && this.fetchedCoinList[i].Symbol.toUpperCase().includes(this.ticker.toUpperCase())) {
            this.actualaizedCoinList.push(this.fetchedCoinList[i])
            counter++
        }
        if (counter === this.maxInputs) {
            break;
        }
      }
    },
    addTicker() {
      if (this.ticker.length === 0) {
        return;
      }
      this.$emit('add-ticker', this.ticker)
      if (this.ticker.length) {
        this.ticker = ''
      }
    },
  },
}
</script>
<style>
</style>