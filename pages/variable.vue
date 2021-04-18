<template>
    <div>

        <!-- FORMULARIO AGREGAR VARIABLES -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Crear una Nueva Variable</h3>
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
                        <slot name="label">
                            <label>Equipo</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Equipo1" value="1"></el-option>
                            <el-option class="text-dark" label="Equipo2" value="2"></el-option>
                            <el-option class="text-dark" label="Equipo3" value="3"></el-option>
                            <el-option class="text-dark" label="Equipo4" value="4"></el-option>
                            <el-option class="text-dark" label="Equipo5" value="5"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                            <base-input label="Nombre" type="text" placeholder=""></base-input>
                    </div>    
                </div>
                <div class="row">
                    <div class="col-6">
                        <slot name="label">
                            <label>Tipo de Variable</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Analogica" value="1"></el-option>
                            <el-option class="text-dark" label="Digital" value="2"></el-option>
                        </el-select>
                    </div>
                    <div class="col-6">
                        <slot name="label">
                            <label>Estado de Variable</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Funcionando" value="1"></el-option>
                            <el-option class="text-dark" label="Detenido" value="2"></el-option>
                            <el-option class="text-dark" label="Falla" value="3"></el-option>
                            <el-option class="text-dark" label="Alto" value="4"></el-option>
                            <el-option class="text-dark" label="bajo" value="5"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <base-input label="Unidad de Medida" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                        <slot name="label">
                            <label>Plantilla</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Plantilla1" value="1"></el-option>
                            <el-option class="text-dark" label="Plantilla2" value="2"></el-option>
                            <el-option class="text-dark" label="Plantilla3" value="3"></el-option>
                            <el-option class="text-dark" label="Plantilla4" value="4"></el-option>
                            <el-option class="text-dark" label="Plantilla5" value="5"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row pull-right">
                    <div class="col-12">
                        <base-button type="success" class="mb-3">Registrar</base-button> 
                    </div>
                </div>
            </card>
        </div>
        <!-- FORMULARIO MOSTRAR VARIABLES -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Lista de Variables</h3>
                </div>
                <el-table :data="$store.state.variables">
                    <el-table-column prop="variable_id" label="ID"></el-table-column>
                    <el-table-column prop="variable_date" label="Fecha"></el-table-column>
                    <el-table-column prop="variable_name" label="Nombre"></el-table-column>
                    <el-table-column prop="variable_med" label="Unidad de Medida"></el-table-column>
                    <el-table-column prop="variable_template" label="Template"></el-table-column>
                    <el-table-column label="Acciones">
                        <div slot-scope="{row, $index}">
                            <el-tooltip content="Borrar">
                                <base-button type="danger" size="sm" class="" @click="deleteVariable(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>

                    </el-table-column>
                </el-table>
            </card>
        </div>
        
        

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
  
        };
    },
    mounted(){

        this.$store.dispatch("getVariables");
        
    },
    methods:{

        deleteVariable(variable) {
        const axiosHeader = {
            headers: {
            token: this.$store.state.auth.token
            },
            params: {
            variable_id: variable.variable_id
            }
        };
        this.$axios
            .delete("/variable", axiosHeader)
            .then(res => {
            if (res.data.status == "success") {
                this.$notify({
                type: "success",
                icon: "tim-icons icon-check-2",
                message: variable.variable_name + " Eliminado!"
                });
                this.$store.dispatch("getVariables");
            }
            
            })
            .catch(e => {
            console.log(e);
            this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: " Error deleting " + variable.variable_name
            });
            });
        },

    }
};
</script>