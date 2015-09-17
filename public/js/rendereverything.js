if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function rendereverything() {
    // Initialize to default
    window.jsonCurr['isleft'] = false;
    window.jsonCurr['isright'] =  false;
    if (window.curr > window.sizeJSONQA || window.curr < 1) {
        alert("Wrong Hash!");
    } else {
        // parse window.jsonQA unit -> window.jsonCurr
        window.jsonCurr['a'] = window.jsonQA.a[window.curr - 1];
        window.jsonCurr['q'] = window.jsonQA.q[window.curr - 1];     // "q": {"qNum": ...}

        if ((window.curr - 1) == 0) {
            window.jsonCurr['isleft'] = true;
        }
        if (window.curr == window.sizeJSONQA) {
            window.jsonCurr['isright'] = true;
        }
    }

    objLeft = {"navContent": "<a href=\"#{0}\" id=\"doit-goleft\"><i class=\"glyphicon glyphicon-chevron-left\"></i></a>".format(window.curr - 1)};
    objRight = {"navContent": "<a href=\"#{0}\" id=\"doit-goright\"><i class=\"glyphicon glyphicon-chevron-right\"></i></a>".format(window.curr + 1)};

    if (jsonCurr.isleft) {
        objLeft = {"navContent": ""};
    }
    if (jsonCurr.isright) {
        objRight = {"navContent": "没有下一题了"};
    }

    $('#nav-left').html(render_hbsNav(objLeft));
    $('#nav-right').html(render_hbsNav(objRight));
    $('#content-quickanswer').html(render_hbsContent(window.jsonCurr));
}