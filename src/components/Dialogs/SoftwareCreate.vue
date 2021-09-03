<template>
  <q-card class="text-center q-pb-lg q-pl-lg q-pr-lg" style="min-width:450px;">
    <q-card-section>
      <h4>Warning!</h4>
      <p>It is NOT best practice to store ANY amounts of crypto outside a hardware wallet! </p>
      <div>
        <div v-bind:href="url">
          <small>You may purchase one here:
          HERE
        </small>
        </div>

      </div>
      <br/>
      <div>
        <p class="font-italic">
          Continue with software wallet for Development purposes only...
        </p>
      </div>
    </q-card-section>
    <q-card-actions vertical align="center" class="q-pb-lg q-pl-md q-pr-md">
      <!-- <q-btn color="primary" label="Configure Hardware Wallet" class="q-mt-md">
      <q-tooltip content-class="bg-accent">Keepkey, Ledger and Trezor wallets supported</q-tooltip>
      </q-btn> -->
      <q-btn
        color="warning"
        align="left"
        @click="openRestore"
        label="Restore from supported software wallets"
        icon="account_balance_wallet"
        flat
      />
      <q-btn
        v-if="showSoftwareCreate"
        color="green"
        flat
        @click="openCreate()"
        label="Create New Wallet"
        align="left"
        icon="add"
        class="full-width"
      />
      <q-btn
        @click="goBack()"
        label="Go Back"
        align="left"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
    let featureSoftwareCreate = process.env['CREATE_SOFTWARE_FEATURE']
    import {mapMutations} from "vuex";
    export default {
        name: "SoftwareCreate",
        data() {
          return {
            url:"https://www.amazon.com/KeepKey-Simple-Cryptocurrency-Hardware-Wallet/dp/B0143M2A5S",
            showSoftwareCreate: featureSoftwareCreate,
            showKeepkey: true,
          };
        },
        methods: {
          ...mapMutations(['showModal','hideModal']),
          openCreate: function () {
            this.$q.electron.ipcRenderer.send('createWallet', {});
          },
          openRestore: function () {
            this.hideModal()
            this.showModal('RecoveryWizzard')
          },
          openConnect: function () {
            this.hideModal()
            this.showModal('HardwareConnect')
          },
          goBack: function () {
            this.hideModal()
            this.showModal('Setup')
          }
        }
    }
</script>

<style scoped>

</style>
