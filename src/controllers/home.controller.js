import { notification, contact } from "../services/index";

module.exports.getHome = async (req, res, next) => {
    // Only (10 items one time)
    let notifications = await notification.getNotifications(req.user._id);

    // Get amount notification unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    // Get contatcs (10 items one time)
    let contacts = await contact.getContacts(req.user._id);
    
    // Get contatcs sent (10 items one time)
    let contactsSent = await contact.getContactsSent(req.user._id);

    // Get contatcs received (10 items one time)
    let contactsReceived = await contact.getContactsReceived(req.user._id);

    // Count contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    return res.render('main/home/home.ejs', {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications,
        countNotifUnread,
        contacts,
        contactsSent,
        contactsReceived,
        countAllContacts,
        countAllContactsSent,
        countAllContactsReceived
    });
}
