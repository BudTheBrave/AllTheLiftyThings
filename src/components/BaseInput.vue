<template>
    <div class="input-wrap">
        <label v-if="label">{{ props.label }}: </label>
        <input :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        :="$attrs"/>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

    const props = defineProps({
        label: {
            type: [String, Boolean],
            default: false
        },
        modelValue: {
            type: [String, Array, Number],
            deafult: ""
        }
    });

</script>

<style scoped>
 
.input-wrap {
    display: flex;
    flex-direction: column;
    width: 150px;
}

input {
    width: 130px;
    padding: 8px 8px;
    font-size: 12px;
}

label {
    text-align: left;
}

</style>