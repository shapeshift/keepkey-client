<template>
  <q-page>
    <div class="page-header">
      <div><h4>KeepKey Client</h4></div>
    </div>
      <q-card>
        <div v-if="!context" class="centered">
          <div align="center">
            status: {{status}}
            <br/>
            code: {{code}}
            <br/>
            url: {{bridgeUrl}}
            <br/>
            <q-btn @click="startBridge" color="primary" label="Start Bridge" />
            <br/>
            <q-btn @click="stopBridge" color="red" label="Stop Bridge" />
          </div>

<!--          <h4>Loading...</h4>-->
<!--          <div class="compass">-->
<!--            <div class="needle">-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div v-if="context">
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
        </div>
      </q-card>
  </q-page>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import { copyToClipboard } from 'quasar'


  export default {
    name: 'Main',
    components: {
      // AnimatedNumber
    },
    data () {
      return {
        context:null,
        duration: 500,
        bridgeUrl:"",
        queryKey:"",
        coins:[],
        walletInfo: {},
        wallets:[],
        walletContext:{},
        apps:[],
        devMode:false,
        installing: [],
        status:"unknown",
        code:0,
        draggable: true,
        resizable: true,
        responsive: true,
        index: 0,
        show: false,
        copyText: 'Copy Address'
      }
    },
    mounted() {
      try{
        this.$nextTick(function () {
          this.show = true;
        })
        setTimeout(this.updateWalletContext,2000)

      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.keepKeyStatus": {
        handler: function(value) {
          //get value
          this.status = this.$store.getters['getKeepKeyStatus'];
          console.log("watch: this.status: ",this.status)
        },
        immediate: true
      },
      "$store.state.keepKeyState": {
        handler: function() {
          //get value
          this.code = this.$store.getters['getKeepKeyState'];
          console.log("watch: this.status: ",this.status)
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
      "$store.state.wallets": {
        handler: function(value) {
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
      startBridge() {
        console.log("Starting Bridge: ")
        this.showModal('HardwareConnect')
      },
      stopBridge() {
        console.log("Stop Bridge: ")
      },
      updateWalletContext() {

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
