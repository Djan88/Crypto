<template>
  <div class="dialog" v-if="modalShow" @click="modalClose">
    <div @click.stop class="dialog_body">
      <h3>Заголовок модального окна</h3>
      <div class="dialog_content">
        Текст который будет выводиться в теле модального окна и на который надо реагировать
      </div>
      <div class="dialog_buttons">
        <div class="dialog-left-side">
          <slot name="leftSide">
          
          </slot>
        </div>
        <slot name="rightSide">
          <app-button 
            @click="modalClose"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <template v-slot:title>
              Закрыть
            </template>
          </app-button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from './AppButton.vue'
export default {
  components: {
    AppButton
  },
  props: {
    modalShow: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits:{
    'modal-close': null
  },
  mounted(){
    document.addEventListener("keydown", this.handlekeydownClosePopup)
  },
  beforeUnmount(){
    document.removeEventListener("keydown", this.handlekeydownClosePopup)
  },
  data() {
    return {
      
    }
  },
  methods: {
    modalClose(){
      this.$emit('modal-close')
    },
    handlekeydownClosePopup(e) {
      if (this.modalShow === true && e.key === "Escape") {
        this.modalClose();
      }
    }
  }
}
</script>
<style scoped>
  .dialog
  {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0, .5);
    position: fixed;
    display: flex;
    z-index: 999;
  }
  .dialog h3
  {
    font-size: 1.5rem;
    padding: 10px;
  }
  .dialog_body
  {
    margin: auto;
    background: #fff;
    border-radius: 12px;
    min-height: 50px;
    min-width: 300px;
  }
  .dialog_content
  {
    padding: 10px;
  }
  .dialog_buttons
  {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    border-top: 2px dashed #555;
  }
  .dialog-left-side
  {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>