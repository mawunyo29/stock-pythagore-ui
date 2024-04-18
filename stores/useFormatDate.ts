import { useDayjs  } from "#dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear'
export const useFormatDate = defineStore('formatDate', () => {
    const dayjs = useDayjs()
    dayjs.extend(weekOfYear)
    dayjs.locale('fr',{weekdays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'], weekStart: 1})
    const formatDate = (date: string, format: string) => {
        return dayjs(date).format(format)
    }
    const startOfWeek = (date: string ,options:any) => {
        return dayjs(date).startOf('week').format(options?.needFormat)
    }
    const endOfWeek = (date: string, options:any) => {
        return dayjs(date).endOf('week').format(options?.needFormat)
    }
    const numberOfWeek = (date: string) => {
        return dayjs(date).week()
    }
    return {
        formatDate,
        startOfWeek,
        endOfWeek,
        numberOfWeek
    }
})
