<template>
  <div id="modalVendedor" class="modal">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-content">
        {{vendedor}}
        Importe Vendido: {{importeVendido}} <br>
        Kilos vendido: {{kilosVendidos.real}} {{getPorcentaje(kilosVendidos.real, kilosVendidos.meta)}} %<br>
        Productividad: {{productividad}}<br>
        Cptura App: {{capturaApp}}<br>
        <br><br><br>
        rendimiento: {{rendimiento}}<br>
        kgRecorridos: {{kgRecorridos}}<br>
        combustible: {{combustible}}<br>
        <br><br> <br>
        recuperados: {{recuperados}} - ${{recuperados * 100}}<br>
        competencia: {{competencia}} - ${{competencia * 100}}<br>
        <br><br><br>
        Nomina base: {{sueldo_base}}<br>
        comision: {{comision_total}}<br>
        comision clientes {{comision_cliente}} <br> <br>
        <br><br><br>
        Total: {{total}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal-vendedor',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    vendedor: Object,
    onClose: Function,
    kilosVendidos: Object,
    productividad: String,
    capturaApp: String,
    suc: String,
  },
  data: ()=>({
    isLoaded: false,
    kgRecorridos: 0,
    rendimiento: 0,
    combustible: 0,
    importeVendido: 0,
    sueldo_base: 0,
    comision: 0,
    recuperados: 0,
    competencia: 0,
  }),
  methods: {
    onModalClose() {
      this.isLoaded = false;
      this.onClose();
    },
    async onModalOpen() {
      if(this.vendedor) {
        await Promise.allSettled([
          await this.fetchKmInfo(),
          await this.fetchVenta(),
          await this.fetchVariablesVendedor(),
          await this.fetchClientesRecuperados(),
        ]);
        this.isLoaded = true;
      } else {
        this.onClose();
      }
    },
    async fetchKmInfo() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=kmInfo`, {
        fecha: this.fecha, vendedor: this.vendedor.clave, camioneta: this.vendedor.camioneta,
      });
      const {kilometraje, combustible, rendimiento} = response.data;
      this.kgRecorridos = kilometraje || 0;
      this.rendimiento = rendimiento || 0;
      this.combustible = combustible || 0;
    },
    async fetchVenta() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getVentaSemanalVendedor`, {
        fecha: this.fecha, vendedor: this.vendedor.clave, suc: this.suc,
      });
      const {real} = response.data;
      this.importeVendido = real || 0;
    },
    async fetchVariablesVendedor() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getVariablesVendedor`, { vendedor: this.vendedor.clave });
      const {sueldo_base, comision} = response.data;
      this.sueldo_base = Math.round(sueldo_base*100)/100;
      this.comision = Math.round(comision*100)/100;
    },
    async fetchClientesRecuperados() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getClientesRecuperados`, { vendedor: this.vendedor.clave, fecha: this.fecha });
      const {recuperados, competencia} = response.data;
      this.recuperados = recuperados;
      this.competencia = competencia;
    },
    getPorcentaje(real, meta) {
      return meta > 0 ? Math.floor((real/meta)*100) : 0;
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalVendedor'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalVendedor')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalVendedor')).close()
      }
    },
  },
  computed: {
    comision_total() {
      const kilos = this.getPorcentaje(this.kilosVendidos.real, this.kilosVendidos.meta);
      const productividad = this.productividad.slice(0,-2);
      const capturaApp = this.capturaApp.slice(0,-2);
      if(kilos >= 89 && productividad >= 89 && capturaApp >= 89) {
        return this.kilosVendidos.real * .1;
      }
      return 0;
    },
    comision_cliente() {
      return this.recuperados*100 + this.competencia*50;
    },
    total() {
      return this.sueldo_base+this.comision_total+this.comision_cliente;
    }
  },
}
</script>

<style>

</style>