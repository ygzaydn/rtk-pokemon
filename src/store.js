import { configureStore } from "@reduxjs/toolkit";
import pokemonSlice from "./features/pokemonSlice";
import { pokemonApi } from "./features/pokemonApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { postsApi } from "./features/postsApi";

const store = configureStore({
    reducer: {
        pokemon: pokemonSlice,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(pokemonApi.middleware)
            .concat(postsApi.middleware),
});

setupListeners(store.dispatch);

export default store;
