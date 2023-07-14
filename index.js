console.log(`hehehoohoohaha`);

let pokeList = [];
const get20Pokes = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
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
    
  return pokeSprites
};

const putSpritesToImg = (spritesArr) => {
  const imgSpriteArr = spritesArr.map((spriteURL) => {
    const img = document.createElement(`img`);
    img.src = spriteURL;
    
    return img;
  })

  return imgSpriteArr;
};

const render = (sprites) => {
  const section = document.querySelector(`section`);
  sprites.forEach((sprite) => {
    section.appendChild(sprite);
  });
}

const getImgLink = (sprites, pokemonInfo) => {
  const imgLink = [];
  for (let i = 0; i < sprites.length; i++) {
    const a = document.createElement(`a`);
    a.setAttribute(`data-number`, pokemonInfo[i].id);
    a.appendChild(sprites[i]);
    console.log(a)

    imgLink.push(a);
    // const imgLink = `<a href="" data-number="${pokemonInfo[i].id}">${spritesImg[i]}</a>`;
  }

  return imgLink;
}

const addLinkEventListeners = () => {
  const links = document.querySelectorAll(`a`);
  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    link.addEventListener(`click`, async(event) => {
      event.preventDefault();
      console.log(link.dataset.number)
      await getSinglePokeInfo(link.dataset.number);
    });
  }
}

const getSinglePokeInfo = async (pokeID) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`);
  const data = await response.json();

  renderPokeDetails(data);
};

const renderPokeDetails = (pokeData) => {
  const pre = document.querySelector(`pre`);
  pre.innerText = JSON.stringify(pokeData, null, 2);
}

const init = async () => {
  pokeList = await get20Pokes();
  const allPokeInfo = await getPokeInfo(pokeList);
  const allPokeSprites = getPokeSprite(allPokeInfo);
  const allImgSprites = putSpritesToImg(allPokeSprites);
  const allImgLink = getImgLink(allImgSprites, allPokeInfo);
  // console.log(allImgLink)
  render(allImgLink);
  addLinkEventListeners();
};

init();
