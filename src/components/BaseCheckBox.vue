
<template>
    <div>
        <input type="checkbox" v-model="value"
        @change="$emit('update:modelValue', value)" />
        <span>{{ label }}</span>
    </div>    
</template>

<script setup >
    import { defineProps, ref } from "vue";
    defineProps({
        label: {
            type: String,
            default: "",
        }   
    });

    const value = ref();

</script>

<style  scoped>







</style>