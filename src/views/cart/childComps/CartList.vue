<template>
  <div>
    <cart-list-item v-for="(item, index) in cartList"
                    :key="index"
                    :itemInfo='item'></cart-list-item>
  </div>
</template>

<script>
  import CartListItem from './CartListItem.vue'
  export default {
    components: {
      CartListItem,
    },
    props: {
      cartList: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
