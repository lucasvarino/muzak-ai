<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Tweaks, DiscoverResult } from '@/lib/muzakData';
import { discoverQuery, discoverExamples, discoverResults } from '@/lib/muzakData';
import Sleeve from './Sleeve.vue';

const props = defineProps<{
    tweaks: Tweaks;
}>();

const emit = defineEmits<{
    open: [item: DiscoverResult];
}>();

const q = ref(discoverQuery);
const searching = ref(false);

const visible = computed(() => discoverResults.slice());

function submit(nextQ?: string) {
    if (typeof nextQ === 'string') q.value = nextQ;
    searching.value = true;
    setTimeout(() => {
        searching.value = false;
    }, 650);
}

const cols = computed(() => props.tweaks.discoverCols);
</script>

<template>
    <div class="mz-view mz-view--discover">
        <div class="mz-discover-top">
            <div class="mz-discover-eyebrow">Semantic search · describe, don't specify</div>
            <form class="mz-discover-form" @submit.prevent="submit()">
                <input
                    v-model="q"
                    class="mz-discover-input"
                    placeholder="Describe what you want to hear…"
                />
                <button type="submit" class="mz-discover-submit">Search</button>
            </form>
            <div class="mz-discover-chips">
                <button
                    v-for="ex in discoverExamples"
                    :key="ex"
                    type="button"
                    class="mz-chip mz-chip--quoted"
                    @click="submit(ex)"
                >
                    <span class="mz-chip-q">"</span>{{ ex }}<span class="mz-chip-q">"</span>
                </button>
            </div>
        </div>

        <div class="mz-discover-body">
            <div class="mz-discover-meta">
                <span>{{ searching ? 'searching…' : `${visible.length} records` }}</span>
                <span class="mz-dm-divider" />
                <span class="mz-dm-query">for <em>"{{ q }}"</em></span>
            </div>
            <div
                class="mz-discover-grid"
                :class="[`mz-discover-grid--c${cols}`, { 'mz-discover-grid--searching': searching }]"
            >
                <button
                    v-for="(r, i) in visible"
                    :key="r.title + r.artist"
                    class="mz-dcard"
                    :style="{ animationDelay: `${i * 40 + 100}ms` }"
                    @click="emit('open', r)"
                >
                    <div class="mz-dcard-art">
                        <Sleeve :cover-id="r.coverId" />
                        <div class="mz-dcard-cta">View full analysis →</div>
                    </div>
                    <div class="mz-dcard-head">
                        <div class="mz-dcard-title">{{ r.title }}</div>
                        <div class="mz-dcard-artist">{{ r.artist }} · {{ r.year }}</div>
                    </div>
                    <div class="mz-dcard-excerpt">{{ r.excerpt }}</div>
                    <div class="mz-dcard-relevance">
                        <span class="mz-rel-label">Relevance</span>
                        <span class="mz-rel-track">
                            <span class="mz-rel-fill" :style="{ width: `${Math.round(r.similarity * 100)}%` }" />
                        </span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
