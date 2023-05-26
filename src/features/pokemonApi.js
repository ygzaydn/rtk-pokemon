import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
    endpoints: (builder) => ({
        getPokemonById: builder.query({
            query: (id) => `pokemon/${id}`,
            formResponse: (response) => response.name,
            transformErrorResponse: (response) => response.data,
        }),
    }),
});

export const { useGetPokemonByIdQuery } = pokemonApi;
