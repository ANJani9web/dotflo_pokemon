
import { useEffect, useState } from "react";
import TypeCard from "./typeCard";
import { Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Card({ poke }) {
  const [pokemon, setPokemon] = useState(null);
  const [types, setTypes] = useState(null);
  const getPokemon = () => {
    // console.log(poke.url)
    if (poke && poke.url) {
      axios.get(poke.url).then((response) => { setPokemon(response.data); setTypes(response.data.types); })
    }
    // axios.get(url).then((response) => {console.log(response.data); setPokemon(response.data.sprites.other.dream_world.front_default.split("/")[10]); setTypes(response.data.types);})
    // console.log(response.data);  
  }
  // const getAllPokemon = async () => {
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.sprites.other.dream_world.front_default) {
  //         setPokemon(
  //           data.sprites.other.dream_world.front_default.split("/")[10]
  //         );
  //         setTypes(data.types);
  //         // console.log(data.sprites.other.dream_world.front_default.split('/')[10]);
  //       }
  //     });
  // };

  useEffect(() => {
    getPokemon();
  }, [poke]);
  useEffect(() => {
    // console.log(pokemon);
  }, [pokemon]);



  return (
    <div className="m-auto px-4 py-8 w-[100%] cursor-pointer">
      <div className="bg-[#0c141d] shadow-2xl rounded-xl border border-2 border-[#506d8d] hover:scale-105">
        <div className="flex items-center justify-center h-[300px] w-[100%]">
          {pokemon && pokemon.sprites.other.dream_world.front_default && (
            <img
              className="object-fill h-[90%]"
              src={
                `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/` +
                pokemon.sprites.other.dream_world.front_default?.split("/")[10]
              }
            ></img>
          )}
          {pokemon && !pokemon.sprites.other.dream_world.front_default && (
            <img
              className="object-fill h-[90%]"
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/640px-Pok%C3%A9_Ball_icon.svg.png"
              }
            ></img>
          )}
          {!pokemon && (
            <div className="flex items-center justify-center p-5 h-[100%]">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-[#1f2e3e] rounded-b-xl">
          <div className="grid grid-cols-2">
            <div className="">
              {pokemon && <span className="text-white text-lg text-[#cccac6]">#{String(parseInt(pokemon.id)).padStart(4, '0')}</span>}
              {poke && <h2 className="font-bold text-2xl text-gray-800 text-white">{poke.name}</h2>}
            </div>
            <div className="flex justify-end">
              <div>
                <span className="text-sm text-[#cccac6]">Base XP</span>
                {pokemon && <p className="text-white font-bold">{pokemon.base_experience}</p>}
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 mb-2">
            {types &&
              types.map((type, i) => (
                <TypeCard key={i} typeName={type.type.name}></TypeCard>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}
