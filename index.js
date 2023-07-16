console.log(`hehehoohoohaha`);

let pokeList = [];
let allImgLink = [];

const get20Pokes = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=151`);
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.log(err);
  }
};

const getPokeInfo = async (pokemonList) => {
  const pokeInfo = [];
  for (let i = 0; i < pokemonList.length; i++) {
    const response = await fetch(pokemonList[i].url);
    const data = await response.json();

    pokeInfo.push(data);
  }

  return pokeInfo;
};

const getPokeSprite = (pokeInformation) => {
  const pokeSprites = pokeInformation.map(
    (singlePoke) => singlePoke.sprites.front_default
  );

  return pokeSprites;
};

const putSpritesToImg = (spritesArr) => {
  const imgSpriteArr = spritesArr.map((spriteURL) => {
    const img = document.createElement(`img`);
    img.src = spriteURL;

    return img;
  });
  

  return imgSpriteArr;
};

const render = (sprites) => {
  const section = document.querySelector(`section`);
  sprites.forEach((sprite) => {
    section.appendChild(sprite);
  });
};

const getImgLink = (sprites, pokemonInfo) => {
  const imgLink = [];
  for (let i = 0; i < sprites.length; i++) {
    const a = document.createElement(`a`);
    a.setAttribute(`data-number`, pokemonInfo[i].id);
    a.appendChild(sprites[i]);

    imgLink.push(a);
  }

  return imgLink;
};

const addLinkEventListeners = () => {
  const links = document.querySelectorAll(`a`);
  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    link.addEventListener(`click`, async (event) => {
      event.preventDefault();

      await getSinglePokeInfo(link.dataset.number);
    });
  }
};

const addSearchEvent = () => {
  const form = document.querySelector(`form`);
  const pokeSearch = document.querySelector(`#pokeSearch`);

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();
    
    getSinglePokeInfo(pokeSearch.value);
    form.reset();
  })
}

const getSinglePokeInfo = async (pokeID) => {
  try {
    const loweredID = pokeID.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${loweredID}`);
    const data = await response.json();
    renderPokeDetails(data);
  } catch (err) {
    window.alert(`${pokeID} is not a valid Pokemon`);
  }

};

const renderPokeDetails = (pokeData) => {
  const section = document.querySelector(`section`);
  const h1 = document.createElement(`h1`);
  const p = document.createElement(`p`);
  const button = document.createElement(`button`);

  section.innerHTML = ``;
  h1.innerText = pokeData.name;
  button.innerText = `Back`;
  const spriteLinks = getSpritesArr(pokeData);
  p.innerHTML = `<b>type</b>: ${getPokeTypes(pokeData).join(`/`)} </br>
  <b>ability</b>: ${getPokeAbilities(pokeData).join(`/`)}`;

  section.appendChild(h1);

  for (let i = 0; i < spriteLinks.length; i++) {
    const img = document.createElement(`img`);
    img.src = spriteLinks[i];
    section.appendChild(img);
  }
  
  section.appendChild(p);
  section.appendChild(document.createElement(`br`));
  section.appendChild(button);

  button.addEventListener(`click`, () => {
    section.innerHTML = ``;
    render(allImgLink);
  });
};

const getSpritesArr = (pokeData) => imgSpritesLinks = [pokeData.sprites.front_default, pokeData.sprites.back_default, pokeData.sprites.front_shiny, pokeData.sprites.back_shiny];

const getPokeTypes = (pokeData) => {
  const pokemonType = pokeData.types;
  const typeNames = pokemonType.map((type) => type.type.name);
  
  return typeNames;
}

const getPokeAbilities = (pokeData) => {
  const pokemonAbilities = pokeData.abilities;
  const abilityNames = pokemonAbilities.map((ability) => !ability.is_hidden ? ability.ability.name : `${ability.ability.name}(hidden)`);

  return abilityNames;
}


const init = async () => {
  pokeList = await get20Pokes();
  const allPokeInfo = await getPokeInfo(pokeList);
  const allPokeSprites = getPokeSprite(allPokeInfo);
  const allImgSprites = putSpritesToImg(allPokeSprites);
  allImgLink = getImgLink(allImgSprites, allPokeInfo);
  render(allImgLink);
  addLinkEventListeners();
  addSearchEvent();
};

init();
