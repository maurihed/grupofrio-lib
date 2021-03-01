<template>
    <div>
        <span class="text-bold primary">{{title}}</span>
        <hr>
        <table>
            <thead>
                <tr>
                    <td v-for="(header, key) in headers" :key="key">{{header}}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                    <td v-for="(subItem, key) in item" :key="'sub'+key">{{subItem}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'reporte-table',
    props: ['title', 'data'],
    methods: {

    },
    computed: {
        headers() {
            if(!this.data || !this.data.length) return [];
            return Object.keys(this.data[0]);
        }
    }
}
</script>