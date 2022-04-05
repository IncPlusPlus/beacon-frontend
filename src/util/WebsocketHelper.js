/**
 * Determines what kind of entity the path is about. Events could come from the path
 * <p>
 * /topic/tower/623de7d41b2b8c392b5e23d0/channel/623f9a06023ebe6403a6446d/message OR
 * <p>
 * /topic/tower/623de7d41b2b8c392b5e23d0/channel OR
 * <p>
 * /topic/tower
 * <p>
 * which means we need to determine what handler method to send an event to based on
 * the path it came in from.
 * @param path the path that the incoming event was received from
 * @return {string} the entity the event is about. This may be 'message', 'channel', or 'tower'
 */
export const TopicForPath = (path) => {
    if (path.includes('message')) {
        // Event relates to creation/edit/deletion of a message
        return "message";
    } else if (path.includes('channel')) {
        // Event relates to the creation/edit/deletion of a channel
        return "channel";
    } else if (path.includes('tower')) {
        // Event relates to the creation/edit/deletion of a tower
        return "tower";
    }
}