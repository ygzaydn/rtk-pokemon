import { useDispatch, useSelector } from "react-redux";
import { selectPokemon, removePokemonFromList } from "../features/pokemonSlice";

const Pokemon = ({ name, img, id }) => {
    const dispatch = useDispatch();
    const stateID = useSelector((state) => state.pokemon.selectedPokemon.id);
    const pokemons = useSelector((state) => state.pokemon.pokemons);

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
            <p>{name}</p>
            <img
                src={img}
                alt={`${name}+${img}`}
                style={{ height: "5rem", width: "auto" }}
            />
            <button
                disabled={id === stateID}
                onClick={() =>
                    dispatch(selectPokemon(pokemons.find((el) => el.id === id)))
                }
            >
                {id === stateID ? "Selected" : "Select"}
            </button>
            <button onClick={() => dispatch(removePokemonFromList(id))}>
                Remove From List
            </button>
        </div>
    );
};

export default Pokemon;
