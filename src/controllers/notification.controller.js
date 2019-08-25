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