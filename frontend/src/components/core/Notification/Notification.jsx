
import { useSelector } from "react-redux"
import NotificationsDemo from "../Notification/NotificationDemo"





export default function Notification() {
    const {user} =   useSelector((state) => state.profile);

    const userId = user._id;


 return (



                     <div>
                    <NotificationsDemo userId={userId} />
                    </div>
 )


}