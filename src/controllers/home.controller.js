import { notification } from "../services/index";

module.exports.getHome = async (req, res, next) => {
    // Only 10 items one time
    let notifications = await notification.getNotifications(req.user._id);

    // Get amount notification unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    return res.render('main/home/home.ejs', {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications,
        countNotifUnread
    });
}
