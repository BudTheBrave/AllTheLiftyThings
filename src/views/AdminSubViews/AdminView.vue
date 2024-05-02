<template>
    <div class="adminView">
        <div class="adminNav">
            <div   @click="router.push(`/admin/manageStunt`)">Manage Stunt</div>
            <div @click="router.push(`/admin/manageUser`)">Manage Users</div>
        </div>
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'

const router = useRouter();


</script>

<style scoped>
.adminView {
    margin: 5px;
}
.adminNav {
    display: flex;
    width: 100%;
    margin: 5px;
    justify-content: space-evenly;

}

</style>