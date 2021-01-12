
var resultSet = [];
const apiURL = 'https://api.lyrics.ovh'
document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
document.getElementsByClassName('next')[0].setAttribute("disabled", true);

document.getElementById("searchLyrics").addEventListener("click", searchLyrics);
document.getElementById("next-btn").addEventListener("click", next);
document.getElementById("prev-btn").addEventListener("click", prev);

results.innerHTML = 'No Result';
count = 0;
// lyricsResult = null;

var input = document.getElementById("myInput");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchLyrics()
    }
});

function showLoader() {
    let ldsSpinner = document.createElement('div');
    ldsSpinner.classList.add('lds-spinner');
    for (let index = 0; index < 12; index++) {
        let newElem = document.createElement('div');
        ldsSpinner.appendChild(newElem);
    }
    document.body.appendChild(ldsSpinner);
}

function hideLoader() {
    let ldsSpinner = document.body.getElementsByClassName('lds-spinner')[0];
    document.body.removeChild(ldsSpinner);
}

// call Common API
const asynchronousAPICall = async (url) => {
    // return fetch(url).then(response => {
    //     return response
    // })
    const response = await fetch(url)
    return response
}

async function searchLyrics(e) {
    showLoader()
    let searchedParam = myInput.value || null;
    if (searchedParam) {
        let url = `${apiURL}/suggest/${searchedParam}`;
        let data = await asynchronousAPICall(url)
            .then(item => {
                console.log(item)
            })
            .catch(err => {
                console.log(err)
            })

        // console.log(data)
        //     const res = await fetch(`${apiURL}/suggest/${searchedParam}`);
        //     const data = await res.json();
        // lyricsResult = data;
        resultSet = data['data'];
        if (resultSet && resultSet.length) {
            document.getElementsByClassName('prev')[0].removeAttribute('disabled');
            document.getElementsByClassName('next')[0].removeAttribute('disabled');
            document.getElementsByClassName('prev')[0].setAttribute("disabled", true)
            count = 1;
            bindHTML(resultSet, count);
        }
    } else {
        results.innerHTML = 'Enter artist or song name...';
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
        document.getElementsByClassName('next')[0].setAttribute("disabled", true);
        hideLoader();
    }
}

function bindHTML(resultSetVal, count) {
    var output = "";
    let resultSet = pagination(resultSetVal, count, 4)
    for (let index = 0; index < resultSet.length; index++) {
        output += '<section class="show-block"><section class="main-title" id="maintitle"><section class="wrap-main-title"><section class="wrap-img"><img src="' + resultSet[index].album.cover_small.replace('https', 'http') + '" loading="lazy"/><section class="name"><b>' + resultSet[index].artist.name + '</b></section><section class="title1">' + resultSet[index].title + '</section><section class="audio-controls"><audio controls="controls" src="' + resultSet[index].preview.replace('https', 'http') + '">Your browser does not support the HTML5 audio element.</audio></section></section></section><section class="show-lyrics"><button class="btn-lyrics-search" onclick="showLyrics(' + index + ')">Show Lyrics</button></section></section><section class="wrap-artist-list"></section></section>';
    }

    if (count == 4) {
        document.getElementsByClassName('next')[0].setAttribute("disabled", true);
    }
    if (count == 1) {
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
    }

    results.innerHTML = output;
    hideLoader();
}

// Get lyrics for song
async function showLyrics(param) {
    var getName = resultSet.filter((item, index) => index == param)
    if (getName && getName.length) {
        let createEle = document.createElement('section');
        createEle.classList.add("artist-list");
        let artistList = document.getElementsByClassName('wrap-artist-list')[param];
        artistList.innerText = ''
        const res = await fetch(`${apiURL}/v1/${getName[0].artist.name}/${getName[0].title}`);
        const data = await res.json();
        createEle.innerHTML = data.lyrics ? `<pre>${data.lyrics}</pre>` : 'No data found';
        // createEle.textContent += data.lyrics || 'No data found';
        artistList.appendChild(createEle);
    }
}

function prev(param) {
    count--;
    if (count) {
        showLoader()
        document.getElementsByClassName('prev')[0].removeAttribute("disabled");
        document.getElementsByClassName('next')[0].removeAttribute('disabled');
        bindHTML(resultSet, count);
    } else {
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
        document.getElementsByClassName('next')[0].removeAttribute('disabled');
    }
}

function next(param) {
    count++;
    if (count) {
        showLoader()
        document.getElementsByClassName('prev')[0].removeAttribute("disabled");
        bindHTML(resultSet, count);
    } else {
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
    }
}

function pagination(array, index, size) {
    // transform values
    index = Math.abs(+index);
    index = index > 0 ? index - 1 : index;
    size = +size;
    size = size < 1 ? 1 : size;

    // filter
    return [...(array.filter((value, n) => {
        return (n >= (index * size)) && (n < ((index + 1) * size))
    }))]
}

const userSearchAction = async (searchedParam) => {
    const response = await fetch(`${apiURL}/suggest/${searchedParam}`);
    const res = await response.json(); //extract JSON from the http response
    console.log(res)
    return res;
}

const userShowAction = () => {
    var getName = resultSet.filter((item, index) => index == param)
    if (getName && getName.length) {
        const res = fetch(`${apiURL}/v1/${getName[0].artist.name}/${getName[0].title}`);
        const data = res.json();
    }
}