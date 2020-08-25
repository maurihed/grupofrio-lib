<template>
  <span>{{this.remainingTime | time}}</span>
</template>
<script>
export default {
  props: ['endTime','onTimeout'],
  data() {
    return {
      currentTime: new Date(),
      interval: null,
    }
  },
  updated() {
    if (this.remainingTime < 1) {
      clearInterval(this.interval);
      this.onTimeout();
    }
  },
  computed: {
    date() {
      const month = String(this.currentTime.getMonth() + 1).padStart(2,0);
      return `${this.currentTime.getFullYear()}-${month}-${this.currentTime.getDate()}`;
    },
    remainingTime() {
        const total = Date.parse(new Date(this.endTime)) - Date.parse(this.currentTime);
        return total;
    }
  },
  created() {
    this.interval = setInterval(() => this.currentTime = new Date(), 1000);
  },
  filters: {
    time(total) {
      if (!total || total < 0 ) return '';
      const seconds = String(Math.floor( (total/1000) % 60 )).padStart(2, 0);
      const minutes = String(Math.floor( (total/1000/60) % 60 )).padStart(2, 0);
      const hours = String(Math.floor( (total/(1000*60*60)) % 24 )).padStart(2, 0);
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  destroyed() {
    clearInterval(this.interval);
  }
}
</script>