<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//andes_color_900.png" alt="" />
          <h4 class="card-title text-center">Ingrese Credenciales</h4>
        </template>

        <div>
          <base-input
            name="email"
            v-model="user.user_email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>

          <base-input
            name="password"
            v-model="user.user_password"
            type="password"
            placeholder="Contraseña"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="info"
            class="mb-3"
            size="lg"
            @click="login()"
            block
          >
            Entrar
          </base-button>
          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link" to="/register">
                Registrar Usuario
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link">Necesita Ayuda?</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: 'notauthentication',
  name: "login-page",
  layout: "auth",
  data() {
    return {
      user: {
        user_email: "",
        user_password: ""
      }
    };
  },
  mounted(){

  },
    methods: {
      login(){

          this.$axios.post("/login", this.user)
          .then((res)=> {
              if(res.data.status == "success"){

                  this.$notify({
                      type: "success",
                      icon: "tim-icons icon-check-2",
                      message: "Bienvenido! " + res.data.userData.user_name + " a la Plataforma IoT"
                  });
                  console.log(res.data)

                  const auth = {
                    token: res.data.token,
                    userData: res.data.userData
                  }

                  //TOKEN A LA TIENDA

                  this.$store.commit('setAuth', auth);

                  //

                  localStorage.setItem('auth', JSON.stringify(auth));
                  $nuxt.$router.push('/dashboard');

                  return;
              }
          })
          .catch(e =>{
              console.log(e.response.data);

              if(e.response.data.error.errors.user_email.kind == "unique"){
                    this.$notify({
                      type: "danger",
                      icon: "tim-icons icon-alert-circle-exc",
                      message: "El Usuario ya Existe"
                  });

                  return;
              }else{
                    this.$notify({
                      type: "danger",
                      icon: "tim-icons icon-alert-circle-exc",
                      message: "Error al crear el Usuario"
                  });

                  console.log(res.data)

                  return;
              }
          })  
      }
  }
};
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>