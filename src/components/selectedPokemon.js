import { useDispatch } from "react-redux";
import { clearSelection } from "../features/pokemonSlice";

const SelectedPokemon = ({ name, img, id }) => {
    const dispatch = useDispatch();

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
                style={{ width: "10rem", height: "10rem" }}
            />
            <button onClick={() => dispatch(clearSelection())}>
                Clear Selection
            </button>
        </div>
    );
};

export default SelectedPokemon;
