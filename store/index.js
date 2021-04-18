export const state = () => ({
    auth: null,
    devices: [],
    equipments: [],
    variables: [],
    selectedEquipment: {},
    notifications: []
});


export const mutations = {
    setAuth(state, Auth){
        state.auth = Auth;
    },
    setDevices(state, devices){
        state.devices = devices;
    },
    setVariables(state, variables){
        state.variables = variables;
    },
    setEquipments(state, equipments){
        state.equipments = equipments;
    },
    setSelectedEquipment(state, equipment){
        state.selectedEquipment = equipment;
    },
    setNotifications(state, notifications){
        state.notifications = notifications;
    }
}

export const actions = {
    readToken(){
        let auth = null;

        try {
            auth = JSON.parse(localStorage.getItem('auth'));
        } catch (error) {
            console.log(err);
        }

        // GUARDAR AUTH

        this.commit('setAuth', auth);
    },

    getDevices(){
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        };

        this.$axios.get("/device" , axiosHeader)
        .then(res=>{
            console.log(res.data.data);
            this.commit("setDevices", res.data.data);
        });
    },

    getVariables(){
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        };

        this.$axios.get("/variable" , axiosHeader)
        .then(res=>{
            console.log(res.data.data);
            this.commit("setVariables", res.data.data);
        });
    },

    getEquipments(){
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        };

        this.$axios.get("/equipment" , axiosHeader)
        .then(res=>{
            console.log(res.data.data);

            res.data.data.forEach((equipment, index)=>{
                if (equipment.equipment_selected) {
                    this.commit("setSelectedEquipment", equipment);
                    $nuxt.$emit('selectedEquipmentIndex', index);
                }
            })

            this.commit("setEquipments", res.data.data);
        });
    },

    getNotifications(){
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        };

        this.$axios.get("/notifications" , axiosHeader)
        .then(res=>{
            console.log(res.data.data);
            this.commit("setNotifications", res.data.data);
        })
        .catch(error =>{
            console.log(error)
        });
    }




};