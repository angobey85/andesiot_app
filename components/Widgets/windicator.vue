<template>
    <card >
        <div slot="header"> 
            <h4 class="card-tittle">{{config.variableFullName}}</h4>                
        </div>
        <div class="row">
            <div class="col-6 py-3">
                <center>
                    <h1>{{value.toFixed(config.decimalPlaces)}}<h4>{{config.unit}}</h4></h1>
                </center>              
            </div>
            <div class="col-6  ">
                    <center>
                        <i class= "text-white fa " :class="[config.icon, getIconColorClass()]" style="font-size: 50px; padding:15px; border-radius: 50%;"></i>
                    </center>              
            </div>
        </div>
        <div class="row" :class="getIconColorClass()">
            <div class="col-12 text-white">
                <center>__-__-__ __:__:__</center>
            </div>
        </div>
            
        
        

    </card>   
</template>

<script>
    export default {
        props: ['config'],
        data(){
            return{
                value:150,

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

                if (this.config.class == "success"){
                    return "bg-success";
                }

                if (this.config.class == "primary"){
                    return "bg-primary";
                }

                if (this.config.class == "warning"){
                    return "bg-warning";
                }

                if (this.config.class == "danger"){
                    return "bg-danger";
                }
            }
        }
    }
</script>

