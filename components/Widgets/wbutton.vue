<template>
    <card>
        <div slot="header"> 
            <h4 class="card-tittle">{{config.selectedVariable.variable_name}} - {{config.variableFullName}}</h4>
        </div> 

        <i class= "fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px"></i>

        <div class="row pull-right">
            <div class="col-12">
                <base-button @click ="sendValue()"  :type="config.class" class="mb-3">Encender</base-button> 
            </div>
        </div>

    </card>   
</template>

<script>
    export default {
        props: ['config'],
        data(){
            return{
                sending: false,



            };
        },

        mounted(){
            

        },

        methods:{

            sendValue(){

                this.sending = true;
                setTimeout(() => {
                    this.sending = false
                }, 500);

                const toSend = {
                    topic: "cmd/" + this.config.userId + "/" + this.config.selectedVariable.variable_id + "/" + this.config.variable,
                    msg: {
                        value: this.config.message
                    }
                };

                console.log(toSend);
                this.$nuxt.$emit('mqtt-sender', toSend);

            },

            getIconColorClass(){
                if(!this.sending){
                    return "text-dark"
                }

                if (this.config.class == "success"){
                    return "text-success";
                }

                if (this.config.class == "primary"){
                    return "text-primary";
                }

                if (this.config.class == "warning"){
                    return "text-warning";
                }

                if (this.config.class == "danger"){
                    return "text-danger";
                }
            }
        }
    }
</script>

