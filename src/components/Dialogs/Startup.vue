<template>
  <q-card class="text-center q-pb-lg">
    <q-card-section>
      <q-spinner
        color="primary"
        size="5rem"
        v-if="isReady === false"
        key="spinner"
      />
      <div v-if="isReady">
        <h3>Loaded Wallet Successfully!</h3>
        <q-icon name="done" />
      </div>
      <div v-if="!isReady">
        <p>Loading Wallet! </p>
      </div>
    </q-card-section>
    <q-card-actions vertical align="left" class="q-pb-lg">
      <div class="q-pa-md text-white">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-section>
              <br/>
            </q-item-section>
          </q-item-section>
        </q-item>
      </div>

      <div v-if="isReady">
        <q-btn
          color="primary"
          @click="startPlatform"
          label="Continue"
          size="lg"
          class="font-weight-medium q-pl-md q-pr-md"
          style="font-size:1rem;"
        ></q-btn>
        <q-icon name="done" />
      </div>
      <div v-if="!isReady">
        <q-btn
          @click="refreshPioneer"
          label="refresh"
          size="lg"
          class="font-weight-medium q-pl-md q-pr-md"
          style="font-size:1rem;"
        ></q-btn>
        <q-icon name="done" />
      </div>

    </q-card-actions>
  </q-card>
</template>
<script>

  import { mapMutations, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isStarted:false,
        wallets:[],
        walletContexts:[],
        devices:[],
        context:"",
        isReady:false,
        error:false,
        username: "",
        password: "",
        auth: "",
        queryKey: ""
      }
    },
    mounted() {
      try{
        //
      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.context": {
        handler: function(value) {
          //get value
          this.context = this.$store.getters['getContext'];
          console.log("watch: this.context: ",this.context)
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['getTotal','getUsername','getQueryKey','getWallets','getContext']),
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onStart () {
        this.$q.electron.ipcRenderer.send('onStart', {});
      },
      startPlatform: function () {
        this.hideModal()
      },
      addWallet () {
        // this.hideModal()
        // this.showModal('Setup')
      },
      addPath () {
        // this.hideModal()
        //open migrate
        //this.showModal('Setup')
      },
      changeWallet: function () {
        // this.hideModal()
        //open migrate
        //this.showModal('Setup')
      }
    }
  }
</script>
