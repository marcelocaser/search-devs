let inputSearch = null;
let checkBoxLanguages = null;
let radioButtonConditionals = null;
let filterConditional = null;
let filterText = "";
let formSearch = null;
let preloader = null;
let pnlSearch = null;
let panelDevs = null;
let devs = [];
let filteredLanguages = [];

function getElements() {
  inputSearch = document.querySelector("#search");
  checkBoxLanguages = document.querySelectorAll("[name='languesTypes']");
  radioButtonConditionals = document.querySelectorAll(
    "[name='conditionalTypes']"
  );
  filterConditional = document.querySelector(
    "[name='conditionalTypes']:checked"
  ).id;
  checkBoxLanguages.forEach((language) => language.checked ? filteredLanguages.push(language.id) : null);
  formSearch = document.querySelector("#frmSearch");
  preloader = document.querySelector("#preloader");
  pnlSearch = document.querySelector("#pnlSearch");
  panelDevs = document.querySelector("#panelDevs");
}

async function fetchDevs() {
  const rest = await fetch("http://localhost:3001/devs");
  const json = await rest.json();
  devs = json
    .map(({ id, name, picture, programmingLanguages }) => {
      const nameLowerCase = name
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f-\x20]/g, "");
      return {
        id,
        name,
        nameLowerCase,
        picture,
        programmingLanguages,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  devs = devs.map(
    ({ id, name, picture, nameLowerCase, programmingLanguages }) => {
      const programmingLanguagesWithIcons = [];
      const languagesTypes = [];
      programmingLanguages.forEach((languages) => {
        const { language, experience, id } = languages;
        const idLowerCase = id.toLocaleLowerCase();
        languagesTypes.push(language.toLocaleLowerCase());
        switch (language) {
          case "Java":
            programmingLanguagesWithIcons.push({
              idLowerCase,
              language,
              experience,
              icon: "./assets/img/java.png",
            });
            break;
          case "JavaScript":
            programmingLanguagesWithIcons.push({
              idLowerCase,
              language,
              experience,
              icon: "./assets/img/javascript.png",
            });
            break;
          case "Python":
            programmingLanguagesWithIcons.push({
              idLowerCase,
              language,
              experience,
              icon: "./assets/img/python.png",
            });
            break;
          default:
            break;
        }
      });
      return {
        id,
        name,
        nameLowerCase,
        picture,
        languagesTypes /*: languagesTypes.join("").toLocaleLowerCase(),*/,
        programmingLanguagesWithIcons,
      };
    }
  );

  //console.log(devs);
  showDevs(devs);
  showPreloader();
}

function showPreloader() {
  setTimeout(() => {
    preloader.classList.add("hidden");
    pnlSearch.classList.remove("hidden");
  }, 2000);
}

function addEvent() {
  inputSearch.addEventListener("input", handleKeyUp);
  checkBoxLanguages.forEach((checkBoxLanguage) => {
    checkBoxLanguage.addEventListener("input", handleSelectedLanguage);
  });
  radioButtonConditionals.forEach((radioButtonConditional) => {
    radioButtonConditional.addEventListener("input", handleSelectedConditional);
  });
}

function handleSearch(event) {
  event.preventDefault();
}

function handleKeyUp(event) {
  filterText = event.target.value;
  filterDevs();
}

function handleSelectedLanguage() {
  filteredLanguages = [];
  const filterLanguages = document.querySelectorAll(
    "[name=languesTypes]:checked"
  );
  filterLanguages.forEach(({ id }) => {
    filteredLanguages.push(id);
  });
  filterDevs();
}

function handleSelectedConditional(event) {
  filterConditional = event.target.id;
  filterDevs();
}

function filterDevs() {
  let filteredDevs = [];
  const filterTextLowerCase = filterText.toLocaleLowerCase();
  filteredDevs = devs.filter((dev) => {
    return dev.nameLowerCase.includes(filterTextLowerCase);
  });
  filteredDevs = filteredDevs.filter((dev) => {
    return filterConditional === "or"
      ? filteredLanguages.some((item) => dev.languagesTypes.includes(item))
      : dev.languagesTypes.join("") === filteredLanguages.join("");
  });
  showDevs(filteredDevs);
}

function showDevs(devs) {
  panelDevs.innerHTML = "";
  if (devs === null) {
    // quando nao tem nenhum registro de devs
    const h6 = document.createElement("h6");
    h6.innerHTML = "Nenhum 'dev' cadastrado/encontrado";
    panelDevs.appendChild(h6);
  } else {
    // encontrou registro de devs
    const h3 = document.createElement("h5");
    h3.innerHTML = `${devs.length} 'devs' cadastrado(s)/encontrado(s)`;
    panelDevs.appendChild(h3);
    const ul = document.createElement("ul");
    devs.forEach((dev) => {
      const { programmingLanguagesWithIcons } = dev;
      const li = document.createElement("li");
      li.classList.add("flex-row");
      li.classList.add("space-bottom");
      li.classList.add("col");
      li.classList.add("s4");
      li.classList.add("panel");
      const img = `<img class='avatar' src="${dev.picture}" alt="${dev.name}" />`;
      const userData = `<span>${dev.name}</span>`;
      let languages = "";
      programmingLanguagesWithIcons.forEach((language) => {
        languages = `${languages} <img class='language-icon' src="${language.icon}" alt="${language.language}"></img>`;
      });
      li.innerHTML = `${img}${userData}${languages}`;
      ul.appendChild(li);
    });
    panelDevs.appendChild(ul);
  }
}

window.addEventListener("load", async () => {
  getElements();
  await fetchDevs();
  addEvent();
});
