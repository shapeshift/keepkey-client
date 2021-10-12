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

      Verify connected to keepkey:

      Offer changing of url if not live

   */


  //TODO offer pre-generated name
  // import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        error:false,
        acceptTerms:false,
        username: "",
        usePrivateNode: false,
        password:""
      }
    },
    async mounted() {
      try{


      }catch(e){
        console.error(e)
      }
    },
    watch: {

    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onSetupPioneer: async function () {


      },
      onSubmitQuick: async function () {
        console.log("onSubmit")


      },
      accept () {
        console.log("clicked checkbox")

      },
      close() {
        this.hideModal()
      },
      onReset () {

      },
      openSetup: function () {
        this.hideModal()
        //open setup
        this.showModal('Setup')
      }
    }
  }
</script>
