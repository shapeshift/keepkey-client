<template>
  <div>
    <h3>Invocations</h3>
    <div class="q-pa-md scroll" style="height: 300px">
      <q-pull-to-refresh
        @refresh="refresh"
        color="orange-2"
        bg-color="black"
        icon="autorenew"
      >
        <div v-for="(invocation, index) in invocations" :key="index" class="q-mb-sm">
          <div @click="openInvocation(invocation)">
          <q-badge color="accent">
            {{ invocations.length - index }}
          </q-badge>
          {{invocation}}
          </div>
        </div>
      </q-pull-to-refresh>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
    const remote = require('electron').remote
    export default {
        name: "Approvals",
        data() {
          return {
            loading: false,
            error: false,
            items: [],
            invocations: [],
            walletContext:{},
          };
        },
        mounted() {
          try{

          }catch(e){
            console.error(e)
          }
        },
        computed: {
          ...mapGetters(['getInvocations'])
        },
        watch: {
          "$store.state.invocations": {
            handler: function (value) {
              console.log("value: ", value)
              //get value
              this.invocations = this.$store.getters['getInvocations'];
              console.log("invocations: ", this.invocations)
            },
            immediate: true
          },
        },
        methods: {
          ...mapMutations(['showModal','hideModal','setInvocationContext']),
          refresh (done) {
            setTimeout(() => {
              //this.items.push()
              done()
            }, 1000)
          },
          approve() {
            let invocationId = this.$route.params.id
            console.log("Invocation: ",this.$route.params.id)
            //tryLogin
            this.$q.electron.ipcRenderer.send('approveTransaction', {invocationId});

            remote.getCurrentWindow().close()
          },
          openInvocation(invocation) {
            console.log("invocationId: ",invocation)
            console.log("invocationId: ",invocation.invocationId)
            this.setInvocationContext(invocation.invocationId)
            //set current invocation in state
            this.showModal('Invocation')
          },
          updateWalletContext() {
            this.context = this.$store.getters['getContext'];
            console.log("this.context: ",this.context)

            //get value
            this.wallets = this.$store.getters['wallets'];
            if(this.wallets.length > 0){
              let currentWallet = this.wallets.filter(e => e.context === this.context)
              currentWallet = currentWallet[0]
              console.log("currentWallet: ",currentWallet)
              if(currentWallet && currentWallet.masters){
                this.walletContext = currentWallet
                console.log("masters:",currentWallet.masters)
                console.log("coins:",Object.keys(currentWallet.masters))
                let coins = Object.keys(currentWallet.masters)
                let coinList = []
                for(let i = 0; i < coins.length; i++){
                  let coin = coins[i]
                  coinList.push({
                    symbol:coin,
                    icon:"https://static.coincap.io/assets/icons/svg/"+coin.toLowerCase()+".svg",
                  })
                }
                this.coins = coinList
              }else{
                //invalid, force update to a valid wallet
                this.context = this.wallets[0].context
                this.$q.electron.ipcRenderer.send('updateContext', {
                  context:this.context,
                  reason:"current context not in wallet array!"
                });
              }
            }
          },
          // close: function () {
          //   this.hideModal()
          // },
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
