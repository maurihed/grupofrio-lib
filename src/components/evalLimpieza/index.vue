<template>
  <div>
      <ul v-for="tipo in tipos" class="collapsible" data-collapsible="accordion" :key="tipo.id">
        <li>
          <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>{{tipo}}</div>
            <div class="collapsible-body">
              <table class="bordered">
                <thead>
                  <tr>
                      <td class="center">Aspecto</td>
                      <td class="center">{{'Lunes ('+startDay+')'}}</td>
                      <td class="center">{{'Martes ('+(plusDay(startDay, 1))+')'}}</td>
                      <td class="center">{{'Miercoles ('+plusDay(startDay, 2)+')'}}</td>
                      <td class="center">{{'Jueves ('+plusDay(startDay, 3)+')'}}</td>
                      <td class="center">{{'Viernes ('+plusDay(startDay, 4)+')'}}</td>
                      <td class="center">{{'Sabado ('+plusDay(startDay, 5)+')'}}</td>
                      <td class="center">{{'Domingo ('+plusDay(startDay, 6)+')'}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(evaluaciones, aspecto) in aspectos[tipo]" :key="aspecto">
                    <td>{{aspecto}}</td>
                    <td v-for="n of 7" class="center" :key="n">
                      <day-check
                          :empleado="empleado"
                          :maquina="parseInt(maquina)"
                          :aspectoId="parseInt(evaluaciones.id)"
                          :evaluaciones="evaluaciones.data"
                          :daySelected="fecha"
                          :day="plusDay(startDay, n-1)"
                        >
                        </day-check>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  data(){
        return {
            baseUrl: env.ASPECTOS_EVAL_LIMPIEZA_URL,
            aspectos: [],
            tipos: [],
        };
    },
    props: ['maquina', 'fecha', 'empleado'],
    async created() {
      const response = await axios.post(`${this.baseUrl}?option=getEvaluaciones`,{ maquina: this.maquina, fecha: this.fecha });
      this.aspectos = response.data;
      this.tipos = Object.keys(this.aspectos);
    },
    updated() {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
    },
    methods: {
      plusDay(currentDay, day) {
        const newDate = this.fecha.slice(0,-2) + (currentDay + "").padStart(2, 0);
        const date = new Date(newDate);
        return new Date(date.setDate(date.getDate() + 1 + day)).getDate();
      }
    },
    computed: {
        startDay() {
            const date = new Date(this.fecha);
            return new Date(date.setDate(date.getDate() - (date.getDay() - 1))).getDate();
        },
    },
}
</script>

<style lang="scss">
.collapsible-body {
  overflow: scroll;
}
</style>