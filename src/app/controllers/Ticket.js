

class Ticket {
    index (req, res) {
        res.render('ticket', {
            isTicket: true
        })
    }
}

module.exports = new Ticket();