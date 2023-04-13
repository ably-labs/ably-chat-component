export default class AblyBaseComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.connectToAblyChannel();
    }
    
    disconnectedCallback() {
        this.subscribedChannels.forEach(ch => { ch.unsubscribe(); });
    }    

    connectToAblyChannel() {
        const ablyApiKey = this.getAttribute("data-api-key");
        const ablyTokenUrl = this.getAttribute("data-get-token-url");
        let ablyConfig = {};
        if (ablyApiKey) {
          ablyConfig['key'] = ablyApiKey;
        } else {
          ablyConfig['authUrl'] = ablyTokenUrl;
        }

        this.ably = new Ably.Realtime(ablyConfig);
        this.subscribedChannels = [];
    }

    publish(channelName, ...publishArguments) {
        const [ ignored, ...args ] = arguments;
        const channel = this.ably.channels.get(channelName);

        channel.publish.apply(channel, args);

        if (!this.subscribedChannels.includes(channel)) {
            this.subscribedChannels.push(channel);
        }
    }

    subscribe(channelName, ...subscriptionArguments) {
        const [ ignored, ...args ] = arguments;
        const channel = this.ably.channels.get(channelName);
        
        channel.subscribe.apply(channel, args);

        if (!this.subscribedChannels.includes(channel)) {
            this.subscribedChannels.push(channel);
        }
    }
}
