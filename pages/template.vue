<template>
    <div>
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Widgets</h4>
                </div>

                <div class="row">
                    <!-- SELECTOR DE WIDGET Y FORMULARIOS -->
                    <div class="col-6">
                        <!-- ELEGIR WIDGET -->
                        <el-select v-model="widgetType" class="select-success" placeholder="Seleccione un Widget" style="width: 100%;">
                                <el-option class="text-dark" value="numberchart" label="Grafico en Tiempo Real"></el-option>
                                <el-option class="text-dark" value="indicador" label="Display"></el-option>
                                <el-option class="text-dark" value="map" label="Mapa"></el-option>
                                <el-option class="text-dark" value="switch" label="Switch"></el-option>
                                <el-option class="text-dark" value="button" label="Boton"></el-option>
                        </el-select>
                        <br /><br />
                        <!-- FORMULARIO TIPO GRAFICO -->
                        <div v-if="widgetType == 'numberchart'">
                            <base-input v-model="graphConfig.variableFullName" label="Nombre de Variable" type="text"></base-input>
                            <base-input v-model="graphConfig.unit" label="Unidad" type="text"></base-input>
                            <base-input v-model.number="graphConfig.decimalPlaces" label="Cantidad de Decimales" type="number"></base-input>
                            <base-input v-model="graphConfig.icon" label="Icono" type="text"></base-input>

                            <br />

                            <base-input v-model.number="graphConfig.chartTimeAgo" label="Historico de datos (mins)" type="number"></base-input>

                            <br />

                            <el-select v-model="graphConfig.class" class="select-success" placeholder="Seleccione un Color" style="width: 100%;">
                                <el-option class="text-success" value="success" label="Success"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning"></el-option>
                                <el-option class="text-info" value="info" label="info"></el-option>
                                <el-option class="text-danger"  value="danger" label="Rojo"></el-option>
                            </el-select>

                            <br /><br /><br />

                            <el-select v-model="graphConfig.column" class="select-success" placeholder="Seleccione un Ancho" style="width: 100%;">
                                <el-option class="text-dark" value="col-3" label="25%"></el-option>
                                <el-option class="text-dark" value="col-4" label="33,33%"></el-option>
                                <el-option class="text-dark" value="col-5" label="41,66%"></el-option>
                                <el-option class="text-dark" value="col-6" label="50%"></el-option>
                                <el-option class="text-dark" value="col-7" label="58,33%"></el-option>
                                <el-option class="text-dark" value="col-8" label="66,66%"></el-option>
                                <el-option class="text-dark" value="col-9" label="75%"></el-option>
                                <el-option class="text-dark" value="col-10" label="83,33%"></el-option>
                                <el-option class="text-dark" value="col-11" label="91.66%"></el-option>
                                <el-option class="text-dark" value="col-12" label="100% "></el-option>
                            </el-select>

                            <br /><br />
                        </div>
                        <!-- FORMULARIO TIPO SWITCH -->
                        <div v-if="widgetType == 'switch'">
                            <base-input v-model="switchConfig.variableFullName" label="Nombre" type="text"></base-input>
                            <base-input v-model="switchConfig.icon" label="Icono" type="text"></base-input>

                            <br />

                            <el-select v-model="switchConfig.class" class="select-success" placeholder="Seleccione Color" style="width: 100%;">
                                <el-option class="text-success" value="success" label="Success"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning"></el-option>
                                <el-option class="text-danger"  value="danger"  label="Danger"></el-option>
                            </el-select>

                            <br /><br /><br />
                            <el-select v-model="switchConfig.column" class="select-success" placeholder="Seleccione un Ancho" style="width: 100%;">
                                <el-option class="text-dark" value="col-3" label="25%"></el-option>
                                <el-option class="text-dark" value="col-4" label="33,33%"></el-option>
                                <el-option class="text-dark" value="col-5" label="41,66%"></el-option>
                                <el-option class="text-dark" value="col-6" label="50%"></el-option>
                                <el-option class="text-dark" value="col-7" label="58,33%"></el-option>
                                <el-option class="text-dark" value="col-8" label="66,66%"></el-option>
                                <el-option class="text-dark" value="col-9" label="75%"></el-option>
                                <el-option class="text-dark" value="col-10" label="83,33%"></el-option>
                                <el-option class="text-dark" value="col-11" label="91.66%"></el-option>
                                <el-option class="text-dark" value="col-12" label="100% "></el-option>
                            </el-select>
                            <br /><br />
                        </div>
                        <!-- FORMULARIO TIPO BOTON -->
                        <div v-if="widgetType == 'button'">
                            <base-input v-model="buttonConfig.variableFullName" label="Nombre" type="text"></base-input>
                            <base-input v-model="buttonConfig.message" label="Mensaje" type="text"></base-input>
                            <base-input v-model="buttonConfig.text" label="Texto del Boton" type="text"></base-input>
                            <base-input v-model="buttonConfig.icon" label="Icono" type="text"></base-input>
                            <br />

                            <el-select v-model="buttonConfig.class" class="select-success" placeholder="Seleccione Color" style="width: 100%;">
                                <el-option class="text-success" value="success" label="Success"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger"></el-option>
                            </el-select>

                            <br /><br /><br />

                            <el-select v-model="buttonConfig.column" class="select-success" placeholder="Select Column Width" style="width: 100%;">
                                <el-option class="text-dark" value="col-3" label="25%"></el-option>
                                <el-option class="text-dark" value="col-4" label="33,33%"></el-option>
                                <el-option class="text-dark" value="col-5" label="41,66%"></el-option>
                                <el-option class="text-dark" value="col-6" label="50%"></el-option>
                                <el-option class="text-dark" value="col-7" label="58,33%"></el-option>
                                <el-option class="text-dark" value="col-8" label="66,66%"></el-option>
                                <el-option class="text-dark" value="col-9" label="75%"></el-option>
                                <el-option class="text-dark" value="col-10" label="83,33%"></el-option>
                                <el-option class="text-dark" value="col-11" label="91.66%"></el-option>
                                <el-option class="text-dark" value="col-12" label="100% "></el-option>
                            </el-select>

                            <br /><br />
                        </div>
                        <!-- FORMULARIO TIPO INDICADOR -->
                        <div v-if="widgetType == 'indicador'">
                            <base-input v-model="indicatorConfig.variableFullName" label="Nombre de Variable" type="text"></base-input>
                            <base-input v-model="indicatorConfig.unit" label="Unidad" type="text"></base-input>
                            <base-input v-model.number="indicatorConfig.decimalPlaces" label="Cantidad de Decimales" type="number"></base-input>
                            <base-input v-model="indicatorConfig.icon" label="Icono" type="text"></base-input>
                            <br />
                            <el-select v-model="indicatorConfig.class" class="select-success" placeholder="Select Class" style="width: 100%;">
                                <el-option class="text-success" value="success" label="Success"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger"></el-option>
                            </el-select>

                            <br /><br /><br />

                            <el-select v-model="indicatorConfig.column" class="select-success" placeholder="Select Column Width" style="width: 100%;">
                                <el-option class="text-dark" value="col-3" label="25%"></el-option>
                                <el-option class="text-dark" value="col-4" label="33,33%"></el-option>
                                <el-option class="text-dark" value="col-5" label="41,66%"></el-option>
                                <el-option class="text-dark" value="col-6" label="50%"></el-option>
                                <el-option class="text-dark" value="col-7" label="58,33%"></el-option>
                                <el-option class="text-dark" value="col-8" label="66,66%"></el-option>
                                <el-option class="text-dark" value="col-9" label="75%"></el-option>
                                <el-option class="text-dark" value="col-10" label="83,33%"></el-option>
                                <el-option class="text-dark" value="col-11" label="91.66%"></el-option>
                                <el-option class="text-dark" value="col-12" label="100% "></el-option>
                            </el-select>

                            <br /><br />
                        </div>
                    </div>

                    <!-- WIDGET PREVIEW -->
                    <div class="col-6">
                        <wgraphic v-if="widgetType == 'numberchart'" :config="graphConfig"></wgraphic>
                        <wswitch v-if="widgetType == 'switch'" :config="switchConfig"></wswitch>
                        <wbutton v-if="widgetType == 'button'" :config="buttonConfig"></wbutton>
                        <windicator v-if="widgetType == 'indicador'" :config="indicatorConfig"></windicator>
                    </div>
                </div>

                <!-- ADD WIDGET BUTTON -->
                <div class="row pull-right">
                    <div class="col-12">
                        <base-button native-type="submit" type="primary" class="mb-3" size="lg" @click="addNewWidget()">Agregar Widget</base-button>
                    </div>
                </div>
            </card>
        </div>
        <!-- DASHBOARD PREVIEW -->
        <div class="row">
            <div v-for="(widget, index) of widgets" :key="index" :class="[widget.column]">
                <i aria-hidden="true" class="fa fa-trash text-warning pull-right" @click="deleteWidget(index)" style="margin-bottom: 10px;"></i>
                <wgraphic v-if="widget.widget == 'numberchart'" :config="widget" ></wgraphic>
                <wswitch v-if="widget.widget == 'switch'" :config="widget" ></wswitch>
                <wbutton v-if="widget.widget == 'button'" :config="widget" ></wbutton>
                <windicator v-if="widget.widget == 'indicador'" :config="widget" ></windicator>
            </div>
        </div>            
        <!-- SAVE TEMPLATE-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Guardar Plantilla</h4>
                </div>

                <div class="row">
                    <base-input class="col-4" v-model="templateName" label="Nombre de la Plantilla" type="text"></base-input>
                    <base-input class="col-8" v-model="templateDescription" label="Descripción de la Plantilla" type="text"></base-input>
                </div>

                <br /><br />

                <div class="row">
                    <div class="col-12">
                        <base-button native-type="submit" type="primary" class="mb-3 pull-right" size="lg" @click="saveTemplate()" :disabled ="widgets.length == 0">Guardar Plantilla</base-button>
                    </div>
                </div>
            </card>
        </div>

        <!-- TEMPLATES TABLE -->
        <div class="row">
        <card>
            <div slot="header">
                <h4 class="card-title">Lista de Plantillas</h4>
            </div>

            <div class="row">
                <el-table :data="templates">
                    <el-table-column min-width="50" label="#" align="center">
                        <div class="photo" slot-scope="{ row, $index }">
                            {{ $index + 1 }}
                        </div>
                    </el-table-column>

                    <el-table-column prop="template_name" label="Name"></el-table-column>
                    <el-table-column prop="template_description" label="Descripción"></el-table-column>
                    <el-table-column prop="template_widgets.length" label="Widgets"></el-table-column>
                    <el-table-column header-align="right" align="right" label="Actions">
                        <div slot-scope="{ row, $index }" class="text-right table-actions">
                            <el-tooltip content="Delete" effect="light" :open-delay="300" placement="top">
                                <base-button @click="deleteTemplate(row)" type="danger" icon size="sm" class="btn-link">
                                    <i class="tim-icons icon-simple-remove "></i>
                                </base-button>
                            </el-tooltip>
                        </div>
                    </el-table-column>
                </el-table>
            </div>
        </card>
        </div>
        
        <pre>
            {{widgets}}
        </pre>
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
        [Select.name]: Select
        },


        
        data(){
            return {
                value:false,
                widgets: [],
                templates: [],
                widgetType: "",
                templateName: "",
                templateDescription: "",

                graphConfig: {
                    userId: "sampleuserid",
                    selectedVariable: {
                    variable_name: "Home",
                    variable_id: "8888"
                    },
                    variableFullName: "temperature",
                    variable: "varname",
                    unit: "Watts",
                    class: "success",
                    column: "col-12",
                    decimalPlaces: 2,
                    widget: "numberchart",
                    icon: "fa-bath",
                    chartTimeAgo: 1566,
                    demo: true
                },

                switchConfig: {
                    userId: "userid",
                    selectedVariable: {
                    variable_name: "Home",
                    variable_id: "8888"
                    },
                    variableFullName: "Luz",
                    variable: "varname",
                    class: "danger",
                    widget: "switch",
                    icon: "fa-bath",
                    column: "col-6"
                },                

                indicatorConfig: {
                    userId: 'userid',
                    selectedVariable:{

                            variable_id: "6",
                            variable_name: "Humedad",
                            variable_med: "%",
                            variable_template: "prueba",
                            variable_template_id: "3"
                            
                    },
                    variableFullName: "Bomba",
                    variable: "var1",
                    decimalPlaces: 2,
                    unit: "Watts",
                    icon: "fa-sun",
                    column: "col-6",
                    widget: "indicador",
                    class: "success"


                },

                buttonConfig: {
                    userId: 'userid',
                    selectedVariable:{

                            variable_id: "6",
                            variable_name: "Humedad",
                            variable_med: "%",
                            variable_template: "prueba",
                            variable_template_id: "3"
                            
                    },
                    variableFullName: "Bomba",
                    variable: "var2",
                    icon: "fa-sun",
                    column: "col-6",
                    widget: "button",
                    class: "in",
                    message: "{'fanstatus': 'stop'}"


                },

                
            }
        },

        mounted(){
           this.getTemplates(); 
        },
        
        methods:{
            sendData(){
                this.value = !this.value;
                const toSend = {
                    value: this.value
                }
                this.$nuxt.$emit('data/userid/6/var1', toSend);
            },
            
        async deleteTemplate(template) {
            const axiosHeader = {
                headers: {
                    token: this.$store.state.auth.token
                },
                params: {
                    template_id: template._id,
                    
                }
                
            };
            console.log(axiosHeader);
            try {

                const res = await this.$axios.delete("/template", axiosHeader);
                if (res.data.status == "success") {
                    this.$notify({
                        type: "success",
                        icon: "tim-icons icon-check-2",
                        message: template.template_name + " Eliminado!"
                    });
                    this.getTemplates();
                }
                
            } catch (error) {

                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: " Error al Eliminar " + template.template_name
                });

                console.log(error);
                return;
            }

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
            async saveTemplate(){
                const axiosHeaders = {
                    headers:{
                        token: this.$store.state.auth.token
                        
                    }
                    
                };

                const toSend = {
                    template: {
                        template_name: this.templateName,
                        template_description: this.templateDescription,
                        template_widgets: this.widgets
                    }
                }

                try {
                    const res = await this.$axios.post("/template", toSend, axiosHeaders);

                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success", 
                            icon: "tim-icons icon-alert-circle-exc",
                            message: "Plantilla Creada"
                        })
                        this.getTemplates();
                    }
                } catch (error) {
                    console.log("error");
                }


            },
            addNewWidget(){
                if (this.widgetType == "numberchart") {
                    this.graphConfig.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.graphConfig)));
                    
                }
                if (this.widgetType == "switch") {
                    this.switchConfig.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.switchConfig)));
                    
                }
                if (this.widgetType == "indicador") {
                    this.indicatorConfig.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.indicatorConfig)));
                    
                }
                if (this.widgetType == "button") {
                    this.buttonConfig.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.buttonConfig)));
                    
                }
            },
            deleteWidget(index){
                this.widgets.splice(index, 1);
            },
            makeid(length) {
                var result = "";
                var characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                    );
                }
                return result;
            }
        }


    }
</script>