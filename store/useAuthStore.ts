type User = {
    id: number
    name: string
    email: string
}
type token = {
    token: string
}

export const useAuthStore = defineStore('authConnect', () => {
    const user =  ref<User | null>(null)
    const token = ref<token | null>(null)
    const isAuthentificated = computed(() => {
        return !!user.value
    })
    const authToken = computed(() => {
        return token.value
    })
    
    const fetchUser = async () => {
       const {data} = await useFetchApi('/api/user')
       user.value = data.value as User
    }
    const authentificateHandler = async (requestData: any) => {
        const scrfToken = await useFetchApi('/sanctum/csrf-cookie')
        const login = await useFetchApi('/api/login', {
            method: 'POST',
            body: JSON.stringify(requestData)
        })
        fetchUser()
        return login
    }
    return {
        user,
        authentificateHandler,
        isAuthentificated,
        fetchUser,
        authToken
    }
})