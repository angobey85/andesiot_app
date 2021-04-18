<template>
    <!-- DASHBOARD-->
    <div class="row" v-if ="$store.state.equipments.length > 0">
            <div v-for="(widget, index) in $store.state.selectedEquipment.template.template_widgets" :key="index" :class="[widget.column]">
                <i aria-hidden="true" class="fa fa-trash text-warning pull-right" @click="deleteWidget(index)" style="margin-bottom: 10px;"></i>
                <wgraphic v-if="widget.widget == 'numberchart'" :config="fixWidget(widget)" ></wgraphic>
                <wswitch v-if="widget.widget == 'switch'" :config="fixWidget(widget)" ></wswitch>
                <wbutton v-if="widget.widget == 'button'" :config="fixWidget(widget)" ></wbutton>
                <windicator v-if="widget.widget == 'indicador'" :config="fixWidget(widget)" ></windicator>
            </div>
    </div>    
</template>

<script>

import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";


export default {
    middleware: 'authentication',
    data(){
        return{

        }
    },

    mounted(){
    
    },

    methods:{
        fixWidget(widget){
            var widgetCopy = JSON.parse(JSON.stringify(widget));
            widgetCopy.selectedVariable.variable_id = this.$store.state.selectedEquipment.equipment_id;
            widgetCopy.selectedVariable.variable_name = this.$store.state.selectedEquipment.equipment_name;
            widgetCopy.userId = this.$store.state.selectedEquipment.equipment_user_id;


            if (widget.widget == "numberchart") {
                console.log("dasdsad")

                widgetCopy.demo = false;
                
            }

            return widgetCopy;

        }
    }
}
</script>
