
import Card from "../Components/card";
import SearchBar from "../Components/searchBar";
import Filter from "../Components/filter";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import pokemania from "../Assets/pokemania_logo.png";
import bg from "../Assets/bg.png";
import pokeball from "../Assets/pokeball.jpeg";


export default function Dashboard() {
  const { allPokemons, setAllPokemons, setFullPokemons, cards, setCards, evolutionChains, setEvolutionChains, sort, setSort } = useContext(MyContext);
  const [isFilter, setIsFilter] = useState(false);

  const getAllPokemon = () => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then((response) => response.json())
      .then((data) => {
        // setAllPokemons(data.results);
        setFullPokemons(data.results);
        console.log(sort)
        console.log("anbfhjksdbvfhkwevfeghkjvdf wjehd")
        switch (sort) {
          case "1":
            setAllPokemons([...data.results].sort((a, b) => parseInt(a.url.split("/")[6]) - parseInt(b.url.split("/")[6])));
            break;
          case "2":
            setAllPokemons([...data.results].sort((a, b) => parseInt(b.url.split("/")[6]) - parseInt(a.url.split("/")[6])));
            break;
          case "3":
            setAllPokemons([...data.results].sort((a, b) => a.name.localeCompare(b.name)));
            break;
          case "4":
            setAllPokemons([...data.results].sort((a, b) => b.name.localeCompare(a.name)));
            break;
          default:
            setAllPokemons([...data.results]);
        }
      });
  };

  const handleSort = (e) => {
    e.preventDefault();
    setSort(e.target.value);
  }


  useEffect(() => {
    const fetchAllEvolutionChains = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/evolution-chain?limit=541');
        const evolutionChainURLs = response.data.results.map((result) => result.url);
        const chainMap = {};

        // Fetch and process each evolution chain
        await Promise.all(evolutionChainURLs.map(async (url) => {
          const chainResponse = await axios.get(url);
          const evolutionData = chainResponse.data.chain;
          const evolutionArray = buildEvolutionArray(evolutionData);

          // Update the chainMap for each Pokémon in the evolution chain
          evolutionArray.forEach((pokemon) => {
            chainMap[pokemon] = evolutionArray;
          });
        }));

        setEvolutionChains(chainMap);
      } catch (error) {
        console.error('Error fetching evolution chains:', error);
      }
    };

    // Recursive function to build the evolution array
    const buildEvolutionArray = (evolutionData) => {
      const evolvesTo = evolutionData.evolves_to.flatMap((evolution) => {
        return buildEvolutionArray(evolution);
      });

      return [evolutionData.species.name, ...evolvesTo];
    };

    fetchAllEvolutionChains();
  }, []);

  const loadMore = () => {
    setCards((prevCards) => prevCards + 16);
  };

  useEffect(() => {
    getAllPokemon();
  }, [isFilter]);

  useEffect(() => {
    getAllPokemon();
  }, [sort]);

  useEffect(() => {
    console.log(allPokemons);
    console.log(cards);
    console.log(evolutionChains);
  }, [allPokemons]);

  const handleDetails = (pokemon) => {
    window.location.href = `/details/${pokemon.name}`;
  }

  const toggleFilter = () => {
    setIsFilter(!isFilter);
  }

  const containerStyles = {
    position: 'relative',
    height: '100vh',
    overflow: 'auto',
    backgroundImage: `url(${pokeball})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5 for 50% transparency)
  };

  return (
    <div style={containerStyles} className="hero px-40">
      <div className="w-[40%] mx-auto">
        <img src={pokemania}></img>
      </div>
      <div>
        <div className="pt-4 bg-[#0c141d] border border-2 rounded-2xl">

          <div className="mx-auto grid grid-cols-3 p-4">
            <div className="col-span-2 w-[80%]">
              <SearchBar></SearchBar>
            </div>
            <div className="flex justify-center items-center bg-[#68ab64] rounded-2xl">
              <div className="text-white flex justify-center items-center font-bold">
                <h1 className="text-center">
                  Search for a Pokemon by using its name.
                </h1>
              </div>
            </div>

          </div>
          <div className="grid grid-cols-6 mx-auto p-4 gap-4">
            <div className="flex justify-center items-center bg-[#68ab64] rounded-2xl col-span-2">
              <div className="text-white flex justify-center items-center font-bold">
                <h1 className="text-center">
                  Use the Advanced Search to explore Pokémon by type, number, Ability, and more!
                </h1>
              </div>
            </div>
            {!isFilter && (<button class="custom-btn btn-13 text-4xl rounded-2xl col-span-4" onClick={toggleFilter}>Show Advanced Search</button>)}
            {isFilter && (<button class="custom-btn btn-13 text-4xl rounded-2xl col-span-4" onClick={toggleFilter}>Hide Advanced Search</button>)}

          </div>
          {isFilter && (
            <div>
              <Filter></Filter>
            </div>
          )
          }
        </div>
        <div className="bg-[#0c141d] border border-2 rounded-2xl mt-2 p-4">
          <select onChange={handleSort} class="py-3 px-4 pe-9 block w-[300px] ml-auto rounded-2xl justify-end">
            <option value="1" selected>Lowest to Highest</option>
            <option value="2">Higest to Lowest</option>
            <option value="3">Alphabetical(A-Z)</option>
            <option value="4">Alphabetical(Z-A)</option>
          </select>
          <div className="">
            <div className="text-3xl grid grid-cols-4 grid-rows-4 gap-0 w-[100%]">
              {allPokemons &&
                allPokemons.slice(0, cards).map((pokemon, index) => {
                  return (
                    <div onClick={() => handleDetails(pokemon)}>
                      <Card key={index} poke={pokemon}></Card>
                    </div>
                  );
                })}
              {/* <button
                onClick={loadMore}
                className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
              >
                Load More
              </button> */}

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={loadMore}
                className="text-white bg-blue-500 hover:bg-blue-700 px-8 py-4 rounded-lg shadow-lg font-semibold"
              >
                Load More
              </button>
            </div>



          </div>
        </div>

      </div>

    </div>
  );
}
