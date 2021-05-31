<template>
  <div class="dashboard-container">

    <iframe  src="https://kefu.easemob.com/" width="100%" :height="ifrmHeight"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'custom-manager',
  data() {
    return {
      ifrmHeight:'400',
      currentRole: 'adminDashboard'
    }
  },
  computed: {
  },
  mounted() {
    this.ifrmHeight = document.body.clientHeight - 85
  },
  created() {
  }
}
</script>
