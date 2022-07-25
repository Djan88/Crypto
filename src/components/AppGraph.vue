<template>
  <section v-if="this.curTicker" class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ this.curTicker.name }} - USD
    </h3>
    <div class="flex items-end border-gray-600 border-b border-l h-64" ref="graph">
      <div v-for="(bar, idx) in normalizedGraph" :key="idx" :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-10 h-24" ref="graphElem"></div>
    </div>
    <button type="button">
      
    </button>
    <app-button @click="removeCurTicker" class="absolute top-0 right-0">
      <template v-slot:icon>
        <icon-close></icon-close>
      </template>
    </app-button>
  </section>
</template>
<script>
import AppButton from './AppButton.vue';
import IconClose from './icons/IconClose.vue';
export default {
  components:{
    AppButton,
    IconClose,
  },
  props: {
    curTicker: {
      type: Object,
      default: {}
    },
    graphList: {
      type: Array,
      default: []
    }
  },
  emits: {
    "remove-cur-ticker": value => typeof value === 'object'
  },
  computed: {
    // Форматирование графика
    normalizedGraph() {
      const maxVal = Math.max(...this.graphList);
      const minVal = Math.min(...this.graphList);
      if (maxVal === minVal) {
        return this.graphList.map(() => 50)
      }
      return this.graphList.map(
        price => 5 + ((price - minVal) * 95) / (maxVal - minVal)
      )
    },
  },
  methods: {
    removeCurTicker() {
      this.$emit('remove-cur-ticker', this.curTicker)
    }
  }

}
</script>
<style>
</style>