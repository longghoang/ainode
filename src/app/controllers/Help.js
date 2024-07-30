const HelpModel = require('../models/Help.model');
const HelperModel = require('../models/Helper.model');

class Help {
    async index (req, res) {
        try {
            const helps = await HelpModel.find({});
            const helpers = await HelperModel.find({});
            if (!helps || !helpers) return res.send('Unavailable help!');
            return res.render('help', {
                isHelp: true,
                helps,
                helpers
            })
        } catch (error) {
            return res.send('Unavailable help!');
        }
    }
}
module.exports = new Help();