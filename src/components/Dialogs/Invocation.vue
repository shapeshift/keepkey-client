<template>
  <q-card class="text-center q-pb-lg" style="min-width:450px;">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-left">
          <small>invocation</small>
          {{invocationContext}}
        </div>
        <div class="text-center">
          state: {{invocation.state}}
        </div>



        <div class="text-h6"></div>
        <div class="text-subtitle2"></div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Build" name="build" />
        <q-tab label="Sign" name="sign" />
        <q-tab label="Broadcast" name="broadcast" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="q-pa-md bg-grey-10 text-white">
        <q-tab-panel name="build">
          <q-item clickable v-ripple>
            <q-item-section>
              {{context}}
              <div>
                <h5>sending {{invocation.invocation.coin}} to the following address. {{invocation.invocation.address}}</h5>
              </div>
              <q-space />
              <small class="text-left">Source of funds: </small>
              <q-btn-dropdown
                push
                glossy
                no-caps
                icon="account_balance_wallet"
                :label="context.slice(0,10) + ' balance: '+assetBalanceNativeContext+' ('+assetContext+') '+assetBalanceUsdValueContext+' USD' "
              >
                <q-list>
                  <div v-for="(wallet, index) in wallets" :key="index" class="q-mb-sm">
                    <q-item clickable v-close-popup @click="onItemClick(wallet.context)">
                      <q-item-section avatar>
                        <q-avatar icon="account_balance_wallet" color="primary" text-color="white" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{wallet.context.slice(0, 10)}}</q-item-label>
                        <q-item-label caption></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="info" color="amber" />
                      </q-item-section>
                    </q-item>
                  </div>
                </q-list>
              </q-btn-dropdown>

              <div>
                Destination: {{invocation.invocation.address}}
                <small>external</small>
              </div>

              <div>
                Fee's 1 sat/byte === 1cent

              </div>

<!--              <div>Amount Availaible: {{invocation.invocation.amount}}</div>-->
<!--              <h5>Amount: {{invocation.invocation.amount}}</h5>-->
<!--              <h5>Value USD: {{invocation.invocation.amount}}</h5>-->

<!--              <q-item-label caption>Coin: {{invocation.invocation.coin}}</q-item-label>-->
<!--              <q-item-label caption>amount: {{invocation.invocation.amount}}</q-item-label>-->
<!--              <q-item-label caption>address: {{invocation.invocation.address}}</q-item-label>-->
            </q-item-section>
          </q-item>

          <div>
            <q-btn
              color="primary"
              @click="build(invocationContext)"
              label="build"
            ></q-btn>
          </div>
        </q-tab-panel>

        <q-tab-panel name="sign">
          <div>
            {{unsignedTx}}
          </div>

          Review fee's

          Allow Recreate/adjust fee

          Mark RBF if availble

          Mark noBroadcast
          <q-btn
            color="primary"
            @click="sign(invocationContext)"
            label="Sign Transaction"
            size="lg"
            class="font-weight-medium q-pl-md q-pr-md"
            style="font-size:1rem;"
          ></q-btn>
        </q-tab-panel>

        <q-tab-panel name="broadcast">
          This should be the approved* signed* broadcastable* tx

          allow broadcast

          allow recreate tx (replacement)
          <q-btn
            color="primary"
            @click="broadcast(invocationContext)"
            label="Broadcast Transaction"
            size="lg"
            class="font-weight-medium q-pl-md q-pr-md"
            style="font-size:1rem;"
          ></q-btn>
        </q-tab-panel>
      </q-tab-panels>
      <div>
        <div v-if="!isBroadcasting">
          <q-btn
            color="red"
            @click="cancel(invocationContext)"
            label="Reject"
            size="lg"
            class="font-weight-medium q-pl-md q-pr-md"
            style="font-size:1rem;"
          ></q-btn>
        </div>
        <q-btn
          @click="close()"
          label="Exit Invocation"
          size="lg"
          class="font-weight-medium q-pl-md q-pr-md"
          style="font-size:1rem;"
        ></q-btn>
      </div>
    </q-card>

    <div>
