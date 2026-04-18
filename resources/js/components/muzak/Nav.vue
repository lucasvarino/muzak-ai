<script setup lang="ts">
defineProps<{
    view: string;
}>();

const emit = defineEmits<{
    'update:view': [value: string];
}>();
</script>

<template>
    <nav class="mz-nav">
        <div class="mz-nav-logo">Muzak</div>
        <div class="mz-nav-items">
            <button
                class="mz-nav-item"
                :class="{ 'mz-nav-item--active': view === 'analyze' }"
                @click="emit('update:view', 'analyze')"
            >
                Analyze
            </button>
            <button
                class="mz-nav-item"
                :class="{ 'mz-nav-item--active': view === 'discover' }"
                @click="emit('update:view', 'discover')"
            >
                Discover
            </button>
        </div>
    </nav>
</template>
