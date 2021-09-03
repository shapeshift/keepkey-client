<template>
  <q-card class="text-center q-pb-lg">
    <q-card-section>
      <h4>Attempting to Start Wallet!</h4>
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
        <q-list align="left" separator style="width: 418px">
          <q-item clickable v-ripple>
            <q-item-section>
              context: {{context}}
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              Wallets: {{walletContexts}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              Devices: {{devices}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              Username: {{username}}</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-section>
                QueryKey: {{queryKey}}</q-item-section>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-section>
                <br/>
                total Value: {{totalValueUsd}}

                <br/>
<!--                Master BTC:{{masterAddressBtc}}-->

<!--                <br/>-->
<!--                Master ETH: {{masterAddressEth}}-->
              </q-item-section>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

<!--      <q-btn-->
<!--        color="primary"-->
<!--        @click="addWallet"-->
<!--        label="Add an additional Wallet"-->
<!--        size="lg"-->
<!--        class="font-weight-medium q-pl-md q-pr-md"-->
<!--        style="font-size:1rem;"-->
<!--      ></q-btn>-->
<!--      <q-btn-->
<!--        color="primary"-->
<!--        @click="addPath"-->
<!--        label="Add Path"-->
<!--        size="lg"-->
<!--        class="font-weight-medium q-pl-md q-pr-md"-->
<!--        style="font-size:1rem;"-->
<!--      ></q-btn>-->

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
        masterAddressBtc:"",
        masterAddressEth:"",
        totalValueUsd:0,
        isUsernameValid:false,
        isQuerykeyActive:false,
        isWalletLoaded:false,
        isWalletCorrect:false,
        pioneerUrl:"",
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
      },
      "$store.state.walletContexts": {
        handler: function(value) {
          //get value
          this.walletContexts = this.$store.getters['getWalletContexts'];
          console.log("wallets: ",this.walletContexts)
        },
        immediate: true
      },
      "$store.state.wallets": {
        handler: function(value) {
          //get value
          this.wallets = this.$store.getters['getWallets'];
          console.log("wallets: ",this.wallets)
          //if wallets and context then ready
          if(this.wallets.length > 0 && this.context){
            this.isReady = true;
          }
        },
        immediate: true
      },
      "$store.state.totalUsd": {
        handler: function(value) {
          //get value
          const totalUsd = this.$store.getters['getTotal'];
          console.log("TOTAL USD: ",totalUsd)
          this.totalValueUsd = totalUsd

        },
        immediate: true // provides initial (not changed yet) state
      },
      "$store.state.username": {
        handler: function(value) {
          //get value
          this.username = this.$store.getters['getUsername'];
          console.log("username: ",this.username)
        },
        immediate: true // provides initial (not changed yet) state
      },
      "$store.state.queryKey": {
        handler: function(value) {
          //get value
          this.queryKey = this.$store.getters['getQueryKey'];
          console.log("username: ",this.username)
        },
        immediate: true // provides initial (not changed yet) state
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
      async refreshPioneer() {
        console.log("refresh everything!")
        //refresh
        this.$q.electron.ipcRenderer.send('refreshPioneer', {});

        //TODO why is this bs needed!!??
        //get all the things
        this.context = await this.$store.getters['getContext']
        this.username = await this.$store.getters['getUsername']
        this.queryKey = await this.$store.getters['getQueryKey']
        let total = await this.$store.getters['getTotal']
        // this.wallets = await this.$store.getters['wallets']
        this.devices = await this.$store.getters['devices']
        this.isPioneerLive = await this.$store.getters['getPioneerLive']
        let pioneerUrl = await this.$store.getters['getPioneerUrl']
        let seed = await this.$store.getters['getMnemonic']
        let balances = await this.$store.getters['getBalances']
        this.totalValueUsd = total
        console.log("STATE: ",this)
        //console.log("STATE: ",{context:this.context, testnet,username,total,walletsLoaded,devicesLoaded,isPioneerLive,pioneerUrl,seed,balances})

        //if wallets and context then ready
        if(this.wallets.length > 0 && this.context){
          this.isReady = true;
        } else {
          console.log("Wallet not ready to start!")
        }

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
