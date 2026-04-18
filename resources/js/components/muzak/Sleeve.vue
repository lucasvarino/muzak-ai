<script setup lang="ts">
import { computed } from 'vue';
import { covers, sleeveById } from '@/lib/muzakData';

const props = defineProps<{
    coverId: string;
    size?: string;
}>();

const html = computed(() => {
    const cov = covers[props.coverId] ?? sleeveById[props.coverId];
    return cov ? cov.render() : '';
});
</script>

<template>
    <div
        class="mz-sleeve"
        :style="{ width: size ?? '100%', height: size ?? '100%' }"
        v-html="html"
    />
</template>
