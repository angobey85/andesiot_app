<template>
    
</template>

<script>

export default {
        middleware: 'authentication',
    mounted() {
        $nuxt.$router.push("/dashboard");
    },
}
</script>
