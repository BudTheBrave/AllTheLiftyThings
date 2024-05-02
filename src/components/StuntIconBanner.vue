<template>
    <div class="bannerContainer">
        <div class="bannerText">{{ props.stuntIcon }}</div>
    </div>
</template>

<script setup>
const props = defineProps({stuntIcon:String});


</script>

<style lang="scss" scoped>
.bannerContainer {
    position: absolute;
    width: 25px;
    height: 50px;
    background-color: var(--primary-light-bg-color);
    clip-path:  polygon(0% 0%, 100% 0%, 100% 100%, 50% calc(100% - 10px), 0% 100%, 0% 0%);
}
.bannerText {
    width: 100%;
    text-align: center;
    padding-top: 12px;
    color: var(--primary-dark-teal);
}

</style>