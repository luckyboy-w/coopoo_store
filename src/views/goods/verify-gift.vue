<template>
  <div>
    <goodListDom :goodStatus="goodStatus" :dataSource='dataSource'  :giftStatus='0'/>
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
            verifyStatus: 10
          },
          dataSource:'unsale'
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