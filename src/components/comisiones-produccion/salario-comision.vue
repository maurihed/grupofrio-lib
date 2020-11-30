<template>
  <div>
    <div class="panel" v-if="!!cuberos.length || !!sacadores.length || !!maquinistas.length || !!jefesProduccion.length">
      <div v-if="!!cuberos.length">
        <div class="comision-row border-bottom-gray">
          <div class="name salario-title">Operador Rolito</div>
          <div class="day-value salario-title">Kilos</div>
          <div class="day-value salario-title">Pago por kilo</div>
          <div class="day-value salario-title">Comision</div>
          <div class="day-value salario-title">Puntos</div>
          <div class="day-value salario-title">Eficiencia</div>
          <div class="day-value salario-title">comision final</div>
          <div class="day-value salario-title">Sueldo base</div>
          <div class="day-value salario-title">Nomina</div>
        </div>
        <row-salario-comision
          v-for="cubero in cuberos"
          :key="cubero.UserId"
          :name="nombrePersonal(cubero)"
          :eficiencia="eficiencia"
          :kilos="totalKilosRolitos"
          :precioKilo="precioCubero"
          :sueldoBase="sueldoCubero"
          :puntos="puntosCubero"
          :eficiencia-produccion="eficienciaProduccion"
          :precioKiloVariable="precioKiloVariable.cubero"
        />
      </div>
      <div v-if="!!sacadores.length">
        <div class="comision-row border-bottom-gray">
          <div class="name salario-title">Operador Barra</div>
          <div class="day-value salario-title">Kilos</div>
          <div class="day-value salario-title">Pago por kilo</div>
          <div class="day-value salario-title">Comision</div>
          <div class="day-value salario-title">Puntos</div>
          <div class="day-value salario-title">Eficiencia</div>
          <div class="day-value salario-title">comision final</div>
          <div class="day-value salario-title">Sueldo base</div>
          <div class="day-value salario-title">Nomina</div>
        </div>
        <row-salario-comision
          v-for="sacador in sacadores"
          :key="sacador.UserId"
          :name="nombrePersonal(sacador)"
          :kilos="totalKilosBarras"
          :eficiencia="eficiencia"
          :precioKilo="precioSacador"
          :sueldoBase="sueldoSacador"
          :puntos="puntosSacador"
          :eficiencia-produccion="eficienciaProduccion"
          :precioKiloVariable="precioKiloVariable.sacador"
        />
      </div>
      <div v-if="!!maquinistas.length">
        <div class="comision-row border-bottom-gray">
          <div class="name salario-title">Operador Especialista</div>
          <div class="day-value salario-title">Kilos</div>
          <div class="day-value salario-title">Pago por kilo</div>
          <div class="day-value salario-title">Comision</div>
          <div class="day-value salario-title">Puntos</div>
          <div class="day-value salario-title">Eficiencia</div>
          <div class="day-value salario-title">comision final</div>
          <div class="day-value salario-title">Sueldo base</div>
          <div class="day-value salario-title">Nomina</div>
        </div>
        <row-salario-comision
          v-for="maquinista in maquinistas"
          :key="maquinista.UserId"
          :name="nombrePersonal(maquinista)"
          :kilos="totalKilosLider"
          :eficiencia="eficiencia"
          :precioKilo="precioMaquinista"
          :sueldoBase="sueldoMaquinista"
          :puntos="puntosMaquinista"
          :eficiencia-produccion="eficienciaProduccion"
          :precioKiloVariable="precioKiloVariable.maquinista"
        />
      </div>
      <div v-if="!!jefesProduccion.length">
        <div class="comision-row border-bottom-gray">
          <div class="name salario-title">Lider de celula de produccion</div>
          <div class="day-value salario-title">Kilos</div>
          <div class="day-value salario-title">Pago por kilo</div>
          <div class="day-value salario-title">Comision</div>
          <div class="day-value salario-title">Puntos</div>
          <div class="day-value salario-title">Eficiencia</div>
          <div class="day-value salario-title">comision final</div>
          <div class="day-value salario-title">Sueldo base</div>
          <div class="day-value salario-title">Nomina</div>
        </div>
        <row-salario-comision
          v-for="jefeProduccion in jefesProduccion"
          :key="jefeProduccion.UserId"
          :name="nombrePersonal(jefeProduccion)"
          :kilos="totalKilosLider"
          :eficiencia="eficiencia"
          :precioKilo="precioLider"
          :sueldoBase="sueldoLider"
          :puntos="puntosJefe"
          :eficiencia-produccion="eficienciaProduccion"
          :precioKiloVariable="precioKiloVariable.jefe"
        />
      </div>
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
  props: [
    'totalKilosBarras', 'totalKilosRolitos','precioCubero', 'precioSacador', 'precioMaquinista',
    'precioLider', 'eficiencia', 'sueldoCubero','sueldoSacador','sueldoMaquinista','sueldoLider',
    'sacadores', 'cuberos', 'maquinistas', 'jefesProduccion', 'puntos', 'eficienciaProduccion', 'precioKiloVariable'],
  data() { 
    return {};
  },
  components: {
    'row-salario-comision': rowSalarioComisionVue,
  },
  methods: {
    nombrePersonal(user) {
      return `${user.Nombre} ${user.ApellidoPaterno} ${user.ApellidoMaterno}`;
    },
    calculateNomina(kilos, precio, sueldoBase) {
      const comision = Number(kilos * precio);
      const comisionFinal = Number((this.eficiencia / 100) * comision);
      return sueldoBase + comisionFinal;
    },
    getPuntos(name) {
      const puntosArray = Object.values(this.puntos[name]);
      const sum = puntosArray.reduce((total, punto) => total+punto, 0);
      return Math.round((sum/puntosArray.length)*100)/100;
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
    puntosCubero() {
      return this.getPuntos('cubero');
    },
    puntosSacador() {
      return this.getPuntos('sacador');
    },
    puntosMaquinista() {
      return this.getPuntos('maquinista');
    },
    puntosJefe() { 
      return this.getPuntos('jefe');
    },
    totalKilosLider() {
      return Number(this.totalKilosBarras) + Number(this.totalKilosRolitos);
    },
    totalNominaCubero() {
      const nCuberos = this.cuberos.length;
      return this.calculateNomina(Number(this.totalKilosRolitos), this.precioCubero, this.sueldoCubero) * nCuberos;
    },
    totalNominaSacador() {
      const nSacadores = this.sacadores.length;
      return this.calculateNomina(Number(this.totalKilosBarras), this.precioSacador, this.sueldoSacador) * nSacadores;
    },
    totalNominaMaquinista() {
      const nMaquinistas = this.maquinistas.length;
      return this.calculateNomina(Number(this.totalKilosLider), this.precioMaquinista, this.sueldoMaquinista) * nMaquinistas;
    },
    totalNominaLidir() {
      const nJefesProduccion = this.jefesProduccion.length;
      return this.calculateNomina(Number(this.totalKilosLider), this.precioLider, this.sueldoLider,) * nJefesProduccion;
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
<style lang="scss" scoped>
  .panel {
    overflow: auto;
  }
  .comision-row {
    display: grid;
    grid-template-columns:
      [name] 20%
      repeat(8, 10%);
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
