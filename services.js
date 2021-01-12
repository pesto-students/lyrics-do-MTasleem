const apiURL = 'https://api.lyrics.ovh';
const resultSet = [];

const userSearchAction = async () => {
    const response = await fetch(`${apiURL}/suggest/${searchedParam}`);
    const res = await response.json(); //extract JSON from the http response
    resultSet = res.json()
    return res.json();
}

export default searchLyrics = () => {
    let searchedParam = myInput.value || null;
    if (searchedParam) {
        const res = fetch(`${apiURL}/suggest/${searchedParam}`);
        resultSet = res.json()
        return res.json();
    }
}

export default showLyrics = () => {
    var getName = resultSet.filter((item, index) => index == param)
    if (getName && getName.length) {
        const res = fetch(`${apiURL}/v1/${getName[0].artist.name}/${getName[0].title}`);
        const data = res.json();
    }
}