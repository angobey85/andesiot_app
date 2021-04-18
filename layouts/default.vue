<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar :background-color="sidebarBackground" short-title="AN" title="ANDES IOT">
      <template slot-scope="props" slot="links">
        <sidebar-item 
          :link="{
            name: 'Tablero',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/dashboard'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Graficos',
            icon: 'tim-icons icon-chart-bar-32',
            path: '/data'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Configuración',
            icon: 'tim-icons icon-bell-55',
            path: '/'
          }"      
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Dispositivos',
            icon: 'tim-icons icon-bell-55',
            path: '/device'
          }"         
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Plantas',
            icon: 'tim-icons icon-bell-55',
            path: '/device'
          }"         
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Plantillas',
            icon: 'tim-icons icon-bell-55',
            path: '/template'
          }"        
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Equipos',
            icon: 'tim-icons icon-settings',
            path: '/equipment'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Alertas',
            icon: 'tim-icons icon-bell-55',
            path: '/alarm'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Variables',
            icon: 'tim-icons icon-bell-55',
            path: '/variable'
          }"          
        >
        </sidebar-item>







        <li class="active-pro">
          <a href="https://www.andesiot.cl" target="_blank">
            <i class="tim-icons icon-spaceship"></i>
            <p>Andes IOT</p>
          </a>
        </li>
      </template>
    </side-bar>
    <!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
    <sidebar-share :background-color.sync="sidebarBackground"> </sidebar-share>
    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import SidebarShare from '@/components/Layout/SidebarSharePlugin';
  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
  import ContentFooter from '@/components/Layout/ContentFooter.vue';
  import DashboardContent from '@/components/Layout/Content.vue';
  import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';
  import mqtt from 'mqtt';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },
    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        client: null,
        
        options:{
              port: process.env.mqtt_port,
              host: "localhost",
              endpoint: "/mqtt",
              connectTimeout: 5000,
              reconnectPeriod: 5000,
              clean: true,
              enconding: 'utf8',
              clientId: 'web_' + this.$store.state.auth.userData.user_name + "_" + Math.round(Math.random() * (0-10000) * -1),
              username: '',
              password: ''
        }

      };
    },
    computed: {
      isFullScreenRoute() {
        return this.$route.path === '/maps/full-screen'
      }
    },

    mounted() {
      this.$store.dispatch("getNotifications")
      this.initScrollbar();
      setTimeout(() => {
        this.startMqttClient();
      }, 2000);
            
    },

    methods: {

      async getMqttCredentials(){


        try {

          const axiosHeaders = {
            headers:{
              token: this.$store.state.auth.token
          }
        };

        const credentials = await this.$axios.post("/getMqttCredentials", null, axiosHeaders);
        console.log(credentials.data)
        
        if (credentials.data.status == "success") {
          this.options.username = credentials.data.username;
          this.options.password = credentials.data.password;
        }

          
        } catch (error) {

          console.log(error);
          
        }



      },        

      async getMqttReconnection(){

        try {

          const axiosHeaders = {
            headers:{
              token: this.$store.state.auth.token
          }
        };

        const credentials = await this.$axios.post("/getMqttReconnection", null, axiosHeaders);
        console.log(credentials.data)
        
        if (credentials.data.status == "success") {
          this.client.options.username = credentials.data.username;
          this.client.options.password = credentials.data.password;
        }

          
        } catch (error) {

          console.log(error);
          
        }

      },

      async startMqttClient (){
      
        await this.getMqttCredentials();

          const equipmentSubscribeTopic = "data/" + this.$store.state.auth.userData._id + "/+/+";
          const notifSubscribeTopic = "notif/" + this.$store.state.auth.userData._id + "/+/+";


          try {
            
            this.client = mqtt.connect ("ws://" + this.options.host + ":" + this.options.port + this.options.endpoint, this.options);

          } catch (error) {
            console.log(error)
          }

      //MQTT CONEXION

          this.client.on('connect', () =>{
              console.log("\n");
              console.log("************************************");
              console.log("SE HA CONECTADO A MQTT CORRECTAMENTE");
              console.log("************************************");
              console.log("\n");

              //SDATA SUBSCRIPCION

              this.client.subscribe(equipmentSubscribeTopic, {qos:0}, (err) => {
                if (err) {
                  console.log("Error en Suscribirse a Equipos");
                  return
                }

                console.log("Suscrito a Equipos Correctamente")
                console.log(equipmentSubscribeTopic)
              })

              
              this.client.subscribe(notifSubscribeTopic, {qos:0}, (err) => {
                if (err) {
                  console.log("Error en Suscribirse a Notificaciones");
                  return
                }

                console.log("Suscrito a Notificaciones Correctamente")
                console.log(notifSubscribeTopic)
              })


          });

          this.client.on('reconnect', error =>{
              console.log("MQTT RECONECTANDO", error);
              this.getMqttReconnection();
          });    

          this.client.on('error', error =>{
              console.log("\n");
              console.log("*************************************");
              console.log("********ERROR A CONECTAR MQTT********");
              console.log("*************************************");
              console.log("\n");
              console.log(error)
          });

          this.client.on('message', (topic, message) =>{
            console.log("MENSAJE RECIBIDO DE MQTT -->");
            console.log(message.toString());    
            console.log(topic.toString()); 

            try {
              const splitTopic = topic.split("/");
              const msgType = splitTopic[0];
              
              if (msgType == "notif") {
                this.$notify({
                  type: 'danger',
                  icon: 'tim-icons icon-alert-circle-exc', 
                  message: message.toString()
                });
                this.$store.dispatch("getNotifications")
                return;
              }else if (msgType =="data"){
                $nuxt.$emit(topic, JSON.parse(message.toString()));
                return;
              }

            } catch (error) {
              console.log("error")
            }

            


          });
      
          $nuxt.$on('mqtt-sender', (toSend) => {
            this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
          })
      
      },

      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      initScrollbar() {
        let docClasses = document.body.classList;
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function
          initScrollbar('sidebar');
          initScrollbar('main-panel');
          initScrollbar('sidebar-wrapper');

          docClasses.add('perfect-scrollbar-on');
        } else {
          docClasses.add('perfect-scrollbar-off');
        }
      }
    }

  };
</script>
<style lang="scss">
  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>
