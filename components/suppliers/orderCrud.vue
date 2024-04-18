<script setup>
import { useSupplierStore } from "~/stores/supplier/useSupplierStore";
const { fetchSupplierOrders } = useSupplierStore();
const orders = ref([]);
const load = ref({
    print: false,
});
const is_openModalDeleteOrder = ref(false);
const isOpenSlideToMoveToOrtherOrder = ref(false);
const moveProductToOtherOrder = ref([]);
const currentOrder = ref([]);
const isChecked = ref([]);
const {
    data: orderProducts,
    error,
    execute,
} = await useAsyncData("supplier-orders", async () => {
    const orders = await fetchSupplierOrders(currentOrder.value);
    if (orders) {
        return orders;
    }
    return [];
}, { immediate: false });

const emit = defineEmits([
    "update:closeOrderModal",
    "submitOrder",
    "update:inventoriesOrders",
    "update:selectedOrder",
    "update:is_selected",
    "update:currentSelelectedOrder",
    "update:getOrders",
    "update:suppliersOrdersData",
    "update:isSeletedyear",
    "update:orderIsClosed",
]);
const props = defineProps([
    "canAction",
    "closeOrderModal",
    "product",
    "inventoriesOrders",
    "selectedOrder",
    "is_open",
    "is_selected",
    "currentSelelectedOrder",
    "updateSuppplirers",
    "getOrders",
    "suppliersOrdersData",
    "isSeletedyear",
    "orderIsClosed",
    "isSearch",
]);
const selecteOrderProducts = ref([]);
const openCurrentOrder = async (order) => {
    if (order == undefined) {
        currentOrder.value = [];
        return;
    }
    console.log("order", order);
    currentOrder.value = order;
    emit("update:currentSelelectedOrder", currentOrder.value);
    await execute();
};

const closeOrder = () => {
    emit("update:closeOrderModal", false);
};
const isSeletedyear = computed({
    get() {
        return props.isSeletedyear;
    },
    set(value) {
        localStorage.setItem("activeDate", value);
        emit("update:isSeletedyear", isSeletedyear.value);
    },
});
const updateCurrentyear = () => {
    emit("update:isSeletedyear", isSeletedyear.value);
};
onMounted(() => {
    isSeletedyear.value = localStorage.getItem("activeDate");
});
onUnmounted(() => {
    isSeletedyear.value = null;
});
const printdoc = async (reference, type) => {
    load.print = true;
    const response = await printOrder(reference, type);
    if (response) {
        load.print = false;
    }
};
const openModelTodeleteOrder = () => {
    is_openModalDeleteOrder = !is_openModalDeleteOrder;
};

const deleteOrder = async (order) => {
    const response = await deleteSupplierOrder(order);
    if (response) {
        emit("update:suppliersOrdersData", response);
        is_openModalDeleteOrder = false;
    }
};

const orderIsClosed = async (order) => {
    const response = await closeSupplierOrder(order);
    if (response) {
        emit("update:orderIsClosed", response);
    }
};

const deleteProduct = async (product) => {
    const response = await deleteProductFromOrder(product);
    if (response) {
        emit("update:suppliersOrdersData", response);
    }
};

const moveToOtherOrder = async () => {
    // const response = await moveProductToOtherOrder(
    //     currentOrder.value,
    //     selecteOrderProducts.value
    // );
    // if (response) {
    //     emit("update:suppliersOrdersData", response);
    // }
};

const cancelMoveToOtherOrder = () => {
    // selecteOrderProducts.value = [];
    isChecked.value.map((item) => {
        item.checked = false;
    });
    selecteOrderProducts.value = [];
    isOpenSlideToMoveToOrtherOrder.value = false;
};


const checkToMoveToOtherOrder = (product, event) => {
    if (event.target.checked) {
        selecteOrderProducts.value.push(product);
    } else {
        selecteOrderProducts.value = selecteOrderProducts.value.filter(
            (item) => item.id !== product.id
        );
    }
};

