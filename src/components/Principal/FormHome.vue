<template lang="pug">
<!-- Animacion de Codepen -->
  <div class="HomeForm" style="background:#7EC2C9">
    <div style="height: 93.8vh;">
        div.main        
            div.human
                div.human__hair-b
                div.human__head
                    div.human__face
                        div.human__hair-c
                            div.human__hair
                        div.human__nose
                        div.human__eye-l
                        div.human__eye-r
                        div.human__cheeks-l
                        div.human__cheeks-r
                        div.human__mouth
                        div.human__eyebrow-l
                        div.human__eyebrow-r
                div.human__ears
                    div.human__ear-l
                    div.human__ear-r
                div.human__arm-l
                div.human__arm-r
                div.human__body-c
                    div.human__body
                        
                div.human__legs
                    div.human__leg-l
                    div.human__leg-r
                    
                div.human__shoes
                    div.human__shoe-c
                        div.human__shoe-l
                    div.human__shoe-c
                        div.human__shoe-r
            //-------------------
            div.table
                div.table__top
                    div.laptop
                    div.cup
                div.table__bottom
                div.table__legs
                    div.table__leg
                    div.table__leg
                    div.table__leg
                    div.table__leg
            //--------------------
            div.chair
                div.chair__top
                div.chair__line
                div.chair__base
                div.chair__wheels
                    div.chair__wheel
                    div.chair__wheel
            //--------------------
            div.trashcan
            //--------------------
            div.window
                div.window__container
                    div.building
                        div.building__window.building__window--active.building__window-on-1
                        div.building__window.building__window--active.building__window-on-2
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active.building__window-on-3
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window
                    div.building
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active.building__window-on-4
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active.building__window-on-3
                        div.building__window
                        div.building__window
                    div.building
                        div.building__window-f
                        div.building__window-f.building__window--active.building__window-on-1
                        div.building__window-f.building__window--active
                        div.building__window-f
                        div.building__window-f
                        div.building__window-f
                        div.building__window-f.building__window--active
                        div.building__window-f
                        div.building__window-f
                        div.building__window-f.building__window--active.building__window-on-2
                        div.building__window-f.building__window--active
                        div.building__window-f
                        div.building__window-f.building__window--active
                        div.building__window-f

                    div.building
                        div.building__window
                        div.building__window.building__window--active.building__window-on-1
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active.building__window-on-4
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
                        div.building__window
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window.building__window--active
                        div.building__window
                        div.building__window
            
            //--------------------
            div.lamp
                div.lamp__top
                    div.lamp__light
                div.lamp__base-c
                    div.lamp__base
            //--------------------
            div.bricks
                div.brick
                div.brick
        </div>
    <div class="gridwrapper posth">
        <strong>RECIBE TUTORÍA DE LOS MEJORES </strong><br>
        <strong>  PROFESORES DE TU PROGRAMA </strong><br> 
    </div>
    <div class="gridwrapper post2">Accede a tutorías personalizadas de la mano<br>del equipo de profesores y psicólogos de tu<br>universidad 
    </div>
    <div class="gridwrapper post3">
        <b-button variant="info" v-on:click="redirect()" class="btn-home">Ingresar</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormHome',
  components: {
  },
  methods:{
      redirect(){
        this.$store.state.reg = false;
        this.$router.push("/login")
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../assets/styles/main.scss';
</style>

<style scoped>
    .posth{
        position: absolute;
        top:20%;
        left:60%;
        font-size: 2vw;
    }
    .post2{
        position: absolute;
        top:35%;
        left:65%;
        font-size: 1vw;
    }
    .post3{
        position: absolute;
        top:50%;
        left:68%;
        font-size: 1vw;
    }
    .btn-home{
        height:70px;
        width:250px;
        font-size: 1vw;
    }
    @media only screen and (max-width: 900px) {
        .posth{
            position: absolute;
            top:50%;
            left:18%;
            font-size: 4vw;
        }
        .post2{
            position: absolute;
            top:60%;
            left:23%;
            font-size: 3vw;
        }
        .post3{
            position: absolute;
            top:72%;
            left:33%;
            width: 35%;
        }
        .btn-home{
            height:5%;
            width: 50%;
            font-size: 3vw;
            padding-right: 20%;
        }
    }
</style>
