
export default function(keys, callback) {
    if (!keys.publish_key || !keys.subscribe_key) {
        return;
    }

    if (!window.PubNub) {
        console.log('window.PubNub is not defined');
        return;
    }

    const pubnub = new window.PubNub({
        publishKey: keys.publish_key,
        subscribeKey: keys.subscribe_key
    });

    pubnub.subscribe({
        channels: ['wordpress']
    });

    pubnub.addListener({
        message: (msg) => {
            if (msg && msg.message) {
                const { post_id: postId } = msg.message;

                callback(postId);
            }
        }
    });
}

