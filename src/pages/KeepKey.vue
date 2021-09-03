<template>
  <q-page>
    <div class="page-header">
      <div><h4>KeepKey</h4></div>
<!--      devices: {{devices}}-->
<!--    </div>-->
<!--    <div v-for="device in devices" :key="device.deviceId">-->
<!--      <q-card style="max-width: 370px">-->
<!--        <q-card-title :name="device.deviceId">-->
<!--          <div>-->
<!--          </div>-->
<!--          <br/>-->

<!--        </q-card-title>-->
<!--        <q-card-main :name="device.deviceId">-->
<!--          DeviceId: {{device.deviceId}}-->
<!--&lt;!&ndash;          Bootloader:&ndash;&gt;-->
<!--          <br/>-->
<!--          Current: Firmware:{{device.majorVersion}}.{{device.minorVersion}}.{{device.patchVersion}}-->
<!--          <br/>-->
<!--          Available:-->
<!--&lt;!&ndash;          <q-btn&ndash;&gt;-->
<!--&lt;!&ndash;            color="green"&ndash;&gt;-->
<!--&lt;!&ndash;            @click="UpdateFirmware"&ndash;&gt;-->
<!--&lt;!&ndash;            label="update firmware"&ndash;&gt;-->
<!--&lt;!&ndash;            size="small"&ndash;&gt;-->
<!--&lt;!&ndash;            class="font-weight-medium q-pl-md q-pr-md"&ndash;&gt;-->
<!--&lt;!&ndash;            style="font-size:1rem;"&ndash;&gt;-->
<!--&lt;!&ndash;          ></q-btn>&ndash;&gt;-->
<!--          <br/>-->
<!--          <q-btn-->
<!--            color="green"-->
<!--            @click="showPolicys = !showPolicys"-->
<!--            label="show policies"-->
<!--            size="small"-->
<!--            class="font-weight-medium q-pl-md q-pr-md"-->
<!--            style="font-size:1rem;"-->
<!--          ></q-btn>-->
<!--          <div v-if="showPolicys">-->
<!--            <q-table-->
<!--              title="Device Polcies"-->
<!--              :data="data"-->
<!--              :columns="columns"-->
<!--              row-key="name"-->
<!--            >-->

<!--              <template v-slot:header="props">-->
<!--                <q-tr :props="props">-->
<!--                  <q-th auto-width />-->
<!--                  <q-th-->
<!--                    v-for="col in props.cols"-->
<!--                    :key="col.name"-->
<!--                    :props="props"-->
<!--                  >-->
<!--                    {{ col.label }}-->
<!--                  </q-th>-->
<!--                </q-tr>-->
<!--              </template>-->

<!--              <template v-slot:body="props">-->
<!--                <q-tr :props="props">-->
<!--                  <q-td auto-width>-->
<!--                    <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />-->
<!--                  </q-td>-->
<!--                  <q-td-->
<!--                    v-for="col in props.cols"-->
<!--                    :key="col.name"-->
<!--                    :props="props"-->
<!--                  >-->
<!--                    {{ col.value }}-->
<!--                  </q-td>-->
<!--                </q-tr>-->
<!--                <q-tr v-show="props.expand" :props="props">-->
<!--                  <q-td colspan="100%">-->
<!--                    <div class="text-left">-->
<!--                      <q-btn-->
<!--                        @click="enablePolicy()"-->
<!--                        label="enable policy"-->
<!--                        size="small"-->
<!--                        class="font-weight-medium q-pl-md q-pr-md"-->
<!--                        style="font-size:1rem;"-->
<!--                      ></q-btn>-->
<!--                    </div>-->
<!--                  </q-td>-->
<!--                </q-tr>-->
<!--              </template>-->

<!--            </q-table>-->

<!--          </div>-->


<!--        </q-card-main>-->


<!--      </q-card>-->

    </div>
  </q-page>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'Keepkey',
    data () {
      return {
        queryKey:"",
        devices:[],
        installing: [],
        showPolicys: false,
        columns: [
          {
            name: 'policyName',
            align: 'center',
            label: 'policyName',
            field: 'policyName',
            sortable: false
          },
          {
            name: 'enabled',
            align: 'center',
            label: 'enabled',
            field: 'enabled',
            sortable: false
          },
        ],
        data: [
          { policyName: 'ShapeShift', enabled: true },
          { policyName: 'Pin Caching', enabled: true },
          { policyName: 'Experimental', enabled: false },
          { policyName: 'AdvancedMode', enabled: false }
        ]
      }
    },
    mounted() {
      try{
      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.devices": {
        handler: function(value) {
          console.log("value: ",value)
          //get value
          this.devices = this.$store.getters['getDevices'];
          console.log("devices: ",this.devices)

        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['getDevices']),
    },
    methods: {
      ...mapMutations(['addApp', 'removeApp']),
      // UpdateFirmware() {
      //   console.log("updateFirmware")
      //   //this.$q.electron.ipcRenderer.send('updateFirmware', {password});
      // },
      // wipeDevice() {
      //   console.log("wipeDevice")
      //   //this.$q.electron.ipcRenderer.send('wipeDevice', {password});
      // },
      // enablePolicy() {
      //   console.log("enablePolicy")
      //   //this.$q.electron.ipcRenderer.send('enablePolicy', {password});
      // },
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
</style>
