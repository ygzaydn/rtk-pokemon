import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === REHYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getPokemonById: builder.query({
            query: (id) => `pokemon/${id}`,
            formResponse: (response) => response.name,
            transformErrorResponse: (response) => response.data,
        }),
    }),
});

export const { useGetPokemonByIdQuery } = pokemonApi;
