function checkanswers(stringAnswer) {
    var arrayQA = jsonCurr.a.split('').sort();
    var arrayMyA = stringAnswer.split('').sort();

    if (arrayQA.toString() != arrayMyA.toString()) {
        swal({
            title: "这题错了哦，再看看吧！",
            timer: 1200,
            showConfirmButton: false,
            type: "error"
        });
    } else {
        swal({
            title: "你做对啦，真棒！",
            timer: 900,
            showConfirmButton: false,
            imageUrl: "/images/thumbs-up.jpg"
        });
    }
}

function attachEvents() {
    window.stringAnswers = '';      // current user selections

    $('.doit-answer').each(function () {
        // eyecandy on mouse events
        $(this).mouseover(function () {
            $(this).addClass('doit-onmouse');
        });
        $(this).mouseout(function () {
            // cancel
            $(this).removeClass('doit-onmouse');
        });

        // on click any answer
        $(this).click(function () {
            // Log selections
            // TODO: satisfy multi answers


            // Storage current selection to stringAnswers
            var stringID = $(this).attr('id');
            var currID = Number(stringID.substr(stringID.length - 1));
            var stringAnswer = '';      // Answer of current selection
            if (!isNaN(currID)) {
                switch (currID) {
                    case 1:
                        stringAnswer = 'A';
                        break;
                    case 2:
                        stringAnswer = 'B';
                        break;
                    case 3:
                        stringAnswer = 'C';
                        break;
                    case 4:
                        stringAnswer = 'D';
                        break;
                }
                if ($(this).hasClass('doit-answer-selected')) {
                    // Removing already selected
                    $(this).removeClass('doit-answer-selected');
                    window.stringAnswers = window.stringAnswers.replace(stringAnswer, '');
                } else {
                    if (window.jsonCurr.a.length != 1) {
                        $(this).addClass('doit-answer-selected');
                        window.stringAnswers += stringAnswer;
                    } else {
                        $('.doit-answer').each(function () {
                            $(this).removeClass('doit-answer-selected');
                        });
                        $(this).addClass('doit-answer-selected');
                        window.stringAnswers = stringAnswer;
                        checkanswers(window.stringAnswers);
                    }
                }
            } else {
                alert("Wrong doit-answer elementID")
            }
        });
    });
    $('#doit-goleft').click(function () {
        window.curr -= 1;
        rendereverything();
        attachEvents();
    });
    $('#doit-goright').click(function () {
        window.curr += 1;
        rendereverything();
        attachEvents();
    });
}