// Start script only after loading
window.onload = startScript;

// Endpoints
class EndPoint {
    constructor() {
        this.topHeadlinesUrl = "";
        this.sourcesUrl = "";

        this.apiKey = "9b73824e82ba4b5eaae944a736a147d3";

        this.endPoints = {
            topHeadlines: {
                endPoint: "https://newsapi.org/v2/top-headlines",
                params: {
                    country: [],
                    category: [
                        "business",
                        "entertainment",
                        "general",
                        "health",
                        "science",
                        "sports",
                        "technology"
                    ],
                    sources: [],
                    q: "",
                    pageSize: 20,           // Default, max 100
                    page: 1,
                }
            },
            everything: {
                endPoint: "https://newsapi.org/v2/everything",
                params: {
                    q: "",
                    sources: [],
                    domains: [],
                    excludeDomains: [],
                    from: "",               // ISO 8601 format: eg: 2018-11-30 or 2018-11-30T07:10:46
                    to: "",
                    language: [             // default: all supported langauges returned
                        "ar",
                        "de",
                        "en",
                        "es",
                        "fr",
                        "he",
                        "it",
                        "nl",
                        "no",
                        "pt",
                        "ru",
                        "se",
                        "ud",
                        "zh"
                    ],
                    sortBy: [
                        "publishedAt",
                        "relevancy",
                        "popularity"
                    ],
                    pageSize: 20,
                    page: 1,
                }
            },
            sources: {
                endPoint: "https://newsapi.org/v2/sources",
                params: {
                    category: [
                        "business",
                        "entertainment",
                        "general",
                        "health",
                        "science",
                        "sports",
                        "technology"
                    ],
                    langauge: [             // Default all languages
                        "ar",
                        "de",
                        "en",
                        "es",
                        "fr",
                        "he",
                        "it",
                        "nl",
                        "no",
                        "pt",
                        "ru",
                        "se",
                        "ud",
                        "zh"
                    ],
                    country: []
                }
            }
        };
    }

    updateTopHeadlinesUrl() {
        // let url = "";

        // url += this.endPoints.topHeadlines.endPoint + "?" + "country=" + this.endPoints.topHeadlines.params.country[0].code + "&" + "apiKey=" + this.apiKey;

        // return encodeURI(url);
    }

    updateSourcesUrl() {
        this.sourcesUrl = `${this.endPoints.sources.endPoint}?apiKey=${this.apiKey}`;

        console.log('Update sourcesUrl: ', this.sourcesUrl);
    }
}

// DOM manipulation and data fetching
class DOM {
    constructor() {

    }

    createOption(value) {
        const option = document.createElement('option');

        option.setAttribute('value', value);

        return option;
    }

    populateInputFieldOptions(countries, sources) {
        const endpoint = new EndPoint();

        this.populateCategoryField(endpoint.endPoints.topHeadlines.params.category);
        this.populateCountryField(countries);
        this.populateSourcesField(sources);
    }

    populateCategoryField(categories) {
        const categoryList = document.querySelector('#categories');

        categories.forEach(category => {
            const option = this.createOption(category);
            categoryList.append(option);
        });
    }

    populateCountryField(countries) {
        const countryList = document.querySelector('#countries');

        countries.forEach(country => {
            const option = this.createOption(country);
            countryList.append(option);
        });
    }

    populateSourcesField(sources) {
        const sourcesList = document.querySelector('#sources-list');

        sources.forEach(source => {
            const option = this.createOption(source);
            sourcesList.append(option);
        });
    }
}

class DataFetch {
    constructor() {
        this.endpoint = new EndPoint();

        this.countries = [];
        this.sources = [];
    }

    getCountriesAndSources() {
        this.endpoint.updateSourcesUrl();
        
        return fetch(this.endpoint.sourcesUrl);
    }

