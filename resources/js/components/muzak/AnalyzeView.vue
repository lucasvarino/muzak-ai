<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Tweaks, SimilarItem } from '@/lib/muzakData';
import { analyzeSteps, report } from '@/lib/muzakData';
import StepsFeed from './StepsFeed.vue';
import Report from './Report.vue';
import ReportPlaceholder from './ReportPlaceholder.vue';

const props = defineProps<{
    tweaks: Tweaks;
}>();

const emit = defineEmits<{
    openSimilar: [item: SimilarItem];
}>();

type Phase = 'idle' | 'analyzing' | 'done';

const phase = ref<Phase>((localStorage.getItem('muzak_phase') as Phase) || 'idle');
const activeStep = ref(0);
const inputValue = ref(phase.value === 'done' ? 'open.spotify.com/album/2rNJCHqFbxpmlnWaIqcjO1' : '');
const inputRef = ref<HTMLInputElement | null>(null);

watch(phase, (v) => localStorage.setItem('muzak_phase', v));

onMounted(() => {
    if (phase.value === 'idle') inputRef.value?.focus();
});

function startAnalyze() {
    if (!inputValue.value.trim()) {
        inputValue.value = 'open.spotify.com/album/2rNJCHqFbxpmlnWaIqcjO1';
    }
    phase.value = 'analyzing';
    activeStep.value = 0;

    let i = 0;
    const tick = () => {
        const s = analyzeSteps[i];
        if (!s) {
            phase.value = 'done';
            return;
        }
        activeStep.value = i;
        setTimeout(() => {
            i++;
            tick();
        }, s.duration);
    };
    tick();
}

function resetAnalyze() {
    phase.value = 'idle';
    activeStep.value = 0;
    inputValue.value = '';
    setTimeout(() => inputRef.value?.focus(), 50);
}

defineExpose({ startFastAnalyze: (url: string, speedFactor = 1) => {
    inputValue.value = url;
    phase.value = 'analyzing';
    activeStep.value = 0;
    let i = 0;
    const tick = () => {
        const s = analyzeSteps[i];
        if (!s) { phase.value = 'done'; return; }
        activeStep.value = i;
        setTimeout(() => { i++; tick(); }, Math.max(300, s.duration * speedFactor));
    };
    tick();
}});
</script>

<template>
    <div class="mz-view">
        <div class="mz-analyze-top" :class="{ 'mz-analyze-top--compact': phase !== 'idle' }">
            <div v-if="phase === 'idle'" class="mz-analyze-intro">
                <div class="mz-analyze-eyebrow">Music intelligence · paste a Spotify link to begin</div>
                <h1 class="mz-analyze-h">
                    Read an album the way a <em>critic</em> would.
                </h1>
            </div>

            <form class="mz-url-form" @submit.prevent="startAnalyze">
                <div class="mz-url-field">
                    <span class="mz-url-prefix">↳</span>
                    <input
                        ref="inputRef"
                        v-model="inputValue"
                        class="mz-url-input"
                        placeholder="Paste a Spotify link…"
                        spellcheck="false"
                        autocomplete="off"
                    />
                    <button class="mz-url-submit" type="submit">
                        {{ phase === 'analyzing' ? 'Analyzing…' : 'Analyze' }}
                    </button>
                </div>

                <div v-if="phase === 'idle'" class="mz-url-examples">
                    <span>Try:</span>
                    <button
                        type="button"
                        class="mz-chip"
                        @click="inputValue = 'open.spotify.com/album/2rNJCHqFbxpmlnWaIqcjO1'"
                    >
                        tripleS — Assemble24
                    </button>
                    <button
                        type="button"
                        class="mz-chip"
                        @click="inputValue = 'open.spotify.com/album/brat'"
                    >
                        Charli XCX — Brat
                    </button>
                    <button
                        type="button"
                        class="mz-chip"
                        @click="inputValue = 'open.spotify.com/playlist/latenight'"
                    >
                        A playlist you made
                    </button>
                </div>

                <button v-if="phase !== 'idle'" type="button" class="mz-inline-reset" @click="resetAnalyze">
                    ← New analysis
                </button>
            </form>
        </div>

        <div v-if="phase === 'analyzing'" class="mz-analyze-body">
            <div class="mz-analyze-grid">
                <aside class="mz-analyze-steps">
                    <div class="mz-analyze-kicker">Agent · live</div>
                    <StepsFeed :steps="analyzeSteps" :active-idx="activeStep" :done="false" />
                </aside>
                <div class="mz-analyze-preview">
                    <ReportPlaceholder />
                </div>
            </div>
        </div>

        <div v-if="phase === 'done'" class="mz-analyze-body">
            <Report
                :report="report"
                :mood-variant="tweaks.moodVariant"
                :hero-layout="tweaks.heroLayout"
                @open-similar="emit('openSimilar', $event)"
            />
        </div>
    </div>
</template>
