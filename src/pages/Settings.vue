<template>
  <q-page padding>
    <!-- content -->
    <div>
      <h6>Settings</h6>
      <q-card inline>
        <q-card-section>
          <div class="text-h6">PioneerUrl: {{pioneerUrl}}</div>
          <div class="text-h6">username: {{username}}</div>
          <div class="text-subtitle2">queryKey: {{queryKey}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="openEditConfig">edit config <q-icon name="settings"></q-icon></q-btn>
          <q-btn @click="deleteConfig" color="red">delete config <q-icon name="warning"></q-icon></q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div>
      <h6>Wallets</h6>
      <div id="wallets">
        <div v-for="wallet in wallets" :key="wallet.type">
          <q-card>
            <q-card-title>
              <div v-if="wallet.type === 'keepkey'">
                <q-img src="~assets/box-logo.png"
                       spinner-color="red"
                       :ratio="1/1"
                       style="height: 30px; max-width: 70px">
                </q-img>
              </div>
              <div v-if="wallet.type === 'software'">
                <q-icon size=xl name="account_balance_wallet" />
              </div>
              <br/>
              type: {{ wallet.type }}
              <br/>
              name: {{ wallet.name }}
              <br/>
              value: {{ formatToPriceUSD(wallet.totalValueUsd) }}
              <br/>
              <!--            Master ETH: {{ wallet.public.ETH.master }}-->
              <!--            assets: {{ wallet.assets }}-->
              <!--            assets: {{ wallet.features.deviceId }}-->
              <!--            id: {{ wallet.features.id }}-->
              <!--            <q-rating slot="subtitle" v-model="stars" :max="5" />-->
              <div slot="right" class="row items-center">
                <!--              <q-icon name="place" /> 250 ft-->
              </div>
            </q-card-title>
            <q-card-main>
              <!--            label: {{ wallet.features }}-->
              <!--            majorVersion: {{ wallet.features.majorVersion }}-->
              <!--            label: {{ wallet.features.majorVersion }}-->
            </q-card-main>
            <q-card-separator />
            <q-card-actions>
              <q-btn flat round small><q-icon name="settings" /></q-btn>
              <q-menu fit :offset="[-16, -3]">
                <q-list style="min-width: 100px">
                  <q-list>
                    <q-item-label header>Wallet Options</q-item-label>
                    <q-item @click="updateFirmware(wallet.name)" tag="label" v-ripple>
                      update firmware
                    </q-item>
                    <q-item @click="wipeDevice(wallet.name)" tag="label" v-ripple>
                      Wipe
                    </q-item>
                    <!--                  <q-item @click="openViewSeed(wallet.name)" tag="label" v-ripple>-->
                    <!--                    View Seed-->
                    <!--                  </q-item>-->
                    <q-item tag="label" v-ripple>
                    </q-item>
                  </q-list>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-card-actions>
          </q-card>


        </div>
      </div>
    </div>

    <div>
      <h6>Open Dialog</h6>
      <q-card inline>
        <q-btn @click="openDialog('Pair')">Pair</q-btn>
        <q-btn @click="openDialog('Pin')">Pin</q-btn>
        <q-btn @click="openDialog('Setup')">Setup</q-btn>
      </q-card>

    </div>

  </q-page>
</template>

<script>
  // import {
  //   deleteConfig,
  // } from '@pioneer-platform/pioneer-config'
  const remote = require('electron').remote
  import {mapGetters, mapMutations} from "vuex";

  export default {
  name: 'Settings',
  data () {
    return {
      wallets:[],
      pioneerLive:false,
      isLoggedIn:false,
      pioneerUrl:'',
      username:'',
      queryKey:'',
      userEmail:'',
      userId:'',
      twoFactorEnabled:false,
      verificationStatus:''
    }
  },
  mounted() {
    try{

    }catch(e){
      console.error(e)
    }
  },
  computed: {
    ...mapGetters(['getAllUsbDevices','getAllKeepKeys','getKeepKeyState','getKeepKeyStatus']),
    splitPhrase: function() {
      if(this.mnemonic && this.mnemonic.length > 0) {
        const parts = this.mnemonic.split(' ')
        return parts
      } else {
        return []
      }
    }
  },
  watch: {
    "$store.state.pioneerUrl": {
      handler: function() {
        this.pioneerUrl = this.$store.getters['getPioneerUrl'];
        console.log("Settings: pioneerUrl: ",this.pioneerUrl)
      },
      immediate: true
    },
    "$store.state.pioneerLive": {
      handler: function() {
        this.pioneerLive = this.$store.getters['getPioneerLive'];
        console.log("Settings: pioneerLive: ",this.pioneerLive)
      },
      immediate: true
    },
    "$store.state.username": {
      handler: function (value) {
        console.log("username loaded!")
        this.username = this.$store.getters['getUsername'];
      },
      immediate: true // provides initial (not changed yet) state
    },
    "$store.state.queryKey": {
      handler: function (value) {
        console.log("username loaded!")
        console.log("value: ",value)
      },
      immediate: true // provides initial (not changed yet) state
    },
    "$store.state.wallets": {
      handler: function (value) {
        this.wallets = this.$store.getters['getWallets'];
      },
      immediate: true // provides initial (not changed yet) state
    }
  },
  methods: {
    ...mapMutations(['showModal','hideModal']),
    openEditConfig(){
      //open view seed
      this.showModal('Config')
    },
    formatToPriceUSD(value) {
      return `$ ${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    openViewSeed(wallet){
      //open view seed
      this.$q.electron.ipcRenderer.send('viewSeed', {wallet});
    },
    updateFirmware(wallet){
      //open view seed
      this.showModal('UpdateFirmware')
    },
    openDialog(dialog){
      //open view seed
      this.showModal(dialog)
    },
    wipeDevice(wallet){
      //open view seed
      this.showModal('Wipe')
    },
    deleteConfig(){
      deleteConfig()
      //delete config file
      let w = remote.getCurrentWindow()
      w.close()
      //exit app
      this.w.relaunch()
    },
  }
}
</script>
<style lang="scss" scoped>
  .seed-rows {
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 0.5rem;
    row-gap: 1rem;
  }
  .word-phrase {
    display:flex;
    flex-direction: column;
    align-items: center;
    position:relative;
    top:0;
    transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    .number {
      border-top:1px solid var(--border-color);
      width:100%;
      padding-top:0.25rem;
      margin-top:0.375rem;
      color:var(--text-color-2);
    }
    .value {
      opacity:0;
      transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    &:hover {
      top:1rem;
      cursor: pointer;
      .value {
        opacity:1;
      }
      .number {
        border-color: $primary;
      }
    }
  }
</style>
