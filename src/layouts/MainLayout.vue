<template>
  <q-layout class="layout--main">
    <q-ajax-bar ref="bar" position="top" color="primary" size="3px" />
    <div
      class="homerow dark-panel has-border has-border-right menu text-center column no-wrap justify-between q-electron-drag"
    >
      <q-item clickable to="/main" class="justify-center user-header" style="padding-top: 30px">
        <q-avatar @click="openMain">
          <q-img src="~assets/box-logo.png"></q-img>
        </q-avatar>
      </q-item>
      <div>
        <q-item @click="openSettings" class="justify-center">
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
import AppModal from '../components/Dialog';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'MainLayout',

  components: {
    AppModal,
  },
  data() {
    return {
      duration: 500,
      totalValueUsd: 0,
      keepkeyConnected:false,
      confirm: false,
      darkMode: true,
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
    ])
  },
  mounted() {
    try {
      console.log("Main Layout Mounted!")
      //Open connect
      this.$q.electron.ipcRenderer.send('onStartApp', {});

      //handle ipc events


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
    openMain() {
      console.log("Naving to settings!")
      this.$router.go('Main');
    },
    openSettings() {
      console.log("Naving to settings!")
      this.$router.go('Settings');
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
