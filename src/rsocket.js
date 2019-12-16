const {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} = require('rsocket-core');
const RSocketWebSocketClient = require('rsocket-websocket-client').default;

export default class RSocketFeatureClient {

    client: RSocketClient;
    x: number;

    constructor(url: String) {

        //Create RSocket
        if (this.client !== undefined) {
            this.client.close();
            //   document.getElementById("messages").innerHTML = "";
        }
        this.client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
            },
            setup: {
                keepAlive: 60000,
                lifetime: 180000,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            transport: new RSocketWebSocketClient({
                url: url
            }),
        });

        if (this.client === undefined) {
            console.error("Error creating rsocket with url: " + url);
        }
    }

    createNumber(y: Number) : Number  {
        this.x = y+1;
        return x;
    }

    getNumber(): number {
        return this.x;
    }

    requestStream(url: String, messageRoute: String, recvCallBack: function) {

       // this.client = this.addErrorMessage(url);
        this.client.connect().subscribe({
                onComplete: socket => {
                    socket.requestStream({
                        data: {
                            //   'author': document.getElementById("author-filter").value
                        },
                        metadata: String.fromCharCode(messageRoute.length) + messageRoute,
                    }).subscribe({
                        onComplete: () => console.log('complete'),
                        onError: error => {
                            console.log(error);
                            this.addErrorMessage("Connection has been closed due to ", error);
                        },
                        onNext: payload => {
                            console.log(payload.data);
                            recvCallBack(payload.data);
                            // reloadMessages(payload.data);
                        },
                        onSubscribe: subscription => {
                            subscription.request(2147483647);
                        },
                    });
                },
                onError: error => {
                    console.log(error);
                    this.addErrorMessage("Connection has been refused due to ", error);
                },
                onSubscribe: cancel => {
                    /* call cancel() to abort */
                }
            });
    }

    addErrorMessage(prefix, error) {
        // var ul = document.getElementById("messages");
        // var li = document.createElement("li");
        // li.appendChild(document.createTextNode(prefix + error));
        // ul.appendChild(li);
    }
}
