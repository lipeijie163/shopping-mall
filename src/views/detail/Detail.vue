<template>
  <div id="detail">
    <detail-navbar class="detail-nav" @titleClick="titleClick" ref="dnav"/>

    <scroll class="wrapper" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <div>
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comments" :comment-info="commentInfo"/>
        <goods-list ref="recommends" :goods="recommends"/>
      </div>
    </scroll>

    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavbar from "./childComps/DetailNavbar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import {getDetail, Goods, Shop, GoodsParam, getRecommends} from "network/detail";

  import Scroll from "components/common/scroll/Scroll";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import {itemListenerMixin} from "common/mixin";
  import {debounce} from "common/utils";

  export default {
    name: "Detail",
    components: {
      DetailBottomBar,
      DetailParamInfo,
      DetailNavbar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailCommentInfo,
      Scroll,
      GoodsList
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0
      }
    },
    mixins: [itemListenerMixin],
    created() {
      this.iid = this.$route.params.iid;
      getDetail(this.iid).then(res => {
        const data = res.result;
        this.topImages = data.itemInfo.topImages;
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        this.shop = new Shop(data.shopInfo)
        this.detailInfo = data.detailInfo;
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      })

      getRecommends().then((res, err) => {
        if (err) return
        this.recommends = res.data.list
      })

      this.getThemeTopYs = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comments.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)
      }, 100)
    },
    mounted() {
    },
    updated() {

    },
    methods: {
      imageLoad() {
        this.$refs.scroll.scroll.refresh()
        this.getThemeTopYs()
      },

      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },

      contentScroll(position) {
        const positionY = -position.y;
        const length = this.themeTopYs.length
        for (let i = 0; i < length-1; i++) {
          if(this.currentIndex !== i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.dnav.currentIndex = this.currentIndex
          }
        }
      },

      addCart() {
        const obj = {}
        obj.iid = this.iid;
        obj.image = this.topImages[0];
        obj.title = this.goods.title;
        obj.desc = this.goods.desc;
        obj.price = this.goods.newPrice;

        this.$store.dispatch('addCart', obj)

        console.log(obj)
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .wrapper {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
