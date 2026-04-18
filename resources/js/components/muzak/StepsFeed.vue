<script setup lang="ts">
import type { AnalyzeStep } from '@/lib/muzakData';

defineProps<{
    steps: AnalyzeStep[];
    activeIdx: number;
    done: boolean;
}>();

function stepState(idx: number, activeIdx: number, done: boolean): 'done' | 'active' | 'pending' {
    if (idx < activeIdx || done) return 'done';
    if (idx === activeIdx) return 'active';
    return 'pending';
}
</script>

<template>
    <ol class="mz-steps">
        <li
            v-for="(s, i) in steps"
            :key="s.id"
            class="mz-step"
            :class="`mz-step--${stepState(i, activeIdx, done)}`"
            :style="{ '--mz-i': i }"
        >
            <span class="mz-step-mark" aria-hidden="true">
                <template v-if="stepState(i, activeIdx, done) === 'done'">
                    <svg viewBox="0 0 16 16" width="12" height="12">
                        <path d="M3 8 L7 12 L13 4" fill="none" stroke="currentColor" stroke-width="1.6" />
                    </svg>
                </template>
                <template v-else-if="stepState(i, activeIdx, done) === 'active'">
                    <span class="mz-step-spin" />
                </template>
                <template v-else>
                    <span class="mz-step-circle" />
                </template>
            </span>
            <span class="mz-step-label">{{ s.label }}</span>
            <span class="mz-step-detail">{{ s.detail }}</span>
        </li>
    </ol>
</template>
