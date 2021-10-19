<template>
  <q-page>
    <div class="page-header">
      <div><h4>KeepKey</h4></div>
    </div>
  </q-page>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'Keepkey',
    data () {
      return {
        queryKey:"",
        devices:[],
        installing: [],
        showPolicys: false,
        columns: [
          {
            name: 'policyName',
            align: 'center',
            label: 'policyName',
            field: 'policyName',
            sortable: false
          },
          {
            name: 'enabled',
            align: 'center',
            label: 'enabled',
            field: 'enabled',
            sortable: false
          },
        ],
        data: [
          { policyName: 'ShapeShift', enabled: true },
          { policyName: 'Pin Caching', enabled: true },
          { policyName: 'Experimental', enabled: false },
          { policyName: 'AdvancedMode', enabled: false }
        ]
      }
    },
    mounted() {
      try{
      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.devices": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.devices = this.$store.getters['getDevices'];
          console.log("devices: ",this.devices)

        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['getDevices']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
      // UpdateFirmware() {
      //   console.log("updateFirmware")
      //   //this.$q.electron.ipcRenderer.send('updateFirmware', {password});
      // },
      // wipeDevice() {
      //   console.log("wipeDevice")
      //   //this.$q.electron.ipcRenderer.send('wipeDevice', {password});
      // },
      // enablePolicy() {
      //   console.log("enablePolicy")
      //   //this.$q.electron.ipcRenderer.send('enablePolicy', {password});
      // },
    }
  }
</script>
<style lang="scss" scoped>
  .page-header {
    height:70px;
    border-bottom:1px solid var(--border-color);
    padding:0 1.5rem;
    display:flex;
    align-items: center;
    h4 {
      margin-top:0;
      margin-bottom:0;
    }
  }
  .my-card {
    height: 100%;
  }
</style>