const updateOrderQty = async (product, value, type, action) => {
    //   const response = await updateOrderProductQty(product, value, type, action);
    //   if (response) {
    //     emit("update:suppliersOrdersData", response);
    //   }
    console.log("product", product);
};

const selectInputContent = (event) => {
    event.target.select();
};

const search = ref("");
const searchProduct = ref("");
const searchValue = computed(() => search.value);
const query = reactive({
    search: search.value,
});
const isValidateOrderQtyOrOrderDeliveryQty = (product, type) => {
    const { order_qty, delivery_qty } = product.pivot;

    //check if is not numerci value
    if (isNaN(delivery_qty && type == "delivery_qty")) {
        errorsMessages.value =
            "Veuillez saisir une valeur numérique et différente de 0";
        return false;
    }
    if (type == "order_qty" && isNaN(order_qty)) {
        errorsMessages.value = "Veuillez saisir une valeur numérique ";
        return false;
    }
    return true;
};
const delivery_quantity = ref([]);
watch(
    () => delivery_quantity.value,
    (newValue, oldValue) => {
        if (newValue === 0 && typeof newValue === "number") {
            return false;
        }
    }
);
const totalQty = computed(() => {
    let total_D = 0;
    let total_DN = 0;
    let total_Qty_p = 0;
    let total_Qty_n = 0;
    let count_isClosed = 0;
    orderProducts.value.forEach((product) => {
        const { pivot, is_close, week_need } = product;
        if (pivot?.delivery_qty > 0) {
            total_D += parseFloat(pivot.delivery_qty);
        }
        if (pivot?.delivery_qty < 0) {
            total_DN += parseFloat(pivot.delivery_qty);
        }
        if (pivot?.order_qty > 0) {
            total_Qty_p += parseFloat(pivot.order_qty);
        } else {
            total_Qty_n += parseFloat(pivot.order_qty);
        }
    });
    return {
        totalDeliveryQty: total_D,
        totalDeliveryQtyN: -total_DN,
        totalQtyP: total_Qty_p,
        totalQtyN: -total_Qty_n,
        count_isClosed: count_isClosed,
    };
});
const updateOrder = async (order) => {
    console.log("order", order);
};
</script>

