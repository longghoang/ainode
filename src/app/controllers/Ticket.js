const TicketRegistrationSchema = require('../models/Ticket.model') 
const moment = require('moment');
class Ticket {
    index (req, res) {
        res.render('ticket', {
            isTicket: true
        })
    }

   async register (req, res, next) {
    try {
   
        const uid = req.signedCookies.uid; 
  
        console.log("dang ky", uid)
  
    
        const homeDelivery = req.body.homeDelivery === 'on';
  
  
        const data = {
            ...req.body,
            homeDelivery,
            uid,
        };
  
        const newTicket = new TicketRegistrationSchema(data);
        await newTicket.save();
  
  
        res.redirect('/');
    } catch (error) {
        next(error);
    }
    }

    /// managment
    async managment (req, res, next) {
        try {
            const uid = req.signedCookies.uid; 
        
            console.log("uid =", uid)
        
            // Lấy tất cả các vé từ cơ sở dữ liệu
            const tickets = await TicketRegistrationSchema.find({ uid });
        
             console.log(tickets)
        
            
        
            // Lọc và chuyển đổi dữ liệu
            const formattedTickets = tickets.map(ticket => ({
              cardType: ticket.cardType,
              fullName: ticket.fullName,
              birthDate: moment(ticket.birthDate).format('DD/MM/YY'), 
              address: ticket.address,
              phone: ticket.phone,
              registrationDate: moment(ticket.registrationDate).format('DD/MM/YY'), 
              homeDelivery: ticket.homeDelivery ? 'Có' : 'Không',
              receiveLocation: ticket.receiveLocation,
            }));
        
        
            const hasTickets = formattedTickets.length > 0;
        
        
            res.render('ManagmentTicket', { tickets: formattedTickets, hasTickets  });
          } catch (error) {
            next(error);
          }
        }

}

module.exports = new Ticket();