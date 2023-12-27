<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="https://res.cloudinary.com/abhi9av/image/upload/v1703694626/eiziglbrzw8dhrjfqeqh.png" alt="Logo" width="400" height="">
  </a>

  <h4 align="center">Powered by</h4>
  <a href="">
    <img src="https://pokeapi.co/static/pokeapi_256.3fa72200.png" alt="Logo" width="100" height="">
  </a>
  <h1 align="center">POKEMANIA</h1>

  <p align="center">
  Gotta Browse 'Em All: Your Ultimate Pokémon Encyclopedia Online!"
    <br />
    <br />
    <a href="https://team22-client.vercel.app/">VISIT WEBSITE</a>
    <br />
    <a href="https://github.com/ANJani9web/dotflo_pokemon">GITHUB REPOSITORY</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

> **_NOTE:_** 
This website is currently designed for optimal viewing on laptop or desktop screens. Please avoid accessing it on mobile or tablet devices.

Welcome to Pokemania, your go-to destination for all things Pokémon! This project aims to create a comprehensive Pokédex website where users can explore detailed information about their favorite Pokémon, from Bulbasaur to Zamazenta. Whether you're a seasoned Pokémon Trainer or a casual fan, Pokemania is designed to be your ultimate resource for discovering and learning about these amazing creatures.

### Features
* Explore a vast collection of Pokémon entries, complete with detailed information such as types, abilities, height, weight, and evolution details. Dive into the rich lore of each Pokémon species and uncover fascinating facts.
* Effortlessly find the Pokémon you're looking for with our intuitive search and filter options. Search by name, type, or generation to quickly locate the information you need.


### Built With

* [React](https://legacy.reactjs.org/)
* [Tailwind](https://tailwindcss.com/)
* [Docker](https://www.docker.com/)
* [PokeAPI](https://pokeapi.co/)



<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up and run Pokemania on your local machine:

#### Pre Requisites

* Install [Node >=20](https://nodejs.org/en/download) on your system.

#### Setup Steps

* Clone this repository
    ```sh
    git clone https://github.com/ANJani9web/dotflo_pokemon
    ```

* Change directory to team22
    ```sh
    cd dotflo_pokemon
    ```

* Install all client dependencies.
  ```sh
  npm install
  ```

  * If any error occurs, try running above with root permissions.

* Spin up the developmental client side.

  ```sh
  npm start
  ```

* Client side is now running on ```http://localhost:3000```.

* Visit http://localhost:3000.




<!-- USAGE EXAMPLES -->
## Usage

For usage and Project Demo, please checkout the [Demo Video]() provided.

## Walkthrough of the Platform

This is a guide to Pokemania, featuring an initial dashboard displaying comprehensive details of all Pokémon in card format. 
* The dashboard facilitates searching for Pokémon by name and offers an advanced search functionality allowing users to filter Pokémon based on abilities, universal Pokémon number, and Pokémon type. 
* Abilities refer to unique attributes or skills possessed by Pokémon, while types denote elemental characteristics. 
* Each card on the dashboard showcases the Pokémon number, name, base experience points, and types. Upon selecting a card, users are redirected to a dedicated webpage providing in-depth information on the selected Pokémon. 
* This information encompasses types, attributes of double damage from (vulnerabilities), attributes of double damage to (strengths), a concise two-line description, height, weight, base experience points, abilities, and the Pokémon's evolution chain.

## Code Samples
<details>
  <summary>Click to expand filtering logic</summary>

  ```javascript
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
  
  ```
</details>

<details>
<summary>Click to expand the evolution chain fetching logic</summary>

```javascript

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
```
</details>

<details>
<summary>Click to expand the sorting and fetch all pokemon logic</summary>

```javascript

const getAllPokemon = () => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then((response) => response.json())
      .then((data) => {
        // setAllPokemons(data.results);
        // setFullPokemons(data.results);
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
```
</details>


<!-- ROADMAP -->
## Roadmap

- [x] User Input
- [x] API Integration
- [x] Sort/Filter
- [x] App Feed

<!-- CONTACT -->
## Contact

Mail: [cse210001004@iiti.ac.in](cse210001004@iiti.ac.in)

Project Link: [https://github.com/ANJani9web/dotflo_pokemon](https://github.com/ANJani9web/dotflo_pokemon)

Website Link: [https://team22-client.vercel.app/](https://team22-client.vercel.app/)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
