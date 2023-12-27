import { Route, Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import TypeCard from "../Components/typeCard";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import BarChart from "../Components/chart"
import Card from "../Components/card";
import pokeball from "../Assets/pokeball.jpeg";
import pokemania from "../Assets/pokemania_logo.png";

export default function Details() {
    const navigate = useNavigate();
    const { name } = useParams();
    const [pokemon, setPokemon] = useState();
    const [types, setTypes] = useState();
    const [doubleFrom, setDoubleFrom] = useState([]);
    const [doubleTo, setDoubleTo] = useState([]);
    const [statArray, setStatArray] = useState([0, 0, 0, 0, 0, 0]); // [hp, attack, defense, special attack, special defense, speed
    const { evolutionChains, setEvolutionChains } = useContext(MyContext);
    const [evolutionArray, setEvolutionArray] = useState({});
    const [description,setDescription] = useState();

    const bgStyles = {
        position: 'relative',
        height: '100vh',
        overflow: 'auto',
        backgroundImage: `url(${pokeball})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5 for 50% transparency)
    };



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
    const getAllPokemon = () => {
        setDoubleFrom([]);
        setDoubleTo([]);    
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data);
                setTypes(data.types);
                for (let i = 0; i < data.types.length; i++) {
                    let url = data.types[i].type.url;
                    fetch(url)
                        .then((response) => response.json())
                        .then((data) => {
                            data.damage_relations.double_damage_from.map((type) => {
                                setDoubleFrom(doubleFrom => [...doubleFrom, type.name]);
                            });
                            data.damage_relations.double_damage_to.map((type) => {
                                setDoubleTo(doubleTo => [...doubleTo, type.name]);
                            });
                        });
                }
            });
    };
    
    const descriptionDetials=()=>{
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
        .then((response) => response.json())
        .then((data) => {
            // set description only when the language is en
            data.flavor_text_entries.map((desc) => {
                if (desc.language.name === "en") {
                    setDescription(desc.flavor_text);
                }
            });
        });
    }

    // use effect for decription
    useEffect(() => {
        descriptionDetials();
    }, [name]);

    useEffect(() => {
        getAllPokemon();
    }, [name]);

    useEffect(() => {
        evolutionChains[name] && evolutionChains[name].length > 1 && evolutionChains[name].map((pokename, id) => (
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`)
                .then((response) => response.json())
                .then((data) => {
                    let realData = {
                        name: data.name,
                        url: "https://pokeapi.co/api/v2/pokemon/" + data.id
                    }
                    setEvolutionArray(evolutionArray => ({ ...evolutionArray, [pokename]: realData }));
                })
        ))
    }, [evolutionChains, name])

    useEffect(() => {
        setStatArray(pokemon && pokemon.stats.map((stat) => stat.base_stat));
    }, [pokemon, name])

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#56a5d2', // Change background color to a coral-like shade
        color: '#2e3338', // Change text color to a darker grayish-blue shade
        paddingTop: '20px',
        paddingBottom: '20px',
        borderRadius: '12px', // Increase border-radius for a rounded look
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Increase box shadow for a pronounced effect
        width: '100%',
        marginTop: '20px',
    };


    const handleDetails = (pokemon) => {
        window.location.href = `/details/${pokemon.name}`;
    }

    return (
        <div className="px-40 py-6 bg-black text-white" style={bgStyles}>
            <div className="w-[40%] mx-auto mt-0">
                <img src={pokemania}></img>
            </div>
            {pokemon && (
                <div className="bg-[#0c141d] p-4 h-auto rounded-2xl border border-2">
                    <h1 className="text-4xl text-center font-bold">
                        {name[0].toUpperCase() + name.slice(1)}
                    </h1>
                    <div className="flex justify-center items-center">
                        <div className="grid grid-cols-2 p-10 gap-10 w-[90%]">
                            <div>
                                <div className="flex items-center justify-center h-[400px] w-[100%] bg-[#e1e5eb] rounded-2xl">

                                    {pokemon && pokemon.sprites.other.dream_world.front_default && (
                                        <img
                                            className="object-fill h-[100%]"
                                            src={
                                                `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/` +
                                                pokemon.sprites.other.dream_world.front_default?.split("/")[10]
                                            }
                                        ></img>
                                    )}
                                    {pokemon && !pokemon.sprites.other.dream_world.front_default && (
                                        <img
                                            className="object-fill h-[100%]"
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
                                <div className="mt-10 p-4 rounded-2xl bg-[#1f2e3e] text-black">
                                    <span className="text-2xl text-white"> Types </span>
                                    <div className="grid grid-cols-2 gap-2 mt-4 mb-6">
                                        {types &&
                                            types.map((type, i) => (
                                                <TypeCard key={i} typeName={type.type.name}></TypeCard>
                                            ))}
                                    </div>
                                    <span className="text-2xl text-white">Double Damage From </span>
                                    <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
                                        {doubleFrom.length > 0 &&
                                            doubleFrom.slice(0, doubleFrom.length / 2).map((type, i) => (
                                                <TypeCard key={i} typeName={type}></TypeCard>
                                            ))}
                                    </div>
                                    <span className="text-2xl text-white">Double Damage To </span>
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {doubleTo.length > 0 &&
                                            doubleTo.slice(0, doubleTo.length / 2).map((type, i) => (
                                                <TypeCard key={i} typeName={type}></TypeCard>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-xl">
                                 
                                {description}

                                <div className="mb-4" style={containerStyle}>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div>
                                            <div className="mb-[20px]">
                                                <span className="text-md text-white">Height(in cm)</span>
                                                <div className="text-4xl">
                                                    {pokemon.height * 10}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-md text-white">Weight(in kg)</span>
                                                <div className="text-4xl">
                                                    {pokemon.weight / 10}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-[20px]">
                                                <span className="text-md text-white">Base Experience</span>
                                                <div className="text-4xl">
                                                    {pokemon.base_experience}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-md text-white">Abilities</span>
                                                <div className="text-2xl font-bold">
                                                    {pokemon.abilities.map((ability, i) => (
                                                        <div>{ability.ability.name}</div>
                                                    )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[100%] h-[100%]">
                                    {pokemon && <BarChart stat={statArray}></BarChart>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0c141d] px-20 text-white">
                        <div className="bg-[#1f2e3e] pt-8 pb-8 rounded-2xl px-8">
                            <h1 className="text-2xl text-center">Evolution Chain </h1>
                            {evolutionChains[name] && (
                                <div className={`grid grid-cols-${evolutionChains[name].length} grid-rows-1`}>
                                    {evolutionArray && evolutionChains[name].length > 1 && evolutionChains[name].map((pokem, id, arr) => (
                                        <div onClick={() => handleDetails(evolutionArray[pokem])}>
                                            <Card key={id} poke={evolutionArray[pokem]}></Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

