// Setup Data Page: 
new Vue ({
    el: '#app',
    data () {
        return {
            dataSetup : null
        }
    },
    mounted () {
        axios
            .get('setup-page.json')
            .then(response => (this.dataSetup = response))
    }
});