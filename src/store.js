import { configureStore } from "@reduxjs/toolkit";
import pokemonSlice from "./features/pokemonSlice";
import { pokemonApi } from "./features/pokemonApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const store = configureStore({
    reducer: {
        pokemon: pokemonSlice,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
});

setupListeners(store.dispatch);

export default store;
