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
        // Disable just now
        if (file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(new Error('This is not a valid .docx File!'));
        } else {
            cb(null, true);
        }

    }
});
var router = express.Router();
var approotPath = path.dirname(module.parent.filename);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(403).end();                                              // Forbidden root access
});

router.get('/json', function (req, res, next) {
    // http://<host>/api/json?n=<qaID>
    var qaID = req.query.n;
    var c = fs.readFileSync(path.join(approotPath, 'contents', qaID.toString(), 'qa.json'));
    // DEBUG
    /**
     res.setHeader(
     'Content-Type', 'application/json');
     res.setHeader(
     'Access-Control-Allow-Origin', '*');
     */
    res.send(JSON.parse(c));
});

router.post('/updocx', upload.single('thedocx'), function (req, res, next) {
    var qaID = parseInt(Math.random() * 10000, 10);
    var rename = 'mv ./uploading/' + req.file.filename + ' ./uploading/' + qaID + '.doc';  // rename uploaded file

    var phase0 = exec(rename, function (err, stdout, stderr) {
        if (err) throw err;                                             // Failed to move file
        else {
            var mkdir = 'mkdir -p ./contents/' + qaID;
            exec(mkdir, function (err, stdout, stderr) {
                if (err) throw err;                                     // Failed to create directory
                else {
                    phasePandoc(qaID, res);                                   // If success, call pandoc

                }
            });
        }
    });
    // res.end();                                                          // End of updocx
});

function phasePandoc(qaID, res) {
    // TODO: remove hardcoded ``.doc''
    argsUNOconv = ['-f', 'html', '-o', path.join(approotPath, 'contents', qaID.toString(), qaID + '.html'),
        path.join(approotPath, 'uploading', qaID + '.doc')];

    childUNOconv = spawn('unoconv', argsUNOconv);
    childUNOconv.on('close', function (code) {
        execPandoc = 'pandoc -f html -t json' + ' ' + path.join(approotPath, 'contents', qaID.toString(),
                qaID + '.html') + ' ' + '-o' + path.join(approotPath, 'contents', qaID.toString(), 'out.json');
        exec(execPandoc, function (err, stdout, stderr) {
            if (err) throw err;
            else {
                var execFilter = 'python' + ' ' + path.join(approotPath, 'bin', 'myfilter.py');
                optFilter = {"cwd": path.join(approotPath, 'contents', qaID.toString())};
                exec(execFilter, optFilter);
                console.log('Successful generated, ID: ' + qaID + '!');
                res.redirect('../qa/' + qaID);
            }

        });
    });
};


module.exports = router;
