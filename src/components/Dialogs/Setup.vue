<template>
    <q-card class="text-center q-pb-lg q-pl-lg q-pr-lg" style="min-width:450px;">
        <q-card-section>
        <h4>Setup</h4>
        </q-card-section>
        <q-card-actions vertical align="center" class="q-pb-lg q-pl-md q-pr-md">
          <q-btn
            color="blue"
            @click="openConnect"
            class="full-width"
            icon="settings_ethernet"
            align="left"
            size="lg"
            label="Connect Hardware Wallet"
            flat
          />
        </q-card-actions>
    </q-card>
</template>
<script>

import { mapMutations } from 'vuex'

let featureSoftwareCreate = process.env['CREATE_SOFTWARE_FEATURE']
let featureKeepkey = process.env['KEEPKEY_FEATURE']

export default {
    data() {
      return {
        showSoftwareCreate: featureSoftwareCreate,
        showKeepkey: featureKeepkey,
      };
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      openCreate: function () {
        this.$q.electron.ipcRenderer.send('createWallet', {});
      },
      openSoftwareCreate: function () {
        this.hideModal()
        this.showModal('SoftwareCreate')
      },
      openRestore: function () {
        this.hideModal()
        this.showModal('Restore')
      },
      openConnect: function () {
        this.hideModal()
        this.showModal('HardwareConnect')
      }
    }
}
</script>
