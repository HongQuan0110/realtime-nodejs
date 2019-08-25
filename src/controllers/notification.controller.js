import { notification } from "../services/index";

module.exports.readMore = async (req, res, next) => {
    try {
        // get skip number from query param
        let skipNumberNotification = +req.query.skipNumber;
        // get more item
        let newNotifications = await notification.readMore(req.user._id, skipNumberNotification);
        
        return res.status(200).send(newNotifications);
    } catch (error) {
        console.log("notification controller", error);
        return res.status(500).send(error);
    }
}

module.exports.markAllAsRead = async (req, res, next) => {
    try {
        let mark = await notification.markAllAsRead(req.user._id, req.body.targetUsers);
        return res.status(200).send(mark);
    } catch (error) {
        console.log("Error markAllAsRead:", error);
        return res.status(500).send(error);
    }
}
