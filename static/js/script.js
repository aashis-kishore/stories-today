// Start script only after loading
window.onload = startScript;

// Endpoints
class EndPoint {
    constructor() {
        this.topHeadlinesUrl = "";
        this.everythingUrl = "";
        this.sourcesUrl = "";

        this.apiKey = "9b73824e82ba4b5eaae944a736a147d3";

        this.endPoints = {
            topHeadlines: {
                endPoint: "https://newsapi.org/v2/top-headlines",
                params: {
                    country: ["in"],
                    category: ["general"],
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

    updatePageSize(endPointName, pageSize) {
        console.log('Updating pageSize');

        if((endPointName === "topHeadlines" || endPointName === "everything") && (pageSize > 0 && pageSize <= 100))
            this.endPoints[endPointName].params.pageSize = pageSize;
    }

    updatePage(endPointName, page) {
        if((endPointName === "topHeadlines" || endPointName === "everything") && (page > 0 && page <= (dataFetch.maxPages || 100)))
            this.endPoints[endPointName].params.page = page;

            console.log('Page updated to: ', this.endPoints[endPointName].params.page);
    }

    updateTopHeadlinesUrl() {
        this.topHeadlinesUrl = `${this.endPoints.topHeadlines.endPoint}?apiKey=${this.apiKey}`;

        if(this.endPoints.topHeadlines.params.q !== "")
            this.topHeadlinesUrl += `&q=${this.endPoints.topHeadlines.params.q}`;
        if(this.endPoints.topHeadlines.params.category.length !== 0)
            this.topHeadlinesUrl += `&category=${this.endPoints.topHeadlines.params.category.join(" ")}`;
        if(this.endPoints.topHeadlines.params.country.length !== 0)
            this.topHeadlinesUrl += `&country=${this.endPoints.topHeadlines.params.country.join(" ")}`;
        if(this.endPoints.topHeadlines.params.sources.length !== 0)
            this.topHeadlinesUrl += `&sources=${this.endPoints.topHeadlines.params.sources.join(" ")}`;
        if(this.endPoints.topHeadlines.params.pageSize >= 5)
            this.topHeadlinesUrl += `&pageSize=${this.endPoints.topHeadlines.params.pageSize}`;
        if(this.endPoints.topHeadlines.params.page >= 1)
            this.topHeadlinesUrl += `&page=${this.endPoints.topHeadlines.params.page}`;

        console.log(`Update topHeadlinesUrl: ${this.topHeadlinesUrl}`);
    }

    updateSourcesUrl() {
        this.sourcesUrl = `${this.endPoints.sources.endPoint}?apiKey=${this.apiKey}`;

        console.log('Update sourcesUrl: ', this.sourcesUrl);
    }
}

// DOM manipulation and data fetching
class DOM {
    createOption(value) {
        const option = document.createElement('option');

        option.setAttribute('value', value);

        return option;
    }

    createDiv(classList) {
        const div = document.createElement('div');

        classList.forEach(cls => div.classList.add(cls));

        return div;
    }

    createTitle(title) {
        const titleElement = document.createElement('h3');

        titleElement.innerText = title;

        return titleElement;
    }

    createAnchor(content, link) {
        const anchor = document.createElement('a');

        anchor.setAttribute('href', link);
        anchor.setAttribute('target', '_blank');
        anchor.innerText = content;

        return anchor;
    }

    createStoryCard(story) {
        const storyCard = this.createDiv(['story-card']);

        const storyCardFrontFace = this.createDiv(['story-card-face', 'story-card-front-face']);

        const storyImage = this.createDiv(['story-image']);
        if(story.urlToImage)
            storyImage.style.backgroundImage = 'url(' + story.urlToImage + ')';
        else
            storyImage.classList.add('no-image');

        const storyTitle = this.createDiv(['story-title']);
        storyTitle.append(this.createTitle(story.title));

        storyCardFrontFace.append(storyImage);
        storyCardFrontFace.append(storyTitle);

        const storyCardBackFace = this.createDiv(['story-card-face', 'story-card-back-face']);

        const storyBrief = this.createDiv(['story-brief']);
        if(story.description)
            storyBrief.append(this.createAnchor(story.description, story.url))
        else if(story.content)
            storyBrief.append(this.createAnchor(story.content, story.url));
        else
            storyBrief.append(this.createAnchor('Click to go to story', story.url));

        storyCardBackFace.append(storyBrief);

        storyCard.append(storyCardFrontFace);
        storyCard.append(storyCardBackFace);

        return storyCard;
    }

    populateInputFieldOptions(categories, countries, sources) {
        this.populateCategoryField(categories);
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

    putStoryCardsToDom(response) {
        console.log('Response from: putStoryCards: ', response.articles);

        const stories = document.querySelector('#stories');

        response.articles.forEach(story => {
            // console.log(story);
            const storyCard = this.createStoryCard(story);
            stories.append(storyCard);
        });
    }

    sayResultsCategory(endPointName) {
        const storyCategory = document.querySelector('#story-category h2');

        storyCategory.classList.remove('no-results');
        storyCategory.classList.add('results');

        if(endPointName === "topHeadlines" || endPointName === "everything")
            storyCategory.innerHTML = endpoint.endPoints[endPointName].params.category.join(" ");
        else
            storyCategory.innerHTML = "Unknown Category";
    }

    sayNoResults() {
        const storyCategory = document.querySelector('#story-category h2');

        storyCategory.classList.remove('results');
        storyCategory.classList.add('no-results');
        storyCategory.innerHTML = 'No results found';
    }

    clearDom() {
        console.log('Clearing DOM');

        const stories = document.querySelector('#stories');

        console.log(stories);

        stories.innerHTML = "";
    }
}

class DataFetch {
    constructor() {
        this.categories = [];
        this.countries = [];
        this.sources = [];

        this.totalResults = 0;
        this.maxPages = 0;
    }

    fetchStoriesChain(endPointName) {
        this.getStories(endPointName)
            .then(res => res.json())
            .then(res => {
                if(res.status === "ok")
                    return res
                else if(res.status === "error")
                    throw new Error(res.code);
            })
            .then(res => this.updateTotalResults(res))
            .then(res => this.putStoriesToDom(endPointName, res))
            .catch(err => console.log(err));
    }

    getStories(endPointName) {
        let url = "";
        if(endPointName === "topHeadlines") {
            endpoint.updateTopHeadlinesUrl();
            url = endpoint.topHeadlinesUrl;
        } else if(endPointName === "everything") {
            // endpoint.updateEverythingUrl();
            url = endpoint.everythingUrl;
        }

        console.log('Url is: ', url);

        return fetch(url);
    }

    updateTotalResults(response) {
        this.totalResults = response.totalResults;

        this.updateMaxPages();

        console.log('totalResults: ', this.totalResults);

        return response;
    }

    updateMaxPages() {
        console.log('Updating maxPages');

        const pageSize = endpoint.endPoints.topHeadlines.params.pageSize;

        this.maxPages = Math.ceil(this.totalResults / pageSize);

        console.log('maxPages is: ', this.maxPages);
    }

    putStoriesToDom(endPointName, response) {
        // console.log('Response from: putStories: ', response);

        if(this.totalResults) {
            dom.sayResultsCategory(endPointName);

            let page;
            if(endPointName === "topHeadlines" || endPointName === "everything")
                page = endpoint.endPoints[endPointName].params.page;

            if(page > 0 && page === 1) {
                dom.clearDom();
                dom.putStoryCardsToDom(response);
            } else {
                dom.putStoryCardsToDom(response);
            }
            
        } else {
            console.log('Say no results');
            dom.clearDom();
            dom.sayNoResults();
        }
    }

    getCategoriesCountriesAndSources() {
        endpoint.updateSourcesUrl();
        
        return fetch(endpoint.sourcesUrl);
    }

    storeCategoriesCountriesAndSources(response) {
        console.log('Response is: ', response);

        if(response.status === "ok") {
            response.sources.forEach(source => {
                // console.log(source.id);
                if(this.countries.indexOf(source.country) === -1)
                    this.countries.push(source.country);
                if(this.sources.indexOf(source.id) === -1)
                    this.sources.push(source.id);
                if(this.categories.indexOf(source.category) === -1)
                    this.categories.push(source.category);
            });
        } else {
            console.log(`Response error: code: ${response.code}\nmessage: ${response.message}`);
        }
        
        this.categories.sort();
        this.countries.sort();
    }
}

// Global objects
var endpoint = new EndPoint();
var dom = new DOM();
var dataFetch = new DataFetch();


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

    // Reset page number to 1
    endpoint.updatePage('topHeadlines', 1);

    facilitateSearch();

    handleContainerClick();
}

function handleInputFieldChange(event) {
    console.log('Input Field Change');

    const inputField = event.target;
    const inputFieldID = inputField.getAttribute('id');

    identifyFieldAndAct(inputField, inputFieldID);
}


// Functions associated with handlers
function facilitateSearch() {   
    const searchObj = getInputFieldValues();

    console.log(searchObj);

    updateEndpointTopHeadlines(searchObj);

    dataFetch.fetchStoriesChain("topHeadlines");
}

function removeCardFlippedClass() {
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach(storyCard => {
        storyCard.classList.remove('card-flipped');
    });
}

function getInputFieldValues() {
    const query = document.querySelector('#query');
    const category = document.querySelector('#category');
    const country = document.querySelector('#country');
    const sources = document.querySelector('#sources');

    // console.log(query.value);

    const searchObj = { q: query.value };

    if(sources.getAttribute('disabled')) {
        searchObj.category = category.value;
        searchObj.country = country.value;
        searchObj.sources = "";
    } else {
        searchObj.category = "";
        searchObj.country = "";
        searchObj.sources = sources.value;
    }

    return searchObj;
}

function updateEndpointTopHeadlines(searchObj) {
    if(searchObj.q === "")
        endpoint.endPoints.topHeadlines.params.q = "";
    else
        endpoint.endPoints.topHeadlines.params.q = searchObj.q;

    if(searchObj.sources !== "" && searchObj.category === "" && searchObj.country === "") {
        endpoint.endPoints.topHeadlines.params.sources = [searchObj.sources];
        endpoint.endPoints.topHeadlines.params.category = [];
        endpoint.endPoints.topHeadlines.params.country = [];
    } else if(searchObj.sources === "" && (searchObj.category !== "" || searchObj.country !== "")) {
        endpoint.endPoints.topHeadlines.params.sources = [];

        if(searchObj.category !== "" && searchObj.country !== "") {
            endpoint.endPoints.topHeadlines.params.category = [searchObj.category];
            endpoint.endPoints.topHeadlines.params.country = [searchObj.country];
        } else if(searchObj.category !== "") {
            endpoint.endPoints.topHeadlines.params.category = [searchObj.category];
            endpoint.endPoints.topHeadlines.params.country = [];
        } else {
            endpoint.endPoints.topHeadlines.params.category = [];
            endpoint.endPoints.topHeadlines.params.country = [searchObj.country];
        }
    } else {
        endpoint.endPoints.topHeadlines.params.category = ["general"];
        endpoint.endPoints.topHeadlines.params.country = ["in"];
    }

    console.log(endpoint.endPoints.topHeadlines.params);
}

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
    dataFetch.getCategoriesCountriesAndSources()
        .then(res => res.json())
        .then(res => dataFetch.storeCategoriesCountriesAndSources(res))
        .then(() => dom.populateInputFieldOptions(dataFetch.categories, dataFetch.countries, dataFetch.sources))
        .catch(err => console.log(err));
}