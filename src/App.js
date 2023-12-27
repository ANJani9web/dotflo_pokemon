import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/dashboard';
import Details from './Pages/details';
import { MyContext } from "./Context/MyContext";

function App() {
  const [allPokemons, setAllPokemons] = useState(null);
  const [fullPokemons, setFullPokemons] = useState(null);
  const [allAbilities, setAllAbilities] = useState(null);
  const [cards, setCards] = useState(16);
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(1302);
  const [allRegions, setAllRegions] = useState(null);
  const [types, setTypes] = useState([]);
  const [regionFilter, setRegionFilter] = useState([]);
  const [abilityFilter, setAbilityFilter] = useState(null);
  const [evolutionChains, setEvolutionChains] = useState({});
  const [sort, setSort] = useState(1);
  return (
    <MyContext.Provider value={{
      allPokemons,
      setAllPokemons, 
      fullPokemons, 
      setFullPokemons, 
      cards, 
      setCards, 
      allAbilities, 
      setAllAbilities,
      minVal,
      setMinVal, 
      maxVal, 
      setMaxVal, 
      allRegions, 
      setAllRegions,
      types, 
      setTypes,
      regionFilter,
      setRegionFilter,
      abilityFilter,
      setAbilityFilter,
      evolutionChains, 
      setEvolutionChains,
      sort, 
      setSort
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
          </Route>
          <Route path="/details/:name" element={<Details />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  )
}

export default App;
