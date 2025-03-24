import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from "@tanstack/react-query";

import { create } from "zustand";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

// State Management
const usePokemonStore = create((set) => ({
  favorites: [],
  addFavorite: (pokemon) =>
    set((state) => {
      if (state.favorites.find((fav) => fav.name === pokemon.name))
        return state;
      return { favorites: [...state.favorites, pokemon] };
    }),
}));


// Data Fetching
const fetchPokemons = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error fetching pokemons");
    return res.json();
  };

  const PokemonList = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["pokemons"],
      queryFn: fetchPokemons,
    });
    const handleAddFavorite = usePokemonStore((state) => state.addFavorite);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return (
      <div className="container">
        {data.results.map((pokemon) => (
          <div className="card" key={pokemon.name}>
            <h3>{pokemon.name}</h3>
            <button onClick={() => handleAddFavorite(pokemon)}>
              Add to Favorites
            </button>
          </div>
        ))}
      </div>
    );
  };

  const FavoriteList = () => {
    const favorites = usePokemonStore((state) => state.favorites);
  
    if (favorites.length === 0) return <div>No favorites added yet!</div>;
  
    return (
      <div className="favorites-container">
        <h2>Favorites</h2>
        <div className="favorites-list">
          {favorites.map((pokemon) => (
            <div className="favorite-card" key={pokemon.name}>
              <h3>{pokemon.name}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  function App() {
    const queryClient = new QueryClient();
  
    return (
      <QueryClientProvider client={queryClient}>
        <FavoriteList />
        <hr />
        <PokemonList />
      </QueryClientProvider>
    );
  }
  
  export default App;