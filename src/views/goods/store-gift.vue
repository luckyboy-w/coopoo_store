<template>
  <div>
    <goodListDom :goodStatus="goodStatus" :dataSource='dataSource'  :giftStatus="'0'"/>
  </div>
</template>

<script>
  import goodListDom from './saleList'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          goodStatus:{
            verifyStatus:5
          },
          dataSource:'store'
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