import { useDispatch, useSelector } from "react-redux";
import { selectPokemon, removePokemonFromList } from "../features/pokemonSlice";
import { useGetPokemonByIdQuery } from "../features/pokemonApi";

const PokemonWithRTK = ({ id }) => {
    const { data, isLoading, error } = useGetPokemonByIdQuery(id);
    const dispatch = useDispatch();

    if (isLoading) return <p>Loading...</p>;
    if (data) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    margin: ".5rem 2rem",
                    textAlign: "center",
                }}
            >
                <p>{data.name}</p>
                <img
                    src={data.sprites.front_shiny}
                    alt={`${data.name}+${data.sprites.front_shiny}`}
                    style={{ height: "5rem", width: "auto" }}
                />
                <button onClick={() => dispatch(selectPokemon(data))}>
                    Select
                </button>
                <button onClick={() => {}}>Remove From List</button>
            </div>
        );
    }
};

export default PokemonWithRTK;