<!--      Invocation: {{invocation}}-->
    </div>
  </q-card>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import {ipcRenderer} from "electron";

  export default {
    name: "Invocation",
    data() {
      return {
        tab:"build",
        txBuilt: false,
        loading: false,
        error: false,
        isBroadcasting:false,
        items: [],
        wallets:[],
        walletContext:{},
        invocations: [],
        invocationContext: null,
        context:"",
        assetContext:"",
        assetBalanceNativeContext:"",
        assetBalanceUsdValueContext:"",
        invocation: {},
        unsignedTx: {},
        signedTx: {}
      };
    },
    mounted() {
      try{

        ipcRenderer.on('transactionBuilt', (event, data) => {
          console.log('transactionBuilt event! ',data)
          this.unsignedTx = data.unsignedTx
          this.tab = 'sign'
        })
        ipcRenderer.on('transactionSigned', (event, data) => {
          console.log('transactionSigned event! ',data)
          this.signedTx = data.signedTx
          this.tab = 'broadcast'
        })
      }catch(e){
        console.error(e)
      }
    },
    computed: {
      ...mapGetters(['getInvocations','getInvocationContext','getApps','layout','getWalletInfo','getContext'])
    },
    watch: {
      "$store.state.invocationContextState": {
        handler: function(value) {
          //get value
          this.invocationContextState = this.$store.getters['getInvocationContextState'];
          console.log("watch: this.invocationContextState: ",this.invocationContextState)

          if(this.invocationContextState === 'built'){
            this.tab = 'sign'
          }

        },
        immediate: true
      },
      "$store.state.context": {
        handler: function(value) {
          //get value
          this.context = this.$store.getters['getContext'];
          console.log("watch: this.context: ",this.context)
        },
        immediate: true
      },
      "$store.state.assetContext": {
        handler: function(value) {
          //get value
          this.assetContext = this.$store.getters['getAssetContext'];
          console.log("watch: this.assetContext: ",this.assetContext)
        },
        immediate: true
      },
      "$store.state.assetBalanceNativeContext": {
        handler: function(value) {
          //get value
          this.assetBalanceNativeContext = this.$store.getters['getAssetBalanceNativeContext'];
          console.log("watch: this.assetBalanceNativeContext: ",this.assetBalanceNativeContext)
        },
        immediate: true
      },
      "$store.state.assetBalanceUsdValueContext": {
        handler: function(value) {
          //get value
          this.assetBalanceUsdValueContext = this.$store.getters['getAssetBalanceUsdValueContext'];
          console.log("watch: this.assetBalanceUsdValueContext: ",this.assetBalanceUsdValueContext)
        },
        immediate: true
      },
      "$store.state.wallets": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.updateWalletContext()
          // this.updateContext()
        },
        immediate: true
      },
      "$store.state.invocationContext": {
        handler: function (value) {
          console.log("value: ", value)
          //get value
          this.invocationContext = this.$store.getters['getInvocationContext'];
          this.invocation = this.invocations.filter(e => e.invocationId === this.invocationContext)[0]
        },
        immediate: true
      },
      "$store.state.invocations": {
        handler: function (value) {
          console.log("value: ", value)
          //get value
          this.invocations = this.$store.getters['getInvocations'];
          console.log("invocations: ", this.invocations)
          if(!this.invocation) this.invocation = this.invocations[0]
        },
        immediate: true
      },
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      refresh (done) {
        setTimeout(() => {
          //this.items.push()
          done()
        }, 1000)
      },
      updateWalletContext() {
        //get value
        this.wallets = this.$store.getters['wallets'];
        console.log("wallets: ",this.wallets)
        console.log("this.context: ",this.context)
        // this.updateContext()
        let currentWallet = this.wallets.filter(e => e.context === this.context)
        console.log("currentWallet: ",currentWallet)
        this.walletContext = currentWallet[0]
        if(this.walletContext){
          let coins = Object.keys(currentWallet[0].masters)
          let coinList = []
          for(let i = 0; i < coins.length; i++){
            let coin = coins[i]
            coinList.push({
              symbol:coin,
              icon:"https://static.coincap.io/assets/icons/svg/"+coin.toLowerCase()+".svg",
            })
          }
          this.coins = coinList
        } else if(this.wallets.length > 0){
          //set context to current
          this.context = this.wallets[0].context
          // this.$q.electron.ipcRenderer.send('updateContext', {
          //   context:this.context,
          //   reason:"current context not in wallet array!"
          // });
        }
      },
      onItemClick(context) {
        console.log("set context: ",context)
        if(context !== this.context){
          this.context = context
          this.$q.electron.ipcRenderer.send('setContext', {context});
        }
      },
      build(invocationId) {
        console.log("invocationId: ",invocationId)
        this.$q.electron.ipcRenderer.send('buildTransaction', {invocationId});
      },
      sign(invocationId) {
        console.log("invocationId: ",invocationId)
        this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});

      },
      broadcast(invocationId) {
        this.isBroadcasting = true
        this.$q.electron.ipcRenderer.send('broadcastTransaction', {invocationId});
      },
      cancel(invocationId) {
        //mark invocation context rejected
        this.$q.electron.ipcRenderer.send('cancelTransaction', {invocationId});
        this.close()

      },
      close: function () {
        this.hideModal()
      },
      // openStartup: function () {
      //   this.hideModal()
      //   //open setup
      //   this.showModal('Startup')
      // }
    }
    }
</script>

<style scoped>

</style>
