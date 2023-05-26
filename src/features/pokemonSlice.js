import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    pokemons: [],
    selectedPokemon: {},
    loading: false,
    message: "",
};

const fetchPokemon = createAsyncThunk(
    "pokemon/fetchRandomPokemon",
    async (number) => {
        const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${number}/`
        );
        return response.data;
    }
);

const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        selectPokemon: (state, action) => {
            Object.assign(state.selectedPokemon, action.payload);
        },
        clearSelection: (state) => {
            state.selectedPokemon = {};
        },
        removePokemonFromList: (state, action) => {
            const pokemons = state.pokemons.filter(
                (el) => el.id !== action.payload
            );
            state.pokemons = pokemons;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPokemon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPokemon.rejected, (state) => {
            state.message = "Error during pokemon getting";
            state.loading = false;
        });
        builder.addCase(fetchPokemon.fulfilled, (state, action) => {
            state.loading = false;
            if (state.pokemons.find((el) => el.id === action.payload.id)) {
                state.message = "This pokemon already exists";
            } else {
                state.pokemons.push(action.payload);
                state.message = "Pokemon Added";
            }
        });
    },
});

const { selectPokemon, clearSelection, removePokemonFromList } =
    pokemonSlice.actions;

export { fetchPokemon, selectPokemon, clearSelection, removePokemonFromList };
export default pokemonSlice.reducer;
