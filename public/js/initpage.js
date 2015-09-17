function initpage() {
    var urlHash = window.location.hash;
    window.jsonCurr = {'isleft': false, 'isright': false};
    window.curr;      // current question ID, starting from 1

    if (urlHash) {
        window.curr = parseInt(urlHash.substring(1, urlHash.length));
        if (isNaN(window.curr)) {
            alert("Wrong Hash!");
        }
    } else {
        window.curr = 1;
    }
}