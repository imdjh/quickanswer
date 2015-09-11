var express = require('express');
var multer = require('multer');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

var upload = multer({
    dest: './uploading',
    limits: {
        files: 1
    },
    fileFilter: function fileFilter(req, file, cb) {
        // Reject if not docx
        if (file.mimetype != "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(new Error('This is not a valid .docx File!'));
        } else {
            cb(null, true);
        }
    }
});
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(403).end();                                              // Forbidden root access
});

router.get('/json', function (req, res, next) {
    // return dummy JSON from ./contents/xxxx dir
    var qaID = req.query.n;
    var c = fs.readFileSync(path.join(path.dirname(module.parent.filename), 'contents', qaID, 'qa.json'));
    res.send(JSON.parse(c));

    // res.status(501).end();                  // Not implemented
});

router.post('/updocx', upload.single('thedocx'), function (req, res, next) {
    var qaID = parseInt(Math.random() * 10000, 10);
    // rename uploaded file
    var rename = 'mv ./uploading/' + req.file.filename + ' ./uploading/' + qaID;
    var phase0 = exec(rename, function (err, stdout, stderr) {
        if (err) throw err;                                             // Failed to move file
        else {
            var mkdir = 'mkdir -p ./contents/' + qaID;
            exec(mkdir, function (err, stdout, stderr) {
                if (err) throw err;                                     // Failed to create directory
                else phasePandoc(qaID);                                 // If success, call pandoc
            });
        }
    });
    res.end();                                                          // End of updocx
});

function phasePandoc(qaID) {
    // TODO: output spec_JSON to ./contents/xxxx dir  | it's 13-14 jobs
    // output to ./contents/<qaID>
    // var optionList = qaID;
    // var pandoc = spawn('pandoc', [optionList]);


    var pandoc = spawn('echo', [optionList]);
    pandoc.stdout.on('end', function (d) {
        console.log(qaID);                                              // End of pandoc phase
    });
}

module.exports = router;
