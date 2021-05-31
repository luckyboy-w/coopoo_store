<template>
  <div>
    <!--    :goodStatus="goodStatus"-->
    <orderListDom :dataSource="dataSource" :orderStatus="orderStatus"/>
  </div>
</template>

<script>
import orderListDom from './list'

export default {
  name: '',
  props: [''],
  data() {
    return {
      orderStatus: {
        status: '10'
      },
      dataSource: 'ready-list'
    }
  },
  components: { orderListDom },
  computed: {},
  beforeMount() {
  },

  mounted() {
  },

  methods: {},

  watch: {}

}

</script>
<style lang="" scoped>

</style>
