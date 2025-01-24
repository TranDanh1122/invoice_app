import React from "react";
import { v4 } from "uuid";

type AppActions = { type: "INIT", payload: Invoice[] }
    | { type: "FILTER", payload: string }
    | { type: "EDIT", payload: string }
    | { type: "UPDATEORSAVE", payload: Invoice }
    | { type: "DELETE", payload: string }
    | { type: "PAID", payload: string }
interface AppState {
    editing: string | null,
    data: Invoice[],
    filter: string,
    filteredData: Invoice[]
}
const appReducer = (state: AppState, action: AppActions) => {
    switch (action.type) {
        case "INIT": return { ...state, data: action.payload, filteredData: action.payload }
        case "EDIT": return { ...state, editing: action.payload }
        case "UPDATEORSAVE": {
            let data = state.data
            if (!state.editing) return { ...state, editing: null, data: [...data, { ...action.payload, id: v4().slice(0, 5) }] }
            data = data.map(el => {
                if (el.id === state.editing) return { ...action.payload, id: state.editing }
                return el
            })
            return { ...state, editing: null, data: data }
        }
        case "FILTER": {
            if (state.filter === action.payload) return { ...state, filteredData: state.data, filter: "" }
            const filterData = state.data.filter(el => el.status === action.payload)
            return { ...state, filteredData: filterData, filter: action.payload }
        }
        case "DELETE": return { ...state, data: state.data.filter(el => el.id !== action.payload) }
        case "PAID": {
            const data = state.data.map(el => {
                if (el.id === action.payload) return { ...el, status: "Paid" }
                return el
            })
            return { ...state, data: data }
        }
    }
}
export const AppContext = React.createContext<{ state: AppState, dispatch: React.Dispatch<AppActions> }>({ state: {} as AppState, dispatch: () => { } })
export default function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const initialState: AppState = { editing: null, data: [], filter: "", filteredData: [] };
    const [state, dispatch] = React.useReducer(appReducer, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}