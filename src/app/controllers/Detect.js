class DetectModel {
    index (req, res, next) {
        res.send('ok');
    }
}

module.exports = new DetectModel();