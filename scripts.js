var resultSet = [];
const apiURL = 'https://api.lyrics.ovh';
document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
document.getElementsByClassName('next')[0].setAttribute("disabled", true);
results.innerHTML = 'No Result';
count = 0;
lyricsResult = null;
async function searchLyrics() {
    let searchedParam = getName.value || null;
    if (searchedParam) {
        const res = await fetch(`${apiURL}/suggest/${searchedParam}`);
        const data = await res.json();
        lyricsResult = data;
        resultSet = data['data'];
        if (resultSet && resultSet.length) {
            document.getElementsByClassName('prev')[0].removeAttribute('disabled');
            document.getElementsByClassName('next')[0].removeAttribute('disabled');
            document.getElementsByClassName('prev')[0].setAttribute(!count ? "disabled" : '', true)
        }
        bindHTML(resultSet);
    } else {
        results.innerHTML = 'Enter artist or song name...';
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
        document.getElementsByClassName('next')[0].setAttribute("disabled", true);
    }
}

function bindHTML(resultSetVal) {
    var output = "";
    let resultSet = pagination(resultSetVal, count, 10)
    for (let index = 0; index < resultSet.length; index++) {
        output += '<section class="show-block"><section class="main-title" id="maintitle"><section class="wrap-main-title"><span class="name"><b>' + resultSet[index].artist.name + '</b></span> - <span class="title">' + resultSet[index].title + '</span></section><section class="show-lyrics"><button class="accordion" onclick="showLyrics(' + index + ')">Show Lyrics</button></section></section><section class="wrap-artist-list"></section></section>';
    }
    results.innerHTML = output;
}

// Get lyrics for song
async function showLyrics(param) {
    var getName = resultSet.filter((item, index) => index == param)
    if (getName && getName.length) {
        let createEle = document.createElement('section');
        createEle.classList.add("artist-list");
        let artistList = document.getElementsByClassName('wrap-artist-list')[param];
        const res = await fetch(`${apiURL}/v1/${getName[0].artist.name}/${getName[0].title}`);
        const data = await res.json();
        createEle.innerHTML = data.lyrics || 'No data found';
        artistList.appendChild(createEle);
    }
}
function prev(param) {
    count--;

    count++;
    let prevPaginator = prevPaginator || lyricsResult.prev;
    if (count && prevPaginator) {
        document.getElementsByClassName('prev')[0].setAttribute(!count ? "disabled" : '', true);

        // https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?limit=15&q=stairway&index=15
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS');

        await fetch(`https://cors-anywhere.herokuapp.com/${prevPaginator}`, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.text())
            .then(resp => {
                console.log(resp);
                bindHTML(resp['data'])
                prevPaginator = resp['prev'];
            });
    } else {
        document.getElementsByClassName('prev')[0].setAttribute("disabled", true);
    }

}

async function next(param) {
    count++;
    let nextPaginator = nextPaginator || lyricsResult.next;
    if (count) {
        document.getElementsByClassName('prev')[0].removeAttribute("disabled");
        // https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?limit=15&q=stairway&index=15
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS');

        await fetch(`https://cors-anywhere.herokuapp.com/${nextPaginator}`, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.text())
            .then(resp => {
                console.log(resp);
                bindHTML(resp['data'])
                nextPaginator = resp['next'];
            });
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