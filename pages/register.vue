<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//andes_color_900.png" alt="" />
          <h4 class="card-title text-center">Registro</h4>
        </template>

        <div>
          <base-input
            name="name"
            v-model="user.user_name"
            placeholder="Name"
            addon-left-icon="tim-icons icon-badge"
          >
          </base-input>

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
            placeholder="Password"
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
            @click="register()"
            block
          >
            Registrar
          </base-button>

          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link" to="/login">
                login
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link">Need Help?</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  middleware: 'notauthentication',
  layout: "auth",
  data() {
    return {
      user: {
        user_name: "",
        user_email: "",
        user_password: ""
      }
    };
  },
  methods: {
      register(){

          this.$axios.post("/register", this.user)
          .then((res)=> {
              if(res.data.status == "success"){

                  this.$notify({
                      type: "success",
                      icon: "tim-icons icon-check-2",
                      message: "Registrado! Ahora puedes logear"
                  });
                  
                this.user.user_name = "";
                this.user.user_email = "";
                this.user.user_password = "";

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