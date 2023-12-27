import { useState, useEffect, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import axios, { all } from "axios";
import MultiRangeSlider from "./multiRangeSlider/MultiRangeSlider";
import { colors as bgColors } from "./typeCard";
import { Select, Option } from "@material-tailwind/react";

let colors = {
    Normal: "text-[#dcdcdc] border-[#dcdcdc]",
    Fire: "text-[#f08030] border-[#f08030]",
    Water: "text-[#6890f0] border-[#6890f0]",
    Electric: "text-[#f8d030] border-[#f8d030]",
    Grass: "text-[#78c850] border-[#78c850]",
    Ice: "text-[#98d8d8] border-[#98d8d8]",
    Fighting: "text-[#c03028] border-[#c03028]",
    Poison: "text-[#a040a0] border-[#a040a0]",
    Ground: "text-[#e0c068] border-[#e0c068]",
    Flying: "text-[#a890f0] border-[#a890f0]",
    Psychic: "text-[#f85888] border-[#f85888]",
    Bug: "text-[#a8b820] border-[#a8b820]",
    Rock: "text-[#b8a038] border-[#b8a038]",
    Ghost: "text-[#705898] border-[#705898]",
    Dragon: "text-[#7038f8] border-[#7038f8]",
    Dark: "text-[#705848] border-[#705848]",
    Steel: "text-[#b8b8d0] border-[#b8b8d0]",
    Fairy: "text-[#ee99ac] border-[#ee99ac]",
};

const allTypes = Object.keys(colors);

const Filter = () => {
    const { allPokemons, setAllPokemons, allAbilities, setAllAbilities, allRegions, setAllRegions, types, setTypes, regionFilter, setRegionFilter, abilityFilter, setAbilityFilter, minVal, maxVal, setMinVal, setMaxVal } = useContext(MyContext);
    const [type_a, setType_a] = useState([]);
    const [type_b, setType_b] = useState([]);
    const [final, setFinal] = useState([]);

    const getAllAbilities = async () => {
        let url = "https://pokeapi.co/api/v2/ability?limit=367";
        let response = await axios.get(url);
        setAllAbilities(response.data.results);
        // console.log(response.data.results);
    }
    const getAllRegions = async () => {
        let url = "https://pokeapi.co/api/v2/region";
        let response = await axios.get(url);
        setAllRegions(response.data.results);
        // console.log(response.data.results);
    }
    const handleTypeClick = (type) => {
        const isType = types.includes(type);
        if (types.length === 2 && !isType) {
            return;
        }
        if (!isType) {
            setTypes([...types, type]);
        } else {
            setTypes(types.filter((t) => t !== type));
        }
    }
    const handleRegionClick = (region) => {
        const isRegion = regionFilter.includes(region);
        if (!isRegion) {
            setRegionFilter([...regionFilter, region]);
        } else {
            setRegionFilter(regionFilter.filter((r) => r !== region));
        }
    }
    const handleAbilityChange = (e) => {
        if(e.target.value === "All") {
            setAbilityFilter(null);
        } else {
            setAbilityFilter(e.target.value);
        }
        console.log(e.target.value);
    }
    const handleFilter = () => {
        const limit = maxVal - minVal + 1;
        const offset = minVal - 1;
        let typeUrl = [];
        for (let i = 0; i < types.length; i++) {
            typeUrl.push(`https://pokeapi.co/api/v2/type/${types[i].toLowerCase()}`);
        }
        if (abilityFilter !== null) typeUrl.push(`https://pokeapi.co/api/v2/ability/${abilityFilter}`);
        typeUrl.push(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        console.log(typeUrl);
        Promise.all(typeUrl.map((url, i) => fetch(url)))
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(dataArray => {
                const pokemonArrays = dataArray.map((data, i) => {
                    if (i === dataArray.length - 1) {
                        return data.results || [];
                    } else {
                        return data.pokemon.map(p => p.pokemon);
                    }
                });

                const commonPokemons = pokemonArrays.reduce((common, current) =>
                    common.filter(pokemon => current.some(p => p.name === pokemon.name))
                );
                setAllPokemons(commonPokemons);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    const handleReset = () => {
        setTypes([]);
        setRegionFilter([]);
        setAbilityFilter(null);
        setMinVal(1);
        setMaxVal(1302);
    }
    useEffect(() => {
        getAllAbilities();
        getAllRegions();
    }, [])
    useEffect(() => {
        setAllPokemons(type_a);
    }, [type_a]);
    return (
        <div>
            <div className="grid grid-cols-2">
                <div className="p-4">
                    <h1 className="text-2xl text-white text-center mb-2">Type</h1>
                    <div className="grid grid-cols-3 p-2 gap-2">
                        {
                            allTypes.map((type) => {
                                return (
                                    <>
                                        {
                                            !types.includes(type) &&
                                            (<button onClick={() => handleTypeClick(type)} className={`text-white text-xl px-4 py-2 border-2 ${colors[type]} rounded-2xl flex items-center justify-center`}>
                                                {type}
                                            </button>)
                                        }
                                        {
                                            types.includes(type) &&
                                            (<button onClick={() => handleTypeClick(type)} className={`text-white text-xl px-4 py-2 border-2 ${bgColors[type]} rounded-2xl flex items-center justify-center`}>
                                                {type}
                                            </button>)
                                        }
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="p-4">
                    <div className="mb-10">
                        <h1 className="text-2xl text-white text-center mb-2 bg-whiyte">Ability</h1>
                        <select onChange={handleAbilityChange} class="py-3 px-4 pe-9 block w-full rounded-2xl">
                            <option value="All" selected>All</option>
                            {
                                allAbilities && allAbilities.map((ability, i) => {
                                    return (
                                        <option value={ability.name} key={i}>{ability.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <h1 className="text-2xl text-white text-center mb-2">Number</h1>
                        <MultiRangeSlider min={1} max={1302} />;
                    </div>
                    
                </div>
            </div>
            <div>
                {/* <div className="p-4">
                    <h1 className="text-2xl text-white text-center mb-2">Regions</h1>
                    <div className="grid grid-cols-4 gap-4">
                        {
                            allRegions && allRegions.map((region) => {
                                return (
                                    <>
                                        {
                                            !regionFilter.includes(region.name) && <button onClick={() => handleRegionClick(region.name)} className={`text-white text-xl px-4 py-2 border-2 rounded-2xl flex justify-center items-center`}>
                                                {region.name}
                                            </button>
                                        }
                                        {
                                            regionFilter.includes(region.name) && <button onClick={() => handleRegionClick(region.name)} className={`text-black text-xl bg-white px-4 py-2 border-2 rounded-2xl flex justify-center items-center`}>
                                                {region.name}
                                            </button>
                                        }
                                    </>
                                )
                            })
                        }
                    </div>
                </div> */}
            </div>
            <div className="justify-end p-4">
                <button onClick={handleFilter} className="text-white bg-[#de7240] text-xl px-6 py-4 font-bold rounded-2xl mr-2">APPLY FILTER</button>
                <button onClick={handleReset} className="bg-white text-xl px-6 py-4 font-bold rounded-2xl">RESET</button>
            </div>
        </div>
    )
}

export default Filter;