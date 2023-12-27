import { useContext, useState} from "react";
import { MyContext } from "../Context/MyContext";

const SearchBar = () => {
  const { fullPokemons, setAllPokemons, setCards } = useContext(MyContext);
  const [word, setWord] = useState("");

  const SearchFunction = (array) => {
    const searchTerm = word.toLowerCase();
    return array.filter((value) => {
      return value.name.toLowerCase().match(new RegExp(searchTerm, "g"));
    });
  };

  const handleSearch = async (event) => {
    if(word === "") {
      return;
    }
    const searchResult = await SearchFunction(fullPokemons);
    setAllPokemons(searchResult);
    setCards(searchResult.length);
    // console.log(searchResult);
  };

  return (
    <div className="">
      <div className="relative flex w-full flex-wrap items-stretch">
        <input
          type="search"
          className="mr-6 border border-[1px] border-[#506d8d] relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-2xl bg-clip-padding px-3 py-[10px] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-black dark:focus:border-primary"
          placeholder="Search by name"
          aria-label="Search"
          aria-describedby="button-addon1"
          onChange={(e) => setWord(e.target.value)}
        />

        <button
          className="bg-[#de7240] relative z-[2] flex items-center rounded-2xl px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          type="button"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
