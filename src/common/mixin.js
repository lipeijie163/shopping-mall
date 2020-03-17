import {debounce} from "./utils";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    this.itemImageListener = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('imageLoad',() => {
      this.itemImageListener()
    })
  }
}
