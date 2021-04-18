<template>
    <div>

        <!-- FORMULARIO AGREGAR DEVICES -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Crear un Nuevo Dispositivo</h3>
                </div>
                <div class="row">
                    <div class="col-6">
                        <base-input label="Numero de Serie" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                        <base-input label="Nombre" type="text" placeholder=""></base-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <base-input label="Modelo" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                        <slot name="label">
                            <label>Usuario</label><br>
                        </slot>
                        <el-select value="1" placeholder="Seleccione un Usuario" class="select-primary" style="width:100%">
                            <el-option class="text-dark" label="Andres Gonzalez" value="1"></el-option>
                            <el-option class="text-dark" label="VMS" value="2"></el-option>
                            <el-option class="text-dark" label="ARIZTIA" value="3"></el-option>
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
        <!-- FORMULARIO MOSTRAR DEVICES -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Lista de Dispositivos</h3>
                </div>
                <el-table :data="$store.state.devices">
                    <el-table-column prop="device_id" label="ID"></el-table-column>
                    <el-table-column prop="device_date" label="Fecha"></el-table-column>
                    <el-table-column prop="device_name" label="Nombre"></el-table-column>
                    <el-table-column prop="device_serie" label="Numero de Serie"></el-table-column>
                    <el-table-column prop="device_model" label="Modelo"></el-table-column>
                    
                    <el-table-column label="Acciones">
                        <div slot-scope="{row, $index}">
                            <el-tooltip content="Borrar">
                                <base-button type="danger" size="sm" class="" @click="deleteDevice(row)">
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

        this.$store.dispatch("getDevices");
        
    },
    methods:{

        deleteDevice(device) {
        const axiosHeader = {
            headers: {
            token: this.$store.state.auth.token
            },
            params: {
            device_id: device.device_id
            }
        };
        this.$axios
            .delete("/device", axiosHeader)
            .then(res => {
            if (res.data.status == "success") {
                this.$notify({
                type: "success",
                icon: "tim-icons icon-check-2",
                message: device.device_name + " Eliminado!"
                });
                this.$store.dispatch("getDevices");
            }
            
            })
            .catch(e => {
            console.log(e);
            this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: " Error deleting " + device.device_name
            });
            });
        },

    }
};
</script>