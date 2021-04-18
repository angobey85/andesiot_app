<template>
  <div>

    <!-- NEW ALARM FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.equipments.length > 0 ">

          <div slot="header">
            <h4 class="card-title">Crear una Nueva Alarma{{selectedWidgetIndex}}</h4>
          </div>

          <div class="row">

            <div class="col-3" >

              <el-select required class="select-success" placeholder="Variable" v-model="selectedWidgetIndex"
                style="margin-top: 25px;">
                <el-option v-for="widget, index in $store.state.selectedEquipment.template.template_widgets" :key="index" class="text-dark" :value="index" :label="widget.variableFullName"></el-option>
              </el-select>
              
            </div>

            <div class="col-3">
              <el-select required class="select-warning" placeholder="Condición" v-model="newRule.condition"
                style="margin-top: 25px;">
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="<>" label="<>"></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <base-input label="Valor" v-model="newRule.value" type="number"></base-input>
            </div>

            <div class="col-3">
              <base-input label="Tiempo entre Alarmas (Minutos)" v-model="newRule.triggerTime" type="number"></base-input>
            </div>

          </div>

          <br><br>

          <div class="row pull-right">

            <div class="col-12">
              <base-button @click="createNewRule()" native-type="submit" type="primary" class="mb-3" size="lg" :disabled="$store.state.equipments.length == 0" >
                Agregar Alarma
              </base-button>
            </div>

          </div>

        </card>
        <card v-else>
          Necesitas Seleccionar un Equipo para ver las Variables
        </card>
      </div>
    </div>

        <div class="row" v-if="$store.state.equipments.length > 0">
      <div class="col-sm-12">
        <card>
          <div slot="header">
            <h4 class="card-title">Lista de Alarmas</h4>
          </div>

          <el-table v-if="$store.state.selectedEquipment.alarmRule.length > 0" :data="$store.state.selectedEquipment.alarmRule">
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>
            <el-table-column prop="alarmrule_variable_name" label="Nombre de Variable"></el-table-column>
            <el-table-column prop="alarmrule_variable_id" label="Variable Id"></el-table-column>
            <el-table-column prop="alarmrule_condition" label="Condicion"></el-table-column>
            <el-table-column prop="alarmrule_value" label="Valor"></el-table-column>
            <el-table-column prop="alarmrule_triggerTime" label="Tiempo de Entre Alarmas"></el-table-column>
            <el-table-column prop="alarmrule_counter" label="Alertas"></el-table-column>
            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip content="Borrar" effect="light" placement="top">
                  <base-button
                    @click="deleteAlarm(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>

                <el-tooltip content="Rule Status" style="margin-left: 20px;">
                  <i
                    class="fas fa-exclamation-triangle"
                    :class="{ 'text-warning': row.alarmrule_status }"
                  ></i>
                </el-tooltip>

                <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en 
                      cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
                <el-tooltip
                  content="Change Rule Status"
                  style="margin-left: 5px;"
                >
                  <base-switch
                    @click="updateStatusRule(row)"
                    :value="row.alarmrule_status"
                    type="primary"
                    on-text="ON"
                    off-text="OFF"
                    style="margin-top: 10px;"
                  ></base-switch>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>

          <h4 v-else class="card-title">No hay alarma configurada para este Equipo</h4>
        </card>
      </div>
    </div>

  </div>
</template>

<script>

import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
    middleware: 'authentication',
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
    },

    data(){
        return{
            alarmRules: [],
            selectedWidgetIndex: null,
            newRule: {
                equipment_id: null,
                equipment_name: null,
                status: true,
                variableFullName: null,
                variable: null,
                value: null,
                condition: null,
                triggerTime: null

            }

        }
    },

    methods:{

      deleteAlarm(rule) {
        const axiosHeader = {
            headers: {
            token: this.$store.state.auth.token
            },
            params: {
            alarmrule_emqx_rule_id: rule.alarmrule_emqx_rule_id
            }
        };
        this.$axios
            .delete("/alarm-rule", axiosHeader)
            .then(res => {
            if (res.data.status == "success") {
                this.$notify({
                type: "success",
                icon: "tim-icons icon-check-2",
                message: " Eliminado Correctamente!"
                });
                this.$store.dispatch("getEquipments");
            }
            
            })
            .catch(e => {
            console.log(e);
            this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: " Error al Borra "
            });
            });
      },

      updateStatusRule(rule){

            const axiosHeaders = {
              headers:{
                  token: this.$store.state.auth.token
              }
            };
            
            var ruleCopy = JSON.parse(JSON.stringify(rule));
    
            ruleCopy.alarmrule_status = !ruleCopy.alarmrule_status;
            const toSend = {
                rule: ruleCopy
            };

            this.$axios.put("/alarm-rule", toSend, axiosHeaders)
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

      createNewRule(){
        if (this.selectedWidgetIndex == null) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Variable debe ser Seleccionada"
          });
          return;
        }
        if (this.newRule.condition == null) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Condición debe ser Seleccionada"
          });
          return;
        }
        if (this.newRule.value == null) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Valor esta Vacio"
          });
          return;
        }
        if (this.newRule.triggerTime == null) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Tiempo entre Alarmas esta Vacio"
          });
          return;
        }

        this.newRule.equipment_id = this.$store.state.selectedEquipment.equipment_id;
        this.newRule.equipment_name = this.$store.state.selectedEquipment.equipment_name;
        this.newRule.variableFullName = this.$store.state.selectedEquipment.template.template_widgets[this.selectedWidgetIndex].variableFullName;
        this.newRule.variable = this.$store.state.selectedEquipment.template.template_widgets[this.selectedWidgetIndex].variable;


        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token
          }
        }

        var toSend = {
          newRule: this.newRule

        };


        this.$axios.post("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.newRule.variable = null;
            this.newRule.condition = null;
            this.newRule.value = null;
            this.newRule.triggerTime = null;

            this.$notify({
              type: 'success',
              icon: 'tim-icons icon-check-2',
              message: 'Alarma Creada Correctamente'
            })

            this.$store.dispatch("getEquipments");

          }
        })
        .catch(e => {    
          this.$notify({
            type: 'danger',
            icon: 'tim-icons icon-alert-circle-ecx',
            message: 'Error'
          })
        })


      }
    }
}
</script>