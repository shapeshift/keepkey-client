<template>
  <q-card class="text-center q-pl-lg q-pr-lg" style="min-width:450px;">
    <div class="q-pa-md">
      <h5>Welcome!</h5>
      <div class="q-gutter-sm">
        <small>the software is provided 'as is', without warranty of any kind, express or implied. </small>
      </div>
      <br>
    </div>
  </q-card>
</template>
<script>
  /*



   */

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
      onSubmitQuick: async function () {
        console.log("onSubmit")
      },
      accept () {
        console.log("clicked checkbox")

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
