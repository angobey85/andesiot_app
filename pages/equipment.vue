<template>
    <div>

        <!-- FORMULARIO AGREGAR EQUIPOS -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Crear un nuevo Equipo</h3>
                </div>
                <div class="row">
                    <div class="col-6">
                        <slot name="label">
                            <label>Planta</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Planta1" value="1"></el-option>
                            <el-option class="text-dark" label="Planta2" value="2"></el-option>
                            <el-option class="text-dark" label="Planta3" value="3"></el-option>
                            <el-option class="text-dark" label="Planta4" value="4"></el-option>
                            <el-option class="text-dark" label="Planta5" value="5"></el-option>
                        </el-select>
                    </div>
                    <div class="col-6">
                        <base-input v-model="newEquipment.equipment_id" label="Id del Equipo" type="text" placeholder=""></base-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                            <base-input v-model="newEquipment.equipment_name" label="Nombre" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                            <base-input v-model="newEquipment.equipment_brand" label="Marca" type="text" placeholder=""></base-input>
                    </div>       
                </div>
                <div class="row">
                    <div class="col-6">
                            <base-input v-model="newEquipment.equipment_model" label="Modelo" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                            <base-input v-model="newEquipment.equipment_tag" label="Tag" type="text" placeholder=""></base-input>
                    </div>       
                </div>
                <div class="row">
                    <div class="col-6">
                        <slot name="label">
                            <label>Plantilla</label><br>
                        </slot>
                        <el-select v-model="selectedIndexTemplate" placeholder="Seleccione una Plantilla" class="select-primary" style="width:100%">
                            <el-option v-for = "template, index in templates" :key="index" class="text-dark" :label="template.template_name" :value="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row pull-right">
                    <div class="col-12">
                        <base-button @click="saveEquipment()" type="success" class="mb-3">Registrar</base-button> 
                    </div>
                </div>
            </card>
        </div>
        <!-- FORMULARIO MOSTRAR EQUIPOS -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Lista de Equipos</h3>
                </div>
                <el-table :data="$store.state.equipments">
                    <el-table-column prop="equipment_id" label="ID"></el-table-column>
                    <el-table-column prop="equipment_date" label="Fecha"></el-table-column>
                    <el-table-column prop="equipment_name" label="Nombre"></el-table-column>
                    <el-table-column prop="equipment_brand" label="Marca"></el-table-column>
                    <el-table-column prop="equipment_model" label="Modelo"></el-table-column>
                    <el-table-column prop="equipment_tag" label="TAG"></el-table-column>
                    <el-table-column prop="equipment_template" label="Plantilla"></el-table-column>
                    <el-table-column label="Acciones">
                        <div slot-scope="{row, $index}">    

                            <el-tooltip content="Database Saver">
                                <base-switch @click ="updateSaveRuleStatus(row.equipment_saveRule)" :value = "row.equipment_saveRule.saverule_status" on-text="On" off-text="Off"></base-switch>
                            </el-tooltip>    

                            <el-tooltip content="Borrar">
                                <base-button type="danger" size="sm" class="" @click="deleteEquipment(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>
                    </el-table-column>
                </el-table>
            </card>
        </div>
        

        <pre>
            {{$store.state.selectedEquipment}}
        </pre>

        <pre>
            {{$store.state.equipments}}
        </pre>

    </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseButton from '../components/BaseButton.vue';

export default{
    middleware: 'authentication',
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
    },
    data() {
        return {
            templates:[],
            selectedIndexTemplate: null,
            newEquipment:{
                equipment_id: "",
                equipment_name: "",
                equipment_brand: "",
                equipment_model: "",
                equipment_tag: "",
                equipment_template_name: "",
                equipment_template_id:""
            }
        };
    },
    mounted(){

        this.$store.dispatch("getEquipments");
        this.getTemplates();
        
    },
    methods:{

        updateSaveRuleStatus(rule){
            
            var ruleCopy = JSON.parse(JSON.stringify(rule));
    
            ruleCopy.saverule_status = !ruleCopy.saverule_status;
            const toSend = {
                rule: ruleCopy
            };
            const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                }
            };

            this.$axios.put("/saver-rule", toSend, axiosHeaders)
            .then(res=> {

                if (res.data.status == "success") {
                    this.$store.dispatch("getEquipments");

                    this.$notify({
                        type: "success",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Estado del Equipo Actualizado"
                    });
                    
                }

                return;
            })
            .catch(e=>{
                console.log(e);
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Estado del Equipo no se Actualizo"
                });

                return;
            })

        },

        saveEquipment(){
            
            if (this.newEquipment.equipment_name == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Nombre"
                });
                return;    
            }

            if (this.newEquipment.equipment_brand == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Marca"
                });
                return;    
            }

            if (this.newEquipment.equipment_model == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Modelo"
                });
                return;    
            }

            if (this.newEquipment.equipment_tag == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Tag"
                });
                return;    
            }

            if (this.selectedIndexTemplate == null) {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que elegir una Plantilla"
                });
                return;    
            }

           const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                }           
            };

            //LLENAMOS EL NOMBRE Y ID DE TEMPLATE SELECCIONADO

            this.newEquipment.equipment_template_id = this.templates[this.selectedIndexTemplate]._id;
            this.newEquipment.equipment_template_name = this.templates[this.selectedIndexTemplate].template_name;

            const toSend = {
                newEquipment: this.newEquipment
            }

            console.log(toSend);

            this.$axios.post("/equipment", toSend, axiosHeaders).then(res =>{

                if (res.data.status == "success") {
                    this.$store.dispatch("getEquipments");
                    this.newEquipment.equipment_id = "";
                    this.newEquipment.equipment_name = "";
                    this.newEquipment.equipment_brand = "";
                    this.newEquipment.equipment_model = "";
                    this.newEquipment.equipment_tag = "";
                    this.selectedIndexTemplate = null;

                    this.$notify({
                        type: "success", 
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Equipo Creado"
                    });
                    
                }

            })
            .catch(e => {
            
                if (e.response.data.status == "error" && e.response.data.error.errors.equipment_id.kind == "unique") {
                    
                    this.$notify({
                        type: "warning", 
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Este Equipo ya esta Registrado"
                    });
                    return;
                    

                }
           



            })

        },

        async getTemplates(){
            const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                        
                }
                    
            };

            try {
                const res = await this.$axios.get("/template", axiosHeaders);
                console.log(res.data.data);
                if (res.data.status == "success") {

                    this.templates = res.data.data;
                }
            } catch (error) {
                console.log("error");
            }


        },
        

        deleteEquipment(equipment) {
        const axiosHeader = {
            headers: {
            token: this.$store.state.auth.token
            },
            params: {
            equipment_id: equipment.equipment_id
            }
        };
        this.$axios
            .delete("/equipment", axiosHeader)
            .then(res => {
            if (res.data.status == "success") {
                this.$notify({
                type: "success",
                icon: "tim-icons icon-check-2",
                message: equipment.equipment_name + " Eliminado!"
                });
                this.$store.dispatch("getEquipments");
            }
            
            })
            .catch(e => {
            console.log(e);
            this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: " Error deleting " + equipment.equipment_name
            });
            });
        },

    }
};
</script>