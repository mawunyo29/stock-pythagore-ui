// Définir l'état initial du store
interface SupplierOrderState {
    id: number;
        is_close: boolean;
        supplier_id: number;
        reference: string;
        order_date: string;
        expected_delivery_date: string;
        week_need: number;
        supplier: {
            id: number;
            name: string;
    };
}
interface OrderProducts {
    id: number;
    
    product: {
        id: number;
        label: string;
    }

}


interface Supplier {
    id: number;
    name: string;
}
// Créer le store
export const useSupplierStore = defineStore('supplier',() => {
    const state = ref<SupplierOrderState | {}>({});
    const addFolder = (folder: SupplierOrderState) => {
        state.value = folder as SupplierOrderState;
    };
    const removeFolder = (folder: SupplierOrderState) => {
        state.value = {};

    };
   const fetchSupplierOrderYears =() =>{
    const response = useFetchApi('/api/stock/supplier/orders/years')
    return response
    }
    const fecthSupplierOrdersByYear = ( data: number) =>{
        const response = useFetchApi(`/api/stock/supplier/orders`, {
            method: 'GET',
            query:{  
                year: data
            }
        }
        )
        return response
    }
    const fetchSuppliers =  () => {
        const response = useFetchApi(`/api/stock/suppliers`)
        return response
    }

    const fetchSupplierOrders = async(order:OrderProducts) =>{
        if(!order.id) return await Promise.resolve([])
        const response = await useFetchApi(`/api/stock/orders/${order.id}/products`)
        return response
    }
    const storeSupplierOrder = async (order: any) => {
        const response = await useFetchApi('/api/stock/supplier-orders', {
            method: 'POST',
            body: order
        })
        console.log(response , 'response');
        
        return response
    }
    return {
        state,
        addFolder,
        removeFolder,
        fetchSupplierOrderYears,
        fecthSupplierOrdersByYear,
        fetchSuppliers,
        fetchSupplierOrders,
        storeSupplierOrder
    };
}
    );
