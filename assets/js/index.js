let inputSearch = null;
let checkBoxLanguages = null;
let preloader = null;
let frmSearch = null;
let panelDevs = null;
let devs = [];

function getElements() {
  inputSearch = document.querySelector("#search");
  checkBoxLanguages = document.querySelector("#languesTypes");
  preloader = document.querySelector("#preloader");
  frmSearch = document.querySelector("#frmSearch");
  panelDevs = document.querySelector("#panelDevs");
}

async function fetchDevs() {
  const rest = await fetch("http://localhost:3001/devs");
  const json = await rest.json();
  devs = json
    .map(({ id, name, picture, programmingLanguages }) => {
      const nameLowerCase = name
        .toLowerCase()
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
      programmingLanguages.forEach((languages) => {
        const { language, experience, id } = languages;
        const idLowerCase = id.toLowerCase();
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
    frmSearch.classList.remove("hidden");
  }, 2000);
}

function addEvent() {
  inputSearch.addEventListener("input", handleKeyUp);
  checkBoxLanguages.addEventListener("click", handleSelectedLanguage);
}

function handleKeyUp(event) {
  const filterText = event.target.value;
  filterDevs(filterText);
}

function handleSelectedLanguage(event) {
  const filterLanguage = event.target.id;
  filterByLanguageType(filterLanguage);
}

function filterDevs(filterText) {
  const filterTextLowerCase = filterText.toLowerCase();
  const filteredDevs = devs.filter((dev) => {
    return dev.nameLowerCase.includes(filterTextLowerCase);
  });
  showDevs(filteredDevs);
}

function filterByLanguageType(filterLanguage) {
  const filteredLanguages = [];
  devs.map((dev) => {
    const programmingLanguagesWithIcons = dev.programmingLanguagesWithIcons.filter(
      (language) => {
        return language.idLowerCase === filterLanguage;
      }
    );
    if (programmingLanguagesWithIcons.length > 0) {
      filteredLanguages.push({
        ...dev,
        programmingLanguagesWithIcons,
      });
    }
  });
  showDevs(filteredLanguages);
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
