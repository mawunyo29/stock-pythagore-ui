interface ProductState {
    id: number;
    label: string;
    fintion:{
        id: number;
        label: string;
    },
    category:{
        id: number;
        label: string;
    }, 
}

export const useProductStore = defineStore('product', () => {
    const state = ref<ProductState | {}>({});
    const addProduct = (product: ProductState) => {
        state.value = product as ProductState;
    };
    const removeProduct = (product: ProductState) => {
        state.value = {};

    };
    const fetchProducts = (query:any) => {
        const response = useFetchApi('/api/stock/products',
            {
                method: 'GET',
                query: query
            }
        ) as any
        state.value = response.data as ProductState[]
        return response
    }
    const fetchProduct = (id: number) => {
        const response = useFetchApi(`/api/stock/products/${id}`)
        return response
    }
    const createProduct = (product: ProductState) => {
        const response = useFetchApi('/api/stock/products', {
            method: 'POST',
            body: product
        })
        return response
    }
    const updateProduct = (product: ProductState) => {
        const response = useFetchApi(`/api/stock/products/${product.id}`, {
            method: 'PUT',
            body: product
        })
        return response
    }
    const deleteProduct = (product: ProductState) => {
        const response = useFetchApi(`/api/stock/products/${product.id}`, {
            method: 'DELETE',
        })
        return response
    }
    return {
        state,
        addProduct,
        removeProduct,
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct
    }
})