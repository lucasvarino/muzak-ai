<script setup lang="ts">
import type { MoodAxis } from '@/lib/muzakData';

defineProps<{
    mood: MoodAxis[];
    variant: 'linear' | 'dots' | 'two-tone';
}>();
</script>

<template>
    <div class="mz-mood-grid">
        <!-- dots variant -->
        <template v-if="variant === 'dots'">
            <div v-for="(m, i) in mood" :key="i" class="mz-mood-row mz-mood-row--dots">
                <span class="mz-mood-label mz-mood-label--l">{{ m.left }}</span>
                <div class="mz-mood-dots">
                    <span
                        v-for="j in 11"
                        :key="j"
                        class="mz-mood-dot"
                        :class="{ 'mz-mood-dot--active': Math.round(m.value * 10) === j - 1 }"
                    />
                </div>
                <span class="mz-mood-label mz-mood-label--r">{{ m.right }}</span>
            </div>
        </template>

        <!-- two-tone variant -->
        <template v-else-if="variant === 'two-tone'">
            <div v-for="(m, i) in mood" :key="i" class="mz-mood-row">
                <span class="mz-mood-label mz-mood-label--l">{{ m.left }}</span>
                <div class="mz-mood-twotone">
                    <div class="mz-mood-twotone-fill" :style="{ width: `${m.value * 100}%` }" />
                </div>
                <span class="mz-mood-label mz-mood-label--r">{{ m.right }}</span>
            </div>
        </template>

        <!-- linear variant (default) -->
        <template v-else>
            <div v-for="(m, i) in mood" :key="i" class="mz-mood-row">
                <span class="mz-mood-label mz-mood-label--l">{{ m.left }}</span>
                <div class="mz-mood-track">
                    <span class="mz-mood-tick" :style="{ left: `${m.value * 100}%` }" />
                </div>
                <span class="mz-mood-label mz-mood-label--r">{{ m.right }}</span>
            </div>
        </template>
    </div>
</template>
