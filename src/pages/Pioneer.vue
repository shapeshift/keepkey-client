<template>
  <q-page>
    <div class="page-header">
      <div><h4>KeepKey Client</h4></div>
    </div>
      <q-card>
        <div v-if="!context" class="centered">
          <h4>Loading...</h4>
          <div class="compass">
            <div class="needle">
            </div>
          </div>
        </div>
        <div v-if="context">
          <div class="">
            Apps: {{apps}}
          </div>
          <div>
            <q-btn
              @click="openPair"
              color="primary"
              label="Pair"
            ></q-btn>
          </div>

          <div>
            <q-btn-dropdown
              color="green"
              push
              glossy
              no-caps
              icon="explore"
              :label="context.slice(0,10)"
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
          </div>

          <div class="q-pa-md" style="max-width: 550px">
<!--            {{coins}}-->
            <div v-for="coin in coins" :key="coin.symbol">
<!--                          {{coin}}-->
<!--                          {{coin.symbol}}-->
<!--                          {{coin.icon}}-->
              <q-expansion-item style="width:550px;">
                <template v-slot:header style="width:550px;">

                  <q-item-section avatar>
                    <q-img :src="coin.icon"></q-img>
                  </q-item-section>

                  <q-item-section>
                    {{coin.symbol}}
                  </q-item-section>

                  <q-item-section side>
                    <div>
                      ({{coin.symbol}}) {{walletContext.balances[coin.symbol]}}
                    </div>
<!--                    <animated-number :value="walletContext.valueUsds[coin.symbol]" :formatValue="formatToPriceUSD" :duration="duration"/>-->
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section style="word-wrap: break-word;">
                    <small>script type: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].script_type}}</small>
                      <q-separator />
                      Address: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].master}} <br/>
                      {{copyText}}
                      <q-icon @click=copyAddress(coin.symbol) name="content_copy"></q-icon>
                      <q-separator />
<!--                  path: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0]}}-->
                      <q-separator />
                      <small>xpub: {{walletContext.pubkeys.filter(e => e.symbol === coin.symbol)[0].pubkey}}</small>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-separator />

            </div>
          </div>

        </div>
      </q-card>
  </q-page>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import accountSelector from '../components/AccountSelector'
  import { mapMutations, mapGetters } from 'vuex'
  import VueGridLayout from 'vue-grid-layout';
  import { copyToClipboard } from 'quasar'
  import AnimatedNumber from "animated-number-vue";
  import AppSwitcher from "components/AppSwitcher";
  import AppModal from "components/Dialog";


  export default {
    name: 'Pioneer',
    components: {
      // AnimatedNumber
    },
    data () {
      return {
        context:null,
        duration: 500,
        queryKey:"",
        coins:[],
        walletInfo: {},
        wallets:[],
        walletContext:{},
        apps:[],
        devMode:false,
        installing: [],
        status:"online",
        draggable: true,
        resizable: true,
        responsive: true,
        index: 0,
        show: false,
        from: {address:'testingaddy'} || null,
        copyText: 'Copy Address'
      }
    },
    mounted() {
      try{
        this.$nextTick(function () {
          this.show = true;
        })
        setTimeout(this.updateWalletContext,2000)

        //TODO why the f do I need this, and watchers not working?
        ipcRenderer.on('refreshPioneer', (event, data) => {
          console.log("Refresh Pioneer! **** pioneer.vue")
          //
          this.updateWalletContext()
        })

        ipcRenderer.on('setContext', (event, data) => {
          console.log("setContext: ",data.context)
          this.context = data.context

          //update wallet context
          this.updateWalletContext()

        })

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
      "$store.state.wallets": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.updateWalletContext()
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['getApps','layout','getWalletInfo','getContext','getInvocations']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp','showModal','hideModal']),
      onMainClick() {
        console.log("Main Click")
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
      openPair(item) {
        console.log("item Click: ",item)
        this.showModal('Pair')
      },
      onItemClick(context) {
        console.log("set context: ",context)
        if(context !== this.context){
          this.context = context
          this.$q.electron.ipcRenderer.send('setContext', {context});
        }
      },
      formatToPriceUSD(value) {
        return `$ ${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      },
      copyAddress (value) {
        copyToClipboard(value)
          .then(() => {
            this.copyText = 'Coppied!'
            setTimeout(() => {
              this.copyText = 'Copy Address'
            }, 2000)
          })
          .catch(() => {
            // fail
          })
      }
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
  body {background: #333;}

  .compass {
    border: 2px solid #888;
    display: block;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    margin: 10% auto 0 auto;
  }

  .needle {
    width: 6px;
    margin: 12px auto 0 auto;
    animation-name: waggle;
    animation-duration: 2500ms;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .needle:after {
    content: '';
    display: block;
    border-color: orangered transparent;
    border-style: solid;
    border-width: 0px 3px 10px 3px;
    margin-top: -15px;
  }

  .needle:before {
    content: '';
    display: block;
    border-color: #888 transparent;
    border-style: solid;
    border-width: 10px 3px 0px 3px;
    margin-bottom: -20px;
  }

  @keyframes waggle {
    0%   {transform:rotate(0deg);}
    10%  {transform:rotate(12deg);}
    40%  {transform:rotate(-25deg);}
    60%  {transform:rotate(20deg);}
    80%  {transform:rotate(-15deg);}
    100% {transform:rotate(0deg);}
  }

</style>
