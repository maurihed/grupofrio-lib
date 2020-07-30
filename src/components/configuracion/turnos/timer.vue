<template>
  <span>{{this.remainingTime}}</span>
</template>
<script>
export default {
  props: ['endTime'],
  data() {
    return {
      currentTime: new Date(),
      interval: null,
    }
  },
  computed: {
    date() {
      const month = String(this.currentTime.getMonth() + 1).padStart(2,0);
      return `${this.currentTime.getFullYear()}-${month}-${this.currentTime.getDate()}`;
    },
    remainingTime() {
        const total = Date.parse(new Date(`2020-07-26:${this.endTime}`)) - Date.parse(this.currentTime);
        const seconds = String(Math.floor( (total/1000) % 60 )).padStart(2, 0);
        const minutes = String(Math.floor( (total/1000/60) % 60 )).padStart(2, 0);
        const hours = String(Math.floor( (total/(1000*60*60)) % 24 )).padStart(2, 0);
        return `${hours}:${minutes}:${seconds}`;
    }
  },
  created() {
    this.interval = setInterval(() => this.currentTime = new Date(), 1000);
  },
  destroyed() {
    clearInterval(this.interval);
  }
}
</script>