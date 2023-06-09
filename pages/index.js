import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon } from "@/src/features/pokemonSlice";
import Pokemon from "@/src/components/pokemon";
import SelectedPokemon from "@/src/components/selectedPokemon";
import { useEffect, useRef, useState } from "react";
import PokemonWithRTK from "@/src/components/pokemonWithRTK";
import PostWithRTK from "@/src/components/postWithRTK";
import SelectedPost from "@/src/components/selectedPost";

const inter = Inter({ subsets: ["latin"] });

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [postID, setPostID] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const dispatch = useDispatch();
  const state = useSelector((state) => state.pokemon);

  const text = useRef("");
  const text2 = useRef("");
  const text3 = useRef("");

  const state2 = useSelector((state) => state.pokemonApi);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(state2);
    }, 5000);
    return () => clearInterval(interval);
  }, [state2]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            textAlign: "center",
          }}
        >
          {/* <div style={{ margin: "0 2rem" }}>
            <p>Fetching with asyncTrunk</p>
            {state.loading && <p>Getting New Pokemon</p>}
            <button
              style={{ margin: ".5rem 0" }}
              onClick={() => dispatch(fetchPokemon(getRandomInt(900)))}
            >
              Fetch Random Pokemon
            </button>
            <div>
              <input ref={text} />
              <button
                onClick={() =>
                  dispatch(fetchPokemon(parseInt(text.current.value)))
                }
              >
                Fetch this ID
              </button>
            </div>
          </div> */}

          {/*   <div style={{ margin: "0 2rem" }}>
            <p>Fetching with RTK Query</p>

            <button
              style={{ margin: ".5rem 0" }}
              onClick={() => {
                const newPokemons = [...pokemons];
                newPokemons.push(getRandomInt(900));
                setPokemons(newPokemons);
              }}
            >
              Fetch Random Pokemon
            </button>
            <div>
              <input ref={text2} />
              <button
                onClick={() => {
                  const newPokemons = [...pokemons];
                  newPokemons.push(parseInt(text2.current.value));
                  setPokemons(newPokemons);
                }}
              >
                Fetch this ID
              </button>
            </div>
          </div> */}

          <div style={{ margin: "0 2rem" }}>
            <p>Fetching posts with RTK Query</p>

            <button
              style={{ margin: ".5rem 0" }}
              onClick={() => {
                const newPostIDs = [...postID];
                newPostIDs.push(getRandomInt(100));
                setPostID(newPostIDs);
              }}
            >
              Fetch Random Post
            </button>
            <div>
              <input ref={text3} />
              <button
                onClick={() => {
                  const newPostIDs = [...postID];
                  newPostIDs.push(parseInt(text3.current.value));
                  setPostID(newPostIDs);
                }}
              >
                Fetch this ID
              </button>
            </div>
          </div>
        </div>

        {/*state.selectedPokemon?.id && (
          <div>
            <SelectedPokemon
              name={state.selectedPokemon.name}
              img={state.selectedPokemon.sprites.front_shiny}
              id={state.selectedPokemon.id}
            />
          </div>
        )*/}

        {selectedPost && (
          <div>
            <SelectedPost {...selectedPost} setSelectedPost={setSelectedPost} />
          </div>
        )}

        {/*        <div>
          {pokemons.length > 0 && (
            <div>
              <p>RTK Query Pokemons</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {pokemons.map((el) => (
                  <PokemonWithRTK
                    key={el}
                    id={el}
                    setPokemons={setPokemons}
                    pokemons={pokemons}
                  />
                ))}
              </div>
            </div>
          )}

          {state.pokemons.length > 0 && (
            <div style={{ margin: "2rem 0" }}>
              <p>Async Thunk Pokemons</p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {state.pokemons.map((el) => (
                  <Pokemon
                    key={el.name}
                    name={el.name}
                    img={el.sprites.front_shiny}
                    id={el.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div> */}
        <div>
          {postID.length > 0 && (
            <div>
              <p>RTK Query PostID</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {postID.map((el) => (
                  <PostWithRTK
                    key={el}
                    id={el}
                    setPostID={setPostID}
                    setSelectedPost={setSelectedPost}
                    selectedPost={selectedPost}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
