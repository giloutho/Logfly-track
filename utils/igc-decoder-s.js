const IGCParser = require('igc-parser');

function decodeIGC(igcData) {
    let result
    try {
        result = IGCParser.parse(igcData);        
    } catch (error) {
        console.log('error IgcParser : '+error)
        result = 'error IgcParser : '+error
    }
    return result
}

module.exports.decodeIGC = decodeIGC