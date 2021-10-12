<template>
  <q-page padding>
    <!-- content -->
    <div>
      <h6>Settings</h6>
      <q-card inline>
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

                <q-img src="~assets/box-logo.png"
                       spinner-color="red"
                       :ratio="1/1"
                       style="height: 30px; max-width: 70px">
                </q-img>

            </q-card-title>
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
        <q-btn @click="openDialog('Pin')">Pin</q-btn>
        <q-btn @click="openDialog('Setup')">Setup</q-btn>
      </q-card>

    </div>

  </q-page>
</template>

<script>
  const remote = require('electron').remote
  import {mapGetters, mapMutations} from "vuex";

  export default {
  name: 'Settings',
  data () {
    return {
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
  },
  methods: {
    ...mapMutations(['showModal','hideModal']),
    openEditConfig(){
      //open view seed
      this.showModal('Config')
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
