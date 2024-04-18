// Définir l'état initial du store
interface FolderState {
    id: number;
        label: string;
        start_week: string;
        end_week: string;
        product_id: number;
        created_at: string;
        updated_at: string;
        product: {
            id: number;
            label: string;
            created_at: string;
            updated_at: string;
    };
}

interface Product {
    id: number;
    label: string;
}
// Créer le store
export const useFolderStore = defineStore('folder',() => {
    const state = ref<FolderState | {}>({});
    const addFolder = (folder: FolderState) => {
        state.value = folder as FolderState;
    };
    const removeFolder = (folder: FolderState) => {
        state.value = {};

    };
   const fetchFoldersByProduct =(product: Product, data: string) =>{
        // Faire une requête API pour récupérer les dossiers
        console.log(product.id, data);
        
    const response = useFetchApi('/api/planning/get-order-folder-by-product-id', {
        method: 'GET',
        query:{
            product_id: product.id,
            start_week: data
        }
    }
    )
    return response
    }
    const fecthNextWeekFolders = (product: Product, data: string) =>{
        const response = useFetchApi(`/api/planning/get-order-folder-by-product-id/${product.id}`, {
            method: 'GET',
            query:{  
                start_week: data
            }
        }
        )
        return response
    }
    return {
        state,
        addFolder,
        removeFolder,
        fetchFoldersByProduct,
        fecthNextWeekFolders
    };
}
    );
