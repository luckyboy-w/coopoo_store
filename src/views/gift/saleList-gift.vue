<template>
  <div>
    <goodListDom :goodStatus="goodStatus" :dataSource='dataSource' :giftStatus="isGift"/>
  </div>
</template>

<script>
  import goodListDom from '../goods/saleList'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          goodStatus:{
            verifyStatus: 20,
            isSale: 1
          },
          isGift:'2',
          dataSource:'giftOnSale'
      };
    },
    components: {goodListDom},
    computed: {},
    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='' scoped>

</style>