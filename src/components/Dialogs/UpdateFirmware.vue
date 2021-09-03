<template>
  <q-card class="text-center q-pl-lg q-pr-lg" style="min-width:450px;">
    <div class="q-pa-md">
      <h5>Update Firmware!</h5>
      <div class="q-gutter-sm">
        <small>Update Firmware</small>
      </div>
      <q-btn
        color="primary"
        @click="close"
        label="close"
        size="lg"
        class="font-weight-medium q-pl-md q-pr-md"
        style="font-size:1rem;"
      ></q-btn>
    </div>
  </q-card>
</template>
<script>
  /*

      Username Dialog

      Verify connected to pioneer:

      Offer changing of url if not live

   */


  //TODO offer pre-generated name
  // import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        error:false,
        pioneerLive:false,
        acceptTerms:false,
        username: "",
        usePrivateNode: false,
        // pioneerUrl:"",
        password:""
      }
    },
    async mounted() {
      try{
        // console.log("env var: ",process.env['URL_PIONEER_SPEC'])
        // this.pioneerUrl = process.env['URL_PIONEER_SPEC']
        this.$q.electron.ipcRenderer.send('checkPioneerUrl', {});

      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.pioneerUrl": {
        handler: function(value) {
          console.log("pioneerUrl value: ",value)
          this.pioneerUrl = value
        },
        immediate: true
      },
      "$store.state.pioneerLive": {
        handler: function(value) {
          console.log("pioneerLive value: ",value)
          this.pioneerLive = value
        },
        immediate: true
      }
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onSetupPioneer: async function () {
        console.log("Setup Pioneer")
        this.showModal('Pioneer')
      },
      onSubmitQuick: async function () {
        console.log("onSubmit")

        //if accepted terms
        if(this.acceptTerms){
          this.$q.electron.ipcRenderer.send('setPioneerUrl', {});
          this.hideModal()
          this.showModal('SetupUsername')
        }else{
          console.error("Must Accept terms!")
          alert("Must Accept terms!")
        }
      },
      accept () {
        console.log("clicked checkbox")

      },
      close() {
        this.hideModal()
      },
      onReset () {
        this.username = null
      },
      openSetup: function () {
        this.hideModal()
        //open setup
        this.showModal('Setup')
      }
    }
  }
</script>
