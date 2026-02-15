import { configureStore } from '@reduxjs/toolkit'
import { toastReducer } from '@prmichaelsen/pretty-toasts/redux'

export const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
