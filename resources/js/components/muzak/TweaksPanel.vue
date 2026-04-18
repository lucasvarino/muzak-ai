<script setup lang="ts">
import type { Tweaks } from '@/lib/muzakData';

const props = defineProps<{
    tweaks: Tweaks;
    visible: boolean;
}>();

const emit = defineEmits<{
    'update:tweaks': [value: Tweaks];
}>();

const accentSwatches: Array<[Tweaks['accent'], string]> = [
    ['amber', '#f59e0b'],
    ['gold', '#c9a84c'],
    ['ivory', '#e8dcc4'],
    ['ember', '#b84a1a'],
];

const serifOptions: Tweaks['serif'][] = ['playfair', 'instrument', 'fraunces'];
const grainOptions: Tweaks['grain'][] = ['off', 'subtle', 'heavy'];
const moodVariants: Tweaks['moodVariant'][] = ['linear', 'dots', 'two-tone'];
const heroLayouts: Tweaks['heroLayout'][] = ['side-by-side', 'stacked', 'full-bleed'];
const colOptions: Tweaks['discoverCols'][] = [3, 4, 5];

function set<K extends keyof Tweaks>(key: K, value: Tweaks[K]) {
    emit('update:tweaks', { ...props.tweaks, [key]: value });
}
</script>

<template>
    <div v-if="visible" class="mz-tweaks">
        <div class="mz-tweaks-head">
            <span>Tweaks</span>
            <span class="mz-tweaks-sub">Live preview</span>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Accent</div>
            <div class="mz-tw-swatches">
                <button
                    v-for="[k, c] in accentSwatches"
                    :key="k"
                    class="mz-tw-swatch"
                    :class="{ 'mz-tw-swatch--active': tweaks.accent === k }"
                    :style="{ background: c }"
                    :aria-label="k"
                    :title="k"
                    @click="set('accent', k)"
                />
            </div>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Serif family</div>
            <div class="mz-tw-row">
                <button
                    v-for="f in serifOptions"
                    :key="f"
                    class="mz-tw-btn"
                    :class="{ 'mz-tw-btn--active': tweaks.serif === f }"
                    @click="set('serif', f)"
                >
                    {{ f }}
                </button>
            </div>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Grain</div>
            <div class="mz-tw-row">
                <button
                    v-for="f in grainOptions"
                    :key="f"
                    class="mz-tw-btn"
                    :class="{ 'mz-tw-btn--active': tweaks.grain === f }"
                    @click="set('grain', f)"
                >
                    {{ f }}
                </button>
            </div>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Mood bar</div>
            <div class="mz-tw-row">
                <button
                    v-for="f in moodVariants"
                    :key="f"
                    class="mz-tw-btn"
                    :class="{ 'mz-tw-btn--active': tweaks.moodVariant === f }"
                    @click="set('moodVariant', f)"
                >
                    {{ f }}
                </button>
            </div>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Report hero</div>
            <div class="mz-tw-row">
                <button
                    v-for="f in heroLayouts"
                    :key="f"
                    class="mz-tw-btn"
                    :class="{ 'mz-tw-btn--active': tweaks.heroLayout === f }"
                    @click="set('heroLayout', f)"
                >
                    {{ f }}
                </button>
            </div>
        </div>

        <div class="mz-tw-group">
            <div class="mz-tw-label">Discover columns</div>
            <div class="mz-tw-row">
                <button
                    v-for="f in colOptions"
                    :key="f"
                    class="mz-tw-btn"
                    :class="{ 'mz-tw-btn--active': tweaks.discoverCols === f }"
                    @click="set('discoverCols', f)"
                >
                    {{ f }}
                </button>
            </div>
        </div>
    </div>
</template>
