const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const igcRead = require('../utils/igc/igc-read.js')
const IGCAnalyzer = require('../utils/igc/igc-analyzer.js')

// https://medium.com/@julien.maffar/impl%C3%A9mentation-de-multer-dans-une-api-node-js-e358dd513e64
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to prevent name conflicts
  },
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  const igcName = 'test.IGC'
  const appDir = path.dirname(require.main.filename);
  const filePath = path.join(appDir, 'igc', igcName);
  renderTrack(filePath,res,'test',)
});

router.get("/test", (req, res) => {
  const igcName = 'test.IGC'
  const appDir = path.dirname(require.main.filename);
  const filePath = path.join(appDir, 'igc', igcName);
  renderTrack(filePath,res,'test',)
});

// Handle file upload and display the content
router.post('/upload', upload.single('textFile'), (req, res) => {
  if (!req.file) {
    return res.send('No file uploaded.');
  }
  // Read the uploaded file content
  const appDir = path.dirname(require.main.filename);
  const filePath = path.join(appDir, 'uploads', req.file.filename);
    renderTrack(filePath,res,'igcfile',)
  });

function renderTrack(filePath,res, page) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      const msg = 'Error reading the file : '+filePath
      console.log('erreur')
      res.render('index',{ fileContent: msg});
    }
    // In Logfly, first, the track is simply decoded to obtain all the flight data 
    // Result is displayed on a small map
    const track = igcRead.decodeIGC(data)
    //In a second step, an analysis is generated
    // the track is displayed on a full-screen map
    const anaTrack = new IGCAnalyzer()
    anaTrack.compute(track.fixes)
    //The final step is to download the ground heights
    res.render(page,{ mainTrack : track, anaTrack : anaTrack });
  });
}

module.exports = router;
