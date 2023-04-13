import AblyBaseComponent from "./AblyBaseComponent";

// This is a version of Ably chat that inherits from `AblyBaseComponent`
// It's a demo of how all the "Ably logic" can exist in a base component
// that is built upon, in this case, by a chat web component.

export default class AblyChat extends AblyBaseComponent {

    static get observedAttributes() {
        return ['messages'];
    } 

    get messages() {
        const val = this.getAttribute('messages') || "[]";
        return JSON.parse(val);
    }

    set messages(messages) {
        this.setAttribute('messages', JSON.stringify(messages));
    }

    constructor() {
        super();
    }

    connectedCallback() {
        // This is the web component version of reacts "componentDidMount"
        super.connectedCallback();

        const subscribeChannelAttr = this.getAttribute("subscribe-channel");
        const subscribeChannel = subscribeChannelAttr ? subscribeChannelAttr : 'chat';
        super.subscribe(subscribeChannel, 'chat-message', (message) => {
            this.onAblyMessageReceived(message);
        });

        this.id = uuidv4();
        this.renderTemplateAndRegisterClickHandlers();
        this.inputBox.focus();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {          
        if (oldValue != newValue) {
            // Just update the chatText contents
            // Doing this means we don't need to wastefully re-render the entire template
            // and re-register all the click handlers.

            this.chatText.innerHTML = this.formatMessages(this.messages);
            this.messageEnd.scrollIntoView(); // This isn't working?
        }
    }
    
    renderTemplateAndRegisterClickHandlers() {
        this.innerHTML = defaultMarkup(this.id);
        this.chatText = this.querySelectorAll(".chatText")[0];
        this.inputBox = this.querySelectorAll(".textarea")[0];
        this.sendButton = this.querySelectorAll(".button")[0];
        this.messageEnd = this.querySelectorAll(".messageEnd")[0];

        this.sendButton.addEventListener('click', (event) => {
            this.sendChatMessage(this.inputBox.value);
        });

        this.inputBox.addEventListener('keypress', (event) => {
            this.handleKeyPress(event);
        });        
    }

    onAblyMessageReceived(message) {
        const history = this.messages.slice(-199);
        const updatedMessages = [...history, message];
        this.messages = updatedMessages; 
    }

    sendChatMessage(messageText) {
        const publishChannelAttr = this.getAttribute("publish-channel");
        const publishChannel = publishChannelAttr ? publishChannelAttr : 'chat';
        super.publish(publishChannel, { name: "chat-message", data: messageText });
        this.inputBox.value = "";
        this.inputBox.focus();
    }

    handleKeyPress(event) {
        const messageText = this.inputBox.value;
        const messageTextIsEmpty = messageText.trim().length === 0;
        
        if (event.key === "Enter" && !messageTextIsEmpty) {
            this.sendChatMessage(messageText);
            event.preventDefault();
        }
    }

    formatMessages(messages) {            
        const messageMarkup = messages.map((message, index) => {
            const author = message.connectionId === this.ably.connection.id ? "me" : "other";
            return `<span class="message" data-author=${author}>${message.data}</span>`;
        });

        return messageMarkup.join("\n");
    }
}

function uuidv4() {
    return "comp-" + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const defaultMarkup = (id) => (
`
<div id="${id}">
<chat>
<style>
    #${id} .chatHolder {
    display: grid;
    grid-template-rows: 1fr 100px;
    background-color: white;
    }

    #${id} .chatText {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1em;
    padding: 1em;
    height: calc(100vh - 40px - 100px - 100px - 100px);
    overflow-y: auto;
    }

    #${id} .form {
    display: grid;
    grid-template-columns: 1fr 100px;
    border-top: 1px solid #eee;
    }

    #${id} .textarea {
    padding: 1em;
    border: 0;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto, Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue, sans-serif;
    font-size: 1.2em;
    }

    #${id} .button {
    border: 0;
    color: white;
    font-weight: bold;
    font-size: 1.4em;
    background: linear-gradient(to right, #363795, #005C97);
    }

    #${id} .button:hover {
    background: linear-gradient(90deg, rgba(54,55,149,1) 0%, rgba(0,92,151,1) 62%, rgba(0,125,205,1) 100%);
    }

    #${id} .button:disabled, 
    #${id} .button:hover:disabled {
    background: linear-gradient(to right, #363795, #005C97);
    opacity: 0.5;
    }

    #${id} .message {
    background-color: #eef5f8;
    padding: 1em;
    border-radius: 10px;
    flex-grow: 0;
    border-bottom-left-radius: 0;
    }

    #${id} [data-author="me"] {
        background: linear-gradient(to right,#363795,#005C97);
        color: white;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;
        border-bottom-right-radius: 0!important;
        border-bottom-left-radius: 10px!important;
    }

</style>
<div class="chatHolder">
    <div class="chatText">
    <div class="messageEnd"></div>
    </div>
    <div class="form">
        <textarea class="textarea"></textarea>
        <button class="button">Send</button>
    </div>
</div>
</chat>
</div>
`);
  
customElements.define('ably-chat', AblyChat);