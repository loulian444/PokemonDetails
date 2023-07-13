console.log(`hehehoohoohaha`);

const get20Pokes = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
    const data = await response.json();
    const pokeRes = data.results;

    return pokeRes;
  } catch (err) {
    console.log(err);
  }
};

const getPokeID = (pokeResArr) => {
  const pokeNameID = pokeResArr.map((singlePoke) => {
    return {
      name: singlePoke.name,
      id: singlePoke.url.split(`/`)[6],
    };
  });

  return pokeNameID;
};

const getPokeInfo = async (pokeNameID) => {
  const pokeInfo = [];
  for (let i = 0; i < pokeNameID.length; i++) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokeNameID[i].id}`
    );
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
    return `<img src="${spriteURL}"/>`
  })

  return imgSpriteArr;
};

const render = (sprites) => {
  const ul = document.querySelector(`ul`)
  ul.innerHTML = sprites.join(``);
}

const getImgLink = (spritesImg, pokemonID) => {
  const spriteLink = [];
  for (let i = 0; i < spritesImg.length; i++) {
    const imgLink = `<a href="" data-number="${pokemonID[i].id}">${spritesImg[i]}</a>`;
    spriteLink.push(imgLink);
  }

  return spriteLink;
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
  const allPokeRes = await get20Pokes();
  const allPokeNameID = getPokeID(allPokeRes);
  const allPokeInfo = await getPokeInfo(allPokeNameID);
  const allPokeSprites = getPokeSprite(allPokeInfo);
  const allImgSprites = putSpritesToImg(allPokeSprites);
  const allImgLink = getImgLink(allImgSprites, allPokeNameID);
  render(allImgLink);
  addLinkEventListeners();
};

init();
