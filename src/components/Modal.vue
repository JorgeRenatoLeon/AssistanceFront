<template>
    <div name="Modal">
        <a class="button" href="#openModal"><b-icon icon="search"></b-icon></a>
        <div id="openModal" class="modalbg">
            <div class="dialog">
                <a href="#close" title="Close" class="close">X</a>
                <h2>Coordinadores</h2>
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo</th>
                    </tr>
                    </thead>
                    <tbody href="#close">
                    <tr  v-for="(item, index) in coordinadores" :key="index" v-on:click="$emit('childToParentFacu',item)">
                        <th scope="row"><a href="#close">{{item.codigo}}</a></th>
                        <td><a href="#close">{{item.nombre+" "+item.apellidos}}</a></td>
                        <td><a href="#close">{{item.correo}}</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data(){
    return{
      coordinadores:[]
    }
  },
  mounted(){
    this.listarCoordinadores();
  },
  methods:{
    listarCoordinadores() {
      this.axios.post('/facultad/coordinadoresFacu')
        .then(res =>{
          this.$store.state.coordinadores = res.data
          this.coordinadores=res.data;
        })
        .catch(e => {
          console.log(e.response);
        })
    },
  },
}
</script>

<style lang="less" scoped>
    @import '../assets/styles/modal.less';
</style>