<template>
  <div>
    <div class="panel">
      <div class="comision-row border-bottom-gray">
        <div class="name salario-title">Operador Rolito</div>
        <div class="day-value salario-title">Kilos</div>
        <div class="day-value salario-title">Pago por kilo</div>
        <div class="day-value salario-title">Comision</div>
        <div class="day-value salario-title">Eficiencia</div>
        <div class="day-value salario-title">comision final</div>
        <div class="day-value salario-title">Sueldo base</div>
        <div class="day-value salario-title">Nomina</div>
      </div>
      <row-salario-comision
        name="Cubero 1"
        :eficiencia="eficiencia"
        :kilos="totalKilosRolitos"
        :precioKilo="precioCubero"
        :sueldoBase="sueldoCubero"
      />
      <row-salario-comision
        name="Cubero 2"
        :eficiencia="eficiencia"
        :kilos="totalKilosRolitos"
        :precioKilo="precioCubero"
        :sueldoBase="sueldoCubero"
      />
      <div class="comision-row border-bottom-gray">
        <div class="name salario-title">Operador Barra</div>
        <div class="day-value salario-title">Kilos</div>
        <div class="day-value salario-title">Pago por kilo</div>
        <div class="day-value salario-title">Comision</div>
        <div class="day-value salario-title">Eficiencia</div>
        <div class="day-value salario-title">comision final</div>
        <div class="day-value salario-title">Sueldo base</div>
        <div class="day-value salario-title">Nomina</div>
      </div>
      <row-salario-comision
        name="Sacador 1"
        :kilos="totalKilosBarras"
        :eficiencia="eficiencia"
        :precioKilo="precioSacador"
        :sueldoBase="sueldoSacador"
      />
      <div class="comision-row border-bottom-gray">
        <div class="name salario-title">Operador Especialista</div>
        <div class="day-value salario-title">Kilos</div>
        <div class="day-value salario-title">Pago por kilo</div>
        <div class="day-value salario-title">Comision</div>
        <div class="day-value salario-title">Eficiencia</div>
        <div class="day-value salario-title">comision final</div>
        <div class="day-value salario-title">Sueldo base</div>
        <div class="day-value salario-title">Nomina</div>
      </div>
      <row-salario-comision
        name="Maquinista"
        :kilos="totalKilosLider"
        :eficiencia="eficiencia"
        :precioKilo="precioMaquinista"
        :sueldoBase="sueldoMaquinista"
      />
      <div class="comision-row border-bottom-gray">
        <div class="name salario-title">Lider de celula de produccion</div>
        <div class="day-value salario-title">Kilos</div>
        <div class="day-value salario-title">Pago por kilo</div>
        <div class="day-value salario-title">Comision</div>
        <div class="day-value salario-title">Eficiencia</div>
        <div class="day-value salario-title">comision final</div>
        <div class="day-value salario-title">Sueldo base</div>
        <div class="day-value salario-title">Nomina</div>
      </div>
      <row-salario-comision
        name=""
        :kilos="totalKilosLider"
        :eficiencia="eficiencia"
        :precioKilo="precioLider"
        :sueldoBase="sueldoLider"
      />
    </div>
    <div class="row">
      <div class="col s12 m8 l6 offset-m4 offset-l6">
        <div class="panel">
          <table style="font-size:15px;">
            <tbody class="blue-text">
              <tr>
                <td class="black-text text-bold">Nomina Operadores Rolito</td>
                <td class="gray-text">{{totalNominaCubero | money}}</td>
              </tr>
              <tr>
                <td class="black-text text-bold">Nomina Operadores Barra</td>
                <td class="gray-text">{{totalNominaSacador | money}}</td>
              </tr>
              <tr>
                <td class="black-text text-bold">Nomina Operador Especializado</td>
                <td class="gray-text">{{totalNominaMaquinista | money}}</td>
              </tr>
              <tr>
                <td class="black-text text-bold">Nomina Lider de celula</td>
                <td class="gray-text">{{totalNominaLidir | money}}</td>
              </tr>
              <tr>
                <td class="black-text text-bold" style="font-size:24px;">TOTAL:</td>
                <td style="font-size:24px;">{{total | money}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import rowSalarioComisionVue from './row-salario-comision.vue';
export default {
  props: ['totalKilosBarras', 'totalKilosRolitos','precioCubero', 'precioSacador', 'precioMaquinista', 'precioLider', 'eficiencia', 'sueldoCubero','sueldoSacador','sueldoMaquinista','sueldoLider'],
  data() { 
    return {};
  },
  components: {
    'row-salario-comision': rowSalarioComisionVue,
  },
  methods: {
    calculateNomina(kilos, precio, sueldoBase) {
      const comision = Number(kilos * precio);
      const comisionFinal = Number((this.eficiencia / 100) * comision);
      return sueldoBase + comisionFinal;
    },
  },
  filters: {
    money(value) {
      if (!value) return 0;
      const formatter = new Intl.NumberFormat('en-MX', {
        style: 'currency',
        currency: 'MXN',
      });
      const money = formatter.format(value);

      return money.substr(2);
    }
  },
  computed: {
    totalKilosLider() {
      if(!this.totalKilosBarras || !this.totalKilosRolitos) {
        return 0;
      }
      return Number(this.totalKilosBarras) + Number(this.totalKilosRolitos);
    },
    totalNominaCubero() {
      return this.calculateNomina(Number(this.totalKilosRolitos), this.precioCubero, this.sueldoCubero) * 2;
    },
    totalNominaSacador() {
      return this.calculateNomina(Number(this.totalKilosBarras), this.precioSacador, this.sueldoSacador);
    },
    totalNominaMaquinista() {
      return this.calculateNomina(Number(this.totalKilosLider), this.precioMaquinista, this.sueldoMaquinista);
    },
    totalNominaLidir() {
      return this.calculateNomina(Number(this.totalKilosLider), this.precioLider, this.sueldoLider,);
    },
    total() {
      return this.totalNominaCubero
             + this.totalNominaSacador
             + this.totalNominaMaquinista
             + this.totalNominaLidir;
    }
  }
}
</script>
<style lang="scss">
  .comision-row {
    display: grid;
    grid-template-columns:
      [name] 20%
      repeat(8, 11.4285714286%);
    font-size: 15px;
    padding: 5px 0;
  }  
  .day-value {
    text-align: center;
  }
  .wrong-item {
    background: #FFaaaa;
    color: #FF4040;
  }
  .success-item {
    background: #cddecd;
    color: #409940;
  }
  .salario-title {
    font-weight: bold;
  }
  .border-bottom-gray {
    border-bottom: 2px solid #A2A2A2;
  }
</style>
