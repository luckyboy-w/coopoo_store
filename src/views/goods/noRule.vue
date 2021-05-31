<template>
  <div>
    <goodListDom :goodStatus="goodStatus" :dataSource='dataSource'/>
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
            verifyStatus: '40',
            isSale: '3'
          },
          dataSource:'noRule'
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