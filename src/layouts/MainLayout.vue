<template>
  <q-layout class="layout--main">
    <q-ajax-bar ref="bar" position="top" color="primary" size="3px" />
    <div
      class="homerow dark-panel has-border has-border-right menu text-center column no-wrap justify-between q-electron-drag"
    >
      <q-item clickable to="/pioneer" class="justify-center user-header" style="padding-top: 30px">
        <q-avatar @click="refreshPioneer">
          <q-img src="~assets/box-logo.png"></q-img>
        </q-avatar>
      </q-item>
      <small><animated-number :value="totalValueUsd" :formatValue="formatToPriceUSD" :duration="duration"/></small>

      <div v-if="featureApps || true">
        <AppSwitcher />
      </div>

      <q-item clickable to="/invocations" class="justify-center user-header" style="">
        <q-icon size=md name="published_with_changes"></q-icon>
      </q-item>

      <div v-if="featureContacts">
        <q-item clickable to="/contacts" class="justify-center user-header" style="">
          <q-icon size=md name="admin_panel_settings"></q-icon>
        </q-item>
      </div>

      <div>
        <q-item clickable to="/settings">
          <q-avatar class="justify-center user-header" color="primary" style="">
            <q-icon size=md name="settings"></q-icon>
          </q-avatar>
        </q-item>
      </div>
    </div>

    <q-page-container>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
    <app-modal></app-modal>
  </q-layout>
</template>

<script>
import AnimatedNumber from "animated-number-vue";
import AppSwitcher from 'components/AppSwitcher';
import AppModal from '../components/Dialog';
import { mapMutations, mapGetters } from 'vuex';

//feature flags
let featureApps = process.env['APPS_FEATURE']
let featureKeepkey = process.env['KEEPKEY_FEATURE']
let featureUiTheme = process.env['UI_THEME_FEATURE']
let featureUiLightMode = process.env['UI_LIGHT_MODE_FEATURE']
let featureAddWallet = process.env['ADD_WALLET_FEATURE']
let featureContacts = process.env['CONTACTS_FEATURE']
let featureFio = process.env['FIO_FEATURE']

export default {
  name: 'MainLayout',

  components: {
    AppSwitcher,
    AppModal,
    AnimatedNumber
  },
  data() {
    return {
      featureApps,
      featureKeepkey,
      featureUiTheme,
      featureUiLightMode,
      featureAddWallet,
      featureContacts,
      featureFio,
      duration: 500,
      totalValueUsd: 0,
      keepkeyConnected:false,
      confirm: false,
      darkMode: true,
      password: '',
      opened: false,
      isLoggedIn: false,
      leftDrawerOpen: true,
      theme: 'theme--default',
      themes: [
        {
          label: 'Default',
          value: 'theme--default'
        }, {
          label: 'Tiger King',
          value: 'theme--tiger'
        }, {
          label: 'Rainbow',
          value: 'theme--rainbow'
        }
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUsername',
      'getTotal',
      'wallets',
      'devices',
      'getPioneerLive',
      'getPioneerUrl',
      'getMnemonic',
      'getBalances',
    ])
  },
  mounted() {
    try {
      console.log("Main Layout Mounted!")
      //Open connect

      //support partial setup exit
      this.$q.electron.ipcRenderer.send('continueSetup', {})


    } catch (e) {
      console.error(e);
    }
    if(this.$q.platform.is.platform !== 'mac') {
      this.toggleBodyClass('addClass', 'platform--other')
    } else {
      this.toggleBodyClass('addClass', 'platform--mac')
    }
    this.toggleBodyClass('addClass', this.theme)
  },
  methods: {
    ...mapMutations(['showModal', 'hideModal']),
    openPin() {
      this.showModal('Pin')
    },
    onAddWallet() {
      this.showModal('Setup')
    },
    //refreshPioneer
    async refreshPioneer() {
      console.log("refresh everything!")
      //refresh
      this.$q.electron.ipcRenderer.send('refreshPioneer', {});

      //get all the things
      let context = await this.$store.getters['getContext']
      let username = await this.$store.getters['getUsername']
      let total = await this.$store.getters['getTotal']
      let walletsLoaded = await this.$store.getters['wallets']
      let devicesLoaded = await this.$store.getters['devices']
      let isPioneerLive = await this.$store.getters['getPioneerLive']
      let pioneerUrl = await this.$store.getters['getPioneerUrl']
      let seed = await this.$store.getters['getMnemonic']
      let balances = await this.$store.getters['getBalances']

      this.totalValueUsd = total
      console.log("STATE: ",{context,username,total,walletsLoaded,devicesLoaded,isPioneerLive,pioneerUrl,seed,balances})

    },
    openSettings() {
      console.log("Naving to settings!")
      this.$router.go('Settings');
    },
    formatToPriceUSD(value) {
      return `$ ${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body
      if(addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
    minimize() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },
    maximize() {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },
    openSetupKeeypkey() {
      //this.showModal("SetupKeepkey")
    },
    closeApp() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  },
  watch: {
    "$store.state.pioneerUrl": {
      handler: function(value) {
        this.pioneerUrl = value
      },
      immediate: true
    },
    "$store.state.pioneerLive": {
      handler: function(value) {
        this.pioneerLive = value
      },
      immediate: true
    },
    "$store.state.totalUsd": {
      handler: function() {
        //get value
        const totalUsd = this.$store.getters['getTotal'];
        this.totalValueUsd = totalUsd
        console.log("totalUsd: ",totalUsd)
      },
      immediate: true // provides initial (not changed yet) state
    },
    "$store.state.keepkeyConnected": {
      handler: function(value) {
        this.keepkeyConnected = true
      },
      immediate: true // provides initial (not changed yet) state
    },
    darkMode(val) {
      if (!val) {
        this.confirm = true;
      }
      this.$q.dark.set(val);
      console.log(this.$q.dark.isActive);
    },
    theme: function (newTheme, oldTheme) {
      console.log('theme', newTheme + ' ' + oldTheme)
      this.toggleBodyClass('removeClass', oldTheme)
      this.toggleBodyClass('addClass', newTheme)
    }
  }
};
</script>
<style lang="scss" scoped>
.homerow {
  height: 100vh;
}
.app-control {
  color: var(--border-color);
  &:hover {
    &.app-close {
      color: $negative;
    }
    &.app-minimize {
      color: $warning;
    }
    &.app-expand {
      color: $positive;
    }
  }
}
</style>
