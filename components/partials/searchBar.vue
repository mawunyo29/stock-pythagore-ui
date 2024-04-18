<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        default: "Rechercher...",
    },
    debounce: {
        type: Number,
        default: 300,
        required: false,
    },
    clearable: {
        type: Boolean,
        default: true,
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "md",
    },
    icon: {
        type: String,
        default: "search",
    },
    iconSize: {
        type: String,
        default: "sm",
    },
    iconColor: {
        type: String,
        default: "gray",
    },
    iconPosition: {
        type: String,
        default: "left",
    },
    dataToFilter: {
        type: Object,
        default: () => [],
    },

});
const emit = defineEmits(["update:modelValue", "update:datafilter"]);
const search = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit("update:modelValue", value);
    },
})
const debouncedSearch = ref("");
const isFocused = ref(false);
const isClearable = computed(() => props.clearable && search.value.length > 0);
const isDisabled = computed(() => props.disabled);
const isIconLeft = computed(() => props.iconPosition === "left");
const isIconRight = computed(() => props.iconPosition === "right");
const isIconOnly = computed(() => props.iconPosition === "only");
const isIconClear = computed(() => props.icon === "clear");
const isIconSearch = computed(() => props.icon === "search");
const isIconLoading = computed(() => props.icon === "loading");
const isIcon = computed(() => isIconClear || isIconSearch || isIconLoading);
// const dataToFilter = computed({
//     get: () => props.dataToFilter,
//     set: (value) => {
//         props.dataToFilter = value;
//     },
// });
const isIconColor = computed(() => {
    if (isIconClear) {
        return "red";
    }
    if (isIconSearch) {
        return "gray";
    }
    if (isIconLoading) {
        return "blue";
    }
});
const isIconSize = computed(() => {
    if (isIconClear) {
        return "sm";
    }
    if (isIconSearch) {
        return "sm";
    }
    if (isIconLoading) {
        return "sm";
    }
});
const isIconLoadingSize = computed(() => {
    if (isIconLoading) {
        return "md";
    }
});
const isIconLoadingColor = computed(() => {
    if (isIconLoading) {
        return "blue";
    }
});
const isIconLoadingPosition = computed(() => {
    if (isIconLoading) {
        return "right";
    }
});
const isIconLoadingSpin = computed(() => {
    if (isIconLoading) {
        return true;
    }
});
const isIconLoadingSpinReverse = computed(() => {
    if (isIconLoading) {
        return false;
    }
});
const isIconLoadingSpinSize = computed(() => {
    if (isIconLoading) {
        return "sm";
    }
});
const isIconLoadingSpinColor = computed(() => {
    if (isIconLoading) {
        return "blue";
    }
});
const isIconLoadingSpinDuration = computed(() => {
    if (isIconLoading) {
        return "1s";
    }
});
const isIconLoadingSpinTiming = computed(() => {
    if (isIconLoading) {
        return "linear";
    }
});
const isIconLoadingSpinDelay = computed(() => {
    if (isIconLoading) {
        return "0s";
    }
});
const isIconLoadingSpinIteration = computed(() => {
    if (isIconLoading) {
        return "infinite";
    }
});
const isIconLoadingSpinDirection = computed(() => {
    if (isIconLoading) {
        return "normal";
    }
});
const isIconLoadingSpinFill = computed(() => {
    if (isIconLoading) {
        return "both";
    }
});
const isIconLoadingSpinState = computed(() => {
    if (isIconLoading) {
        return "running";
    }
});
const isIconLoadingSpinBorder = computed(() => {
    if (isIconLoading) {
        return "solid";
    }
});
const isIconLoadingSpinRadius = computed(() => {
    if (isIconLoading) {
        return "full";
    }
});
const isIconLoadingSpinShadow = computed(() => {
    if (isIconLoading) {
        return "md";
    }
});

const handleFocus = () => {
    isFocused.value = true;
};
const handleBlur = () => {
    isFocused.value = false;
};
const handleInput = (event) => {
    search.value = event.target.value;
};
const handleClear = () => {
    search.value = "";
};
const handleKeydown = (event) => {
    if (event.key === "Escape") {
        search.value = "";
    }
};

const debounces = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

const handleDebounce = debounces(() => {
    debouncedSearch.value = search.value;
    const searchEvent = search.value;
    emit("update:modelValue", search.value);

    const dataResult = props.dataToFilter?.filter((item) => {
        return Object.values(item).some((value) => {
            return String(value).toLowerCase().includes(search.value.toLowerCase());
        });
    });

    emit("update:datafilter", { dataResult, searchEvent });
}, props.debounce);

watch(search, handleDebounce);




</script>
<template>
    <div class="relative max-w-md mx-auto">
        <div class="flex items-center justify-between w-full p-4">
            <div class="relative flex items-center w-full">
                <input v-model="search" @focus="handleFocus" @blur="handleBlur" @input="handleInput"
                    @keydown="handleKeydown" :placeholder="placeholder" :disabled="isDisabled" :autofocus="autofocus"
                    :class="{ 'pl-10': isIconLeft, 'pr-10': isIconRight }"
                    class="w-full  px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-primary focus:border-primary focus:ring-opacity-50" />
            </div>
        </div>
        <div v-if="isClearable" class="absolute inset-y-0 right-0 flex items-center pr-8">
            <button @click="handleClear" type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg v-if="isClearable" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped></style>