<template>
    <card>
        <div slot="header"> 
            <h4 class="card-tittle">{{config.selectedVariable.variable_name}} - {{config.variableFullName}}</h4>
        </div> 

        <i class= "fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px"></i>

    </card>   
</template>

<script>
    export default {
        props: ['config'],
        data(){
            return{
                value:false,

            };
        },

        mounted(){
            
            const topic = "data/" + this.config.userId + "/" + this.config.selectedVariable.variable_id + "/" + this.config.variable
            console.log(topic);
            this.$nuxt.$on(topic, this.processReceivedData)    
        },

        beforeDestroy(){
            const topic = "data/" + this.config.userId + "/" + this.config.selectedVariable.variable_id + "/" + this.config.variable
            this.$nuxt.$off(topic);
        },    

        methods:{

            processReceivedData(data){
                console.log("Recibido");
                console.log(data);
                this.value = data.value;
            },

            getIconColorClass(){
                if(!this.value){
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