<template>
    <div class="w-ful h-full">
        <div class="flex flex-row p-4 justify-items-stretch">
            <slot @update:openCurrentOrder="openCurrentOrder" :openCurrentOrder="openCurrentOrder" @input="getOrders"
                :isSeletedyear="isSeletedyear" @update:orderIsClosed="orderIsClosed"
                :suppliersOrdersData="suppliersOrdersData" />
            <div class="relative basis-4/5" v-if="currentOrder.id">
                <div class="relative ">
                    <div class="sticky w-full">
                        <div class="flex items-center justify-between px-3 py-1">
                            <div class="flex items-center gap-2">
                                <div class="flex flex-col">
                                    <div class="flex items-center space-x-1">
                                        <label for="searchproduct" value="Recherche de produit" class="text-xxs">
                                            Recherche de produit
                                        </label>
                                        <!-- <div v-if="loadingProducts">
                                        <Loader size="4" />
                                    </div> -->
                                    </div>
                                    <!-- <BreezeInput type="search" name="search" id="searchproduct" v-model="searchProduct"
                                    @input="search()" autocomplete="off"
                                    :class="'px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none'" /> -->
                                </div>
                                <div class="flex flex-col">
                                    <label for="order_date" value="livraison" class="text-xxs">
                                        Date de livraison prévue
                                    </label>
                                    <input type="date" name="date_order" id="order_date" v-model="currentOrder.expected_delivery_date
                                        " @blur="updateOrder(currentOrder)"
                                        class="px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none"
                                        :class="'border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'" />
                                </div>
                                <!-- <h2 class="text-base first-letter:capitalize">{{ currentOrder.reference }}</h2> -->
                                <div class="flex flex-col">
                                    <label for="order_reference" value="Référence" :class="'text-xxs'">
                                        Référence
                                    </label>
                                    <input type="text" v-model="currentOrder.reference"
                                        class="px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none"
                                        id="order_reference" @blur="updateOrder(currentOrder)" />
                                </div>
                            </div>
                            <div class="text-xs">
                                <!-- <p>Date de la commande:{{ moment(currentOrder.order_date).format("DD/MM/YYYY") }}</p> -->
                            </div>
                        </div>
                        <div class="flex flex-row w-full">
                            <div class="w-full">
                                <div class="flex flex-row justify-between w-full p-2 space-y-2 border rounded">
                                    <!-- <div class="absolute flex flex-col gap-2 p-1 -mt-4 -ml-2 bg-white" :class="searchProduct.length > 1
                                    ? ' basis-4/12 z-9999'
                                    : 'hidden'
                                    ">
                                    <ul v-if="searchProduct.length > 1"
                                        class="items-center gap-2 mt-2 overflow-y-auto text-justify bg-white top-4"
                                        :class="searchProducts.length > 4
                                            ? 'max-h-[75vh] w-96'
                                            : ''
                                            ">
                                        <li v-for="(
                                                product, productIndex
                                            ) in searchProducts" :key="productIndex" @click="
                                                addProductToCurrentOrder(
                                                    product,
                                                    $event,
                                                    'order_qty'
                                                )
                                                "
                                            class="flex flex-col justify-center w-full h-8 m-0 font-medium text-left border border-b-0 border-gray-200 rounded cursor-pointer text-xxs focus:ring-4">
                                            <div class="flex items-center">
                                                <span class="text-xs font-medium">
                                                    {{ product.label }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div> -->
                                    <div class="flex flex-col w-full ">
                                        <div class="flex justify-center w-full h-full p-1 -mt-3 -mr-2">
                                            <div class="w-full overflow-hidden" :class="orderProducts.length > 6
                                                ? 'max-h-[80vh]  '
                                                : ''
                                                ">
                                                <div class="sticky top-0 w-full h-full overflow-hidden" :class="orderProducts.length > 6
                                                    ? 'overflow-y-auto '
                                                    : ''
                                                    ">
                                                    <div class="py-5">
                                                        <div class="flex justify-between mb-2">
                                                            <div class="flex justify-center space-x-2">
                                                                <button class="btn btn-primary" @click="
                                                                    printdoc(
                                                                        currentOrder.reference,
                                                                        'save'
                                                                    )
                                                                    ">
                                                                    <!-- <div
                                                                    class="flex flex-row items-center justify-between w-full gap-2">
                                                                    <Loader size="5" v-if="
                                                                        load.print
                                                                    " />
                                                                    <Save class="w-5 h-5" v-else />
                                                                </div> -->
                                                                </button>
                                                                <button class="btn btn-primary" @click="
                                                                    printdoc(
                                                                        currentOrder.reference,
                                                                        'print'
                                                                    )
                                                                    ">
                                                                    <!-- <div
                                                                    class="flex flex-row items-center justify-between w-full gap-2">
                                                                    <Loader size="5" v-if="
                                                                        load.print
                                                                    " />
                                                                    <Printer class="w-5 h-5" v-else />
                                                                </div> -->
                                                                </button>
                                                                <div>
                                                                    <button class="btn btn-danger" @click="
                                                                        openModelTodeleteOrder()
                                                                        ">
                                                                        <!-- <X class="w-5 h-5" /> -->
                                                                    </button>
                                                                    <template v-if="
                                                                        error
                                                                    ">
                                                                        <div class="relative z-30 w-full rounded-sm">
                                                                            <p class="absolute text-red-600 text-xxs">
                                                                                {{
                                                                                    error
                                                                                }}
                                                                            </p>
                                                                        </div>
                                                                    </template>
                                                                </div>
                                                            </div>
                                                            <div id="toast-message-cta_"
                                                                class="absolute left-0 right-0 z-50 items-center w-full max-w-xs p-4 mb-10 text-gray-500 bg-white rounded-lg shadow"
                                                                :class="is_openModalDeleteOrder
                                                                    ? 'flex'
                                                                    : 'hidden'
                                                                    " role="alert">
                                                                <div class="flex bg-white">
                                                                    <div class="ml-3 text-sm font-normal">
                                                                        <span
                                                                            class="mb-1 text-sm font-semibold text-red-600">Vous
                                                                            êtes sur
                                                                            le point
                                                                            de
                                                                            supprimer
                                                                            la
                                                                            commande</span>
                                                                        <div class="mb-2 text-base font-normal">
                                                                            {{
                                                                                currentOrder.reference
                                                                            }}
                                                                        </div>
                                                                        <button
                                                                            class="flex items-center justify-center w-full text-center btn btn-primary"
                                                                            @click="
                                                                                deleteOrder(
                                                                                    currentOrder
                                                                                )
                                                                                ">
                                                                            confirmer
                                                                        </button>
                                                                        <!-- <button @click="openModelTodeleteOrder()">Annuler</button> -->
                                                                    </div>
                                                                    <button type="button" @click="
                                                                        openModelTodeleteOrder()
                                                                        "
                                                                        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8"
                                                                        data-dismiss-target="#toast-message-cta"
                                                                        aria-label="Close">
                                                                        <span class="sr-only">Close</span>
                                                                        <svg aria-hidden="true" class="w-5 h-5"
                                                                            fill="currentColor" viewBox="0 0 20 20"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd"
                                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                clip-rule="evenodd"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <template v-if="
                                                                orderProducts.length >
                                                                0
                                                            ">
                                                                <div class="flex justify-between">
                                                                    <button class="btn btn-primary" @click="
                                                                        closeOrder()
                                                                        ">
                                                                        {{
                                                                            currentOrder.is_close
                                                                                ? "Décloturé"
                                                                                : "Cloturé"
                                                                        }}
                                                                    </button>
                                                                </div>
                                                            </template>
                                                        </div>
                                                        <template v-if="
                                                            orderProducts.length >
                                                            0
                                                        ">
                                                            <ul
                                                                class="w-full text-sm font-medium bg-white rounded-lg border-gray-s0 borde text-xxsr text-slate-600 print:border-none">
                                                                <li
                                                                    class="w-full px-4 py-1 font-medium text-left border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                                                    <div class="flex justify-end space-x-2" :class="selecteOrderProducts?.length >
                                                                        0
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0'
                                                                        ">
                                                                        <button
                                                                            class="flex items-center space-x-2 small-btn btn-primary"
                                                                            :disabled="selecteOrderProducts.length ==
                                                                                0
                                                                                " @click="
                                                                                    moveToOtherOrder()
                                                                                    ">
                                                                            <!-- <BringToFront size="12" /> -->
                                                                            <p>
                                                                                Déplacer
                                                                            </p>
                                                                        </button>

                                                                        <button
                                                                            class="flex items-center space-x-2 small-btn btn-danger"
                                                                            :disabled="selecteOrderProducts.length ==
                                                                                0
                                                                                " @click="
                                                                                    cancelMoveToOtherOrder()
                                                                                    ">
                                                                            <!-- <X size="12" /> -->
                                                                            <p>
                                                                                Annuler
                                                                            </p>
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div class="relative overflow-x-auto" v-if="
                                                                        (currentOrder.id ||
                                                                            currentSelelectedOrder
                                                                                .orders
                                                                                ?.length ==
                                                                            1) &&
                                                                        orderProducts.length >
                                                                        0
                                                                    ">
                                                                        <table
                                                                            class="w-full text-sm text-left text-blue-100">
                                                                            <thead
                                                                                class="text-xs text-gray-700 uppercase">
                                                                                <tr
                                                                                    class="w-full px-4 py-1 font-medium text-left border-b">
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        Date
                                                                                        Com
                                                                                    </th>
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        Référence
                                                                                        founisseur
                                                                                    </th>
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        COMMENTAIRE
                                                                                        PUBLIC
                                                                                    </th>
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        Qté
                                                                                        commandée
                                                                                    </th>
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        Qté
                                                                                        reçue
                                                                                    </th>
                                                                                    <th scope="col"
                                                                                        class="py-3 text-center">
                                                                                        COMMENTAIRE
                                                                                        PRIVE
                                                                                    </th>
                                                                                    <th scope="col" colspan="2"
                                                                                        class="justify-center py-3 text-center">
                                                                                        <span
                                                                                            class="sr-only">Action</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr v-for="(
                                                                                    product,
                                                                                        index
                                                                                ) in orderProducts" :key="product.id +
                                                                                    `${index}product_`
                                                                                    "
                                                                                    class="w-full px-4 py-1 font-medium text-left bg-gray-300 border-b first:sticky first:left-0 first:top-0 group odd:bg-slate-200 even:bg-slate-100 group-odd:bg-gray-600">
                                                                                    <th scope="row"
                                                                                        class="px-6 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <!-- {{product.pivot.initial_order_date &&moment(currentOrder.expected_delivery_date).format("DD/MM/YY") !=moment(
                                                                                                product
                                                                                                    .pivot
                                                                                                    .initial_order_date)?.format(
                                                                                                "DD/MM/YY")? moment(
                                                                                                product
                                                                                                    .pivot
                                                                                                    .initial_order_date)?.format(
                                                                                                "DD/MM/YY"): ""
                                                                                    }} -->
                                                                                        date
                                                                                    </th>
                                                                                    <th scope="row"
                                                                                        class="px-6 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        {{
                                                                                            product.label
                                                                                        }}
                                                                                    </th>
                                                                                    <!-- <td
																						class="px-6 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
																						{{ product.pivot.order_comment }}
																					</td> -->
                                                                                    <td
                                                                                        class="px-6 py-1 text-xs font-medium leading-normal text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <template v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <div class="w-4/5">
                                                                                                <p
                                                                                                    class="whitespace-pre-wrap hyphens-auto">
                                                                                                    {{
                                                                                                        product
                                                                                                            .pivot
                                                                                                            .order_comment
                                                                                                    }}
                                                                                                </p>
                                                                                            </div>
                                                                                        </template>
                                                                                        <template v-else>
                                                                                            <textarea :aria-disabled="currentOrder.is_close
                                                                                                " :disabled="currentOrder.is_close
                                                                                                    " :id="'order_comment' +
                                                                                                        product.id +
                                                                                                        `${index}`
                                                                                                        " cols="30"
                                                                                                rows="3"
                                                                                                class="w-full p-1 rounded"
                                                                                                ref="order_comment"
                                                                                                v-model="product
                                                                                                    .pivot
                                                                                                    .order_comment
                                                                                                    " @blur="
                                                                                                        updateOrderQty(
                                                                                                            product,
                                                                                                            product
                                                                                                                .pivot
                                                                                                                .order_comment,
                                                                                                            'order_comment',
                                                                                                            'update'
                                                                                                        )
                                                                                                        " />
                                                                                        </template>
                                                                                    </td>

                                                                                    <td
                                                                                        class="flex-1 px-6 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <div v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <p
                                                                                                class="px-2 ml-8 text-left">
                                                                                                {{
                                                                                                    product
                                                                                                        .pivot
                                                                                                        .order_qty
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div v-else
                                                                                            class="flex justify-center">
                                                                                            <template v-if="
                                                                                                !isValidateOrderQtyOrOrderDeliveryQty(
                                                                                                    product,
                                                                                                    'order_qty'
                                                                                                )
                                                                                            ">
                                                                                                <div
                                                                                                    class="relative max-w-[80px] mb-3 flex justify-center items-center text-center">
                                                                                                    <p
                                                                                                        class="absolute z-50 leading-normal text-red-600 bg-white rounded-sm text-xxs">
                                                                                                        {{
                                                                                                            errorsMessages
                                                                                                        }}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </template>
                                                                                            <input type="text"
                                                                                                :aria-disabled="currentOrder.is_close
                                                                                                    " :disabled="currentOrder.is_close
                                                                                                        "
                                                                                                :class="'w-20 border border-gray-500 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'"
                                                                                                ref="order_quantity_order"
                                                                                                v-model="product
                                                                                                    .pivot
                                                                                                    .order_qty
                                                                                                    " :id="'order_quantity_order_' +
                                                                                                        product.id +
                                                                                                        `${index}`
                                                                                                        " @click="selectInputContent
                                                                                                            " @change="
                                                                                                                updateOrderQty(
                                                                                                                    product,
                                                                                                                    product
                                                                                                                        .pivot
                                                                                                                        .order_qty,
                                                                                                                    'order_qty',
                                                                                                                    'update'
                                                                                                                )
                                                                                                                " />
                                                                                        </div>
                                                                                    </td>

                                                                                    <td
                                                                                        class="px-6 py-1 text-xs font-medium bg-gray-500 text-slate-600 whitespace-nowrap bg-inherit">
                                                                                        <div v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <p
                                                                                                class="px-2 ml-8 text-left">
                                                                                                {{
                                                                                                    product
                                                                                                        .pivot
                                                                                                        .delivery_qty
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div v-else
                                                                                            class="flex justify-center">
                                                                                            <template v-if="
                                                                                                !isValidateOrderQtyOrOrderDeliveryQty(
                                                                                                    product,
                                                                                                    'delivery_qty'
                                                                                                )
                                                                                            ">
                                                                                                <div
                                                                                                    class="relative max-w-[80px] mb-3 flex justify-center items-center text-center">
                                                                                                    <p
                                                                                                        class="absolute z-50 leading-normal text-red-600 bg-white rounded-sm text-xxs">
                                                                                                        {{
                                                                                                            errorsMessages
                                                                                                        }}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </template>
                                                                                            <input type="text"
                                                                                                :aria-disabled="currentOrder.is_close
                                                                                                    " :disabled="currentOrder.is_close
                                                                                                        " v-model="product
                                                                                                            .pivot
                                                                                                            .delivery_qty
                                                                                                            " :id="'delivery_quantity' +
                                                                                                                product.id +
                                                                                                                `${index}`
                                                                                                                " :ref="delivery_quantity[
                                                                                                                    index
                                                                                                                ]
                                                                                                                    "
                                                                                                class="w-20 border border-gray-500 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                                                :class="!isValidateOrderQtyOrOrderDeliveryQty(
                                                                                                    product,
                                                                                                    'delivery_qty'
                                                                                                )
                                                                                                    ? 'border border-y-red-500 w-20 ring ring-red-500 focus:ring-red-400'
                                                                                                    : ''
                                                                                                    " @click="selectInputContent
                                                                                                        " @change="
                                                                                                            updateOrderQty(
                                                                                                                product,
                                                                                                                product
                                                                                                                    .pivot
                                                                                                                    .delivery_qty,
                                                                                                                'delivery_qty',
                                                                                                                'update'
                                                                                                            )
                                                                                                            " />
                                                                                        </div>
                                                                                    </td>

                                                                                    <td
                                                                                        class="px-6 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <template v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <p
                                                                                                class="ml-8 leading-normal text-left text-px-2">
                                                                                                {{
                                                                                                    product
                                                                                                        .pivot
                                                                                                        .delivery_comment
                                                                                                }}
                                                                                            </p>
                                                                                        </template>
                                                                                        <template v-else>
                                                                                            <textarea :aria-disabled="currentOrder.is_close
                                                                                                " :disabled="currentOrder.is_close
                                                                                                    " :id="'p_delivery_comment' +
                                                                                                        product.id +
                                                                                                        `${index}`
                                                                                                        " cols="30"
                                                                                                rows="3"
                                                                                                class="w-full p-1 rounded"
                                                                                                ref="p_delivery_comment"
                                                                                                v-model="product
                                                                                                    .pivot
                                                                                                    .delivery_comment
                                                                                                    " @blur="
                                                                                                        updateOrderQty(
                                                                                                            product,
                                                                                                            product
                                                                                                                .pivot
                                                                                                                .delivery_comment,
                                                                                                            'delivery_comment',
                                                                                                            'update'
                                                                                                        )
                                                                                                        " />
                                                                                        </template>
                                                                                    </td>

                                                                                    <td
                                                                                        class="px-2 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <template v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <p
                                                                                                class="ml-8 leading-normal text-left text-px-2">
                                                                                            </p>
                                                                                        </template>
                                                                                        <template v-else>
                                                                                            <div
                                                                                                class="flex items-center justify-center w-full transition duration-300 ease-in-out">
                                                                                                <Icon
                                                                                                    name="i-heroicons-outline-trash"
                                                                                                    class="flex justify-center w-5 h-5 text-red-500"
                                                                                                    @click="
                                                                                                        deleteProduct(
                                                                                                            product
                                                                                                        )
                                                                                                        " />
                                                                                            </div>
                                                                                        </template>
                                                                                    </td>
                                                                                    <td
                                                                                        class="px-2 py-1 text-xs font-medium text-slate-600 whitespace-nowrap bg-gray-50 bg-inherit">
                                                                                        <template v-if="
                                                                                            currentOrder.is_close
                                                                                        ">
                                                                                            <p
                                                                                                class="ml-8 leading-normal text-left text-px-2">
                                                                                            </p>
                                                                                        </template>
                                                                                        <template v-else>
                                                                                            <div
                                                                                                class="flex items-center pl-3">
                                                                                                <input id="vue-checkbox"
                                                                                                    @click="
                                                                                                        checkToMoveToOtherOrder(
                                                                                                            product,
                                                                                                            $event
                                                                                                        )
                                                                                                        "
                                                                                                    ref="isChecked"
                                                                                                    type="checkbox"
                                                                                                    :value="product
                                                                                                        " :checked="isChecked[
                                                                                                            product
                                                                                                                .id
                                                                                                        ]
                                                                                                            "
                                                                                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                                            </div>
                                                                                        </template>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                            <tfoot
                                                                                class="w-full px-4 py-1 font-medium text-left">
                                                                                <tr>
                                                                                    <td scope="col" colspan="3"
                                                                                        class="px-6 py-1 text-xs font-medium text-gray-900">
                                                                                        Total
                                                                                    </td>
                                                                                    <td
                                                                                        class="py-1 text-xs font-medium text-center text-gray-900">
                                                                                        <p>
                                                                                            {{
                                                                                                totalQty.totalQtyP
                                                                                            }}
                                                                                        </p>
                                                                                    </td>
                                                                                    <td
                                                                                        class="py-1 text-xs font-medium text-center text-gray-900">
                                                                                        <p class="">
                                                                                            {{
                                                                                                totalQty.totalDeliveryQty
                                                                                            }}
                                                                                        </p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </div>
                                                                </li>
                                                                <div class="flex justify-end mr-3 space-x-2" :class="selecteOrderProducts?.length >
                                                                    0
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                                    ">
                                                                    <button
                                                                        class="flex items-center space-x-2 small-btn btn-primary"
                                                                        :disabled="selecteOrderProducts.length ==
                                                                            0
                                                                            " @click="moveToOtherOrder
                                                                                ">
                                                                        <!-- <BringToFront size="12" /> -->
                                                                        <p>
                                                                            Déplacer
                                                                        </p>
                                                                    </button>

                                                                    <button
                                                                        class="flex items-center space-x-2 small-btn btn-danger"
                                                                        :disabled="selecteOrderProducts.length ==
                                                                            0
                                                                            " @click="cancelMoveToOtherOrder
                                                                                ">
                                                                        <!-- <X size="12" /> -->
                                                                        <p>
                                                                            Annuler
                                                                        </p>
                                                                    </button>
                                                                </div>
                                                            </ul>
                                                        </template>
                                                        <template v-else>
                                                            <div
                                                                class="flex items-center justify-center w-full h-full p-6">
                                                                <p class="text-4xl font-semibold text-gray-500">
                                                                    Aucun produit
                                                                </p>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
