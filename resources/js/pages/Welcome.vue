<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { Head } from '@inertiajs/vue3';
import type { Tweaks, DiscoverResult, SimilarItem } from '@/lib/muzakData';
import { defaultTweaks } from '@/lib/muzakData';
import Nav from '@/components/muzak/Nav.vue';
import AnalyzeView from '@/components/muzak/AnalyzeView.vue';
import DiscoverView from '@/components/muzak/DiscoverView.vue';
import TweaksPanel from '@/components/muzak/TweaksPanel.vue';

type View = 'analyze' | 'discover';

const view = ref<View>((localStorage.getItem('muzak_view') as View) || 'analyze');
const tweaks = ref<Tweaks>({ ...defaultTweaks });
const tweaksPanelVisible = ref(false);

const analyzeViewRef = ref<InstanceType<typeof AnalyzeView> | null>(null);

watch(view, (v) => localStorage.setItem('muzak_view', v));

const accentMap: Record<Tweaks['accent'], string> = {
    amber: '#f59e0b',
    gold: '#c9a84c',
    ivory: '#e8dcc4',
    ember: '#b84a1a',
};

const serifMap: Record<Tweaks['serif'], string> = {
    playfair: "'Playfair Display', 'GT Super Display', Georgia, serif",
    instrument: "'Instrument Serif', 'Playfair Display', Georgia, serif",
    fraunces: "'Fraunces', 'Playfair Display', Georgia, serif",
};

watchEffect(() => {
    const root = document.querySelector('.muzak-root') as HTMLElement | null;
    if (!root) return;
    root.style.setProperty('--mz-accent', accentMap[tweaks.value.accent] ?? accentMap.ember);
    root.style.setProperty('--mz-serif', serifMap[tweaks.value.serif] ?? serifMap.playfair);
});

function handleOpenSimilar(item: SimilarItem) {
    view.value = 'analyze';
    setTimeout(() => {
        analyzeViewRef.value?.startFastAnalyze(`open.spotify.com/album/${item.coverId}`, 0.45);
    }, 50);
}

function handleDiscoverOpen(item: DiscoverResult) {
    view.value = 'analyze';
    setTimeout(() => {
        analyzeViewRef.value?.startFastAnalyze(`open.spotify.com/album/${item.coverId}`, 0.45);
    }, 50);
}

function toggleTweaks() {
    tweaksPanelVisible.value = !tweaksPanelVisible.value;
}

// Keyboard shortcut: T to toggle tweaks
function onKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 't' || e.key === 'T') toggleTweaks();
}
</script>

<template>
    <Head title="Muzak — Music Intelligence" />

    <div class="muzak-root" @keydown="onKeydown" tabindex="-1">
        <!-- Grain overlay -->
        <div
            class="mz-grain"
            :class="`mz-grain--${tweaks.grain}`"
            aria-hidden="true"
        />

        <Nav :view="view" @update:view="(v) => (view = v as View)" />

        <main class="mz-main">
            <AnalyzeView
                v-if="view === 'analyze'"
                ref="analyzeViewRef"
                :tweaks="tweaks"
                @open-similar="handleOpenSimilar"
            />
            <DiscoverView
                v-else
                :tweaks="tweaks"
                @open="handleDiscoverOpen"
            />
        </main>

        <!-- Tweaks toggle button -->
        <button
            class="mz-tweaks-toggle"
            :class="{ 'mz-tweaks-toggle--active': tweaksPanelVisible }"
            aria-label="Toggle tweaks panel"
            @click="toggleTweaks"
        >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4">
                <circle cx="8" cy="8" r="2.5" />
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41" />
            </svg>
            Tweaks
        </button>

        <TweaksPanel
            :tweaks="tweaks"
            :visible="tweaksPanelVisible"
            @update:tweaks="tweaks = $event"
        />
    </div>
</template>

<style>
/* Override body background for the Muzak page */
body:has(.muzak-root) {
    background: #0a0a0a;
    margin: 0;
    padding: 0;
}
</style>

<style scoped>
.mz-tweaks-toggle {
    position: fixed;
    left: 18px;
    bottom: 18px;
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    font-family: var(--mz-mono);
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mz-ink-dimmer);
    border: 1px solid var(--mz-line) !important;
    border-radius: 2px;
    background: rgba(14, 14, 14, 0.85);
    backdrop-filter: blur(6px);
    transition: color 0.15s, border-color 0.15s;
    cursor: pointer;
}

.mz-tweaks-toggle:hover,
.mz-tweaks-toggle--active {
    color: var(--mz-ink);
    border-color: var(--mz-line-2) !important;
}
</style>