    storeCountriesAndSources(response) {
        console.log('Response is: ', response);

        if(response.status === "ok") {
            response.sources.forEach(source => {
                // console.log(source.id);
                if(this.countries.indexOf(source.country) === -1)
                    this.countries.push(source.country);
                if(this.sources.indexOf(source.id) === -1)
                    this.sources.push(source.id);
            });
        } else {
            console.log(`Response error: code: ${response.code}\nmessage: ${response.message}`);
        }
        
        this.countries.sort();
    }
}


function startScript() {
    // Add handlers for events
    setEventHandlers();

    // Populate input field options
    createOptionsForInputFields();
}


// Set event handlers for various elements
function setEventHandlers() {
    addHandlerForClickOnSearch();
    addHandlerForClickOnContainer();
    addHandlerForClickOnSearchBtn();
    addHandlerForChangeInInputField();
}

// Add event handler functions
function addHandlerForClickOnSearch() {
    const searchIcon = document.querySelector("#search i");

    console.log(searchIcon);

    searchIcon.addEventListener('click', handleSearchIconClick);
}

function addHandlerForClickOnContainer() {
    const container = document.querySelector('#container');

    container.addEventListener('click', handleContainerClick)
}

function addHandlerForClickOnSearchBtn() {
    const searchBtn = document.querySelector('.btn-search');

    searchBtn.addEventListener('click', handleSearchBtnClick);
}

function addHandlerForChangeInInputField() {
    const inputFields = document.querySelectorAll('#search-form input');

    inputFields.forEach(inputField => inputField.addEventListener('change', handleInputFieldChange));
}


// Various event handler functions
function handleSearchIconClick() {
    console.log('Search Icon Click');

    const searchForm = document.querySelector('#search-form');

    if(searchForm.classList.contains('hide-search-form') || searchForm.classList.length === 0) {
        searchForm.classList.add('view-search-form');
        searchForm.classList.remove('hide-search-form');
    }
}

function handleContainerClick() {
    console.log('Container Click');

    const searchForm = document.querySelector('#search-form');

    if(searchForm.classList.contains('view-search-form')) {
        searchForm.classList.add('hide-search-form');
        searchForm.classList.remove('view-search-form');
    }
}

function handleSearchBtnClick(event) {
    console.log('Search Button Click');

    // Stop form submission
    event.preventDefault();

    handleContainerClick();
}

function handleInputFieldChange(event) {
    console.log('Input Field Change');

    const inputField = event.target;
    const inputFieldID = inputField.getAttribute('id');

    identifyFieldAndAct(inputField, inputFieldID);
}


// Functions associated with handlers
function identifyFieldAndAct(inputField, inputFieldID) {
    if(inputFieldID === "category" || inputFieldID === "country") {
        const categoryField = document.querySelector('#category');
        const countryField = document.querySelector('#country');

        enableOrDisableSourcesField(categoryField.value, countryField.value);
    } else if(inputFieldID === "sources") {
        enableOrDisableCategoryAndCountryField(inputField.value);
    }
}

function enableOrDisableSourcesField(decidingFieldValue1, decidingFieldValue2) {
    const sourcesField = document.querySelector('#sources');

    console.log(sourcesField);

    if(decidingFieldValue1 !== "" || decidingFieldValue2 !== "")
        sourcesField.setAttribute('disabled', true);
    else
        sourcesField.removeAttribute('disabled');
}

function enableOrDisableCategoryAndCountryField(decidingFieldValue) {
    const categoryField = document.querySelector('#category');
    const countryField = document.querySelector('#country');

    console.log(categoryField, countryField);

    if(decidingFieldValue !== "") {
        categoryField.setAttribute('disabled', true);
        countryField.setAttribute('disabled', true);
    } else {
        categoryField.removeAttribute('disabled');
        countryField.removeAttribute('disabled');
    }
}


// ----------------
function createOptionsForInputFields() {
    const dataObj = new DataFetch();
    const domObj = new DOM();

    dataObj.getCountriesAndSources()
        .then(res => res.json())
        .then(res => dataObj.storeCountriesAndSources(res))
        .then(() => domObj.populateInputFieldOptions(dataObj.countries, dataObj.sources))
        .catch(err => console.log(err));
}