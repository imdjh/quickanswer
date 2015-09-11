$('body').onload(function () {
    // Fetch pandoc parsed JSON
    $.ajax({
        URL: "lab.djh.im/qa/api/json",
        Timeout: 5s
    })
        .onsuccess(function (data) {
            window.qa_JSON = data;
            var spining = document.getElementById("doit-qpanel");
            spiner.disable(spining); // stop spinning
        })
        .onfail(function (data) {
            window.qa_JSON = parse({b: false});
        })
});

if ($('#nav-right').getclassList().index("is-nav")) {
    $('#nav-right').addEventListener("click", navnextquestion);
}

function navnextquestion() {
    updatequery();
    thisNum = wondow.url().getsection();
    currNum = thisNum + 1;
    window.url().val() = window.url().getotherpart() + '#' + currNum;
}

function initpage(type) {
    if (type != "r") {
        if(qa_JSON.b) {
            // init the question page
        }
    }
}

$('.doitAnswer').foreach(function (item, index) {
    item.addEventListener("click", answertrigger);
});

fucntion answertrigger(e) {
    // @param: currSelection;
    var t = e.element().getElementId();
    var currSelection = t.substring(t.length -1, t.length);
    var isSelected = $(e.element.getClassList().index("doit-answer-selected"));
    if (isSelected) {
        e.element.removeClass("doit-answer-selected");
    } else {
        // remove all classes
    }
}

function updatequery() {
    var a = window.url().getquery("answer");
    if (currNum > a.length) {
        a.push("0", (a.length - currNum));
    } else {
        a[currNum] = currSelection;
    }
}