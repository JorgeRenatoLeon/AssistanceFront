<template>
  <div class="tiposTutorias">
    <CabezeraTitulo msg="Configuración de Tipos de Tutoría"
    :image-path="require('@/assets/images/coffe-cream.jpg')"/>
    <FormTiposTutoria/>
  </div>
</template>

<script>
import CabezeraTitulo from '@/components/Principal/CabezeraTitulo.vue'
import FormTiposTutoria from '@/components/Gestion Programa/FormTiposTutoria.vue'
export default {
  name: 'TiposTutoria',
  components: {
    CabezeraTitulo,
    FormTiposTutoria
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 50px;
}
a {
  color: #42b983;
}
</style>

