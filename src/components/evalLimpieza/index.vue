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
                      <td class="center">{{'Martes ('+(startDay+1)+')'}}</td>
                      <td class="center">{{'Miercoles ('+(startDay+2)+')'}}</td>
                      <td class="center">{{'Jueves ('+(startDay+3)+')'}}</td>
                      <td class="center">{{'Viernes ('+(startDay+4)+')'}}</td>
                      <td class="center">{{'Sabado ('+(startDay+5)+')'}}</td>
                      <td class="center">{{'Domingo ('+(startDay+6)+')'}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(evaluaciones, aspecto) in aspectos[tipo]" :key="aspecto">
                    <td>{{aspecto}}</td>
                    <td v-for="n of 7" class="center" :key="n">
                      <day-check
                          :evaluaciones="evaluaciones"
                          :day="(startDay+(n-1))"
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
    props: ['maquina', 'fecha'],
    async created() {
      const response = await axios.post(`${this.baseUrl}?option=getEvaluaciones`,{ maquina: this.maquina, fecha: this.fecha });
      this.aspectos = response.data;
      this.tipos = Object.keys(this.aspectos);
    },
    updated() {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
    },
    methods: {
    },
    computed: {
        startDay() {
            const date = new Date(this.fecha);
            return date.getDate() - (date.getDay() - 1);
        },
        currentDay() {
            const date = new Date(this.fecha);
            return date.getDate() + 1; 
        }
    },
}
</script>

<style lang="scss">
.collapsible-body {
  overflow: scroll;
}
</style>