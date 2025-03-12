const IGCDecoder = require('./igc-decoder.js')

function decodeIGC(igcData) {
    const track = new IGCDecoder(igcData)
    track.parse(true, true)      	
    return track
}

module.exports.decodeIGC = decodeIGC