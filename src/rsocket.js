import {APPLICATION_JSON} from "rsocket-core";

const {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer,
    MESSAGE_RSOCKET_ROUTING,
} = require('rsocket-core');

const RSocketWebSocketClient = require('rsocket-websocket-client').default;

export default class RSocketGeojsonClient {

    client: RSocketClient;

    constructor(url: String) {

        const keepAlive = 60000;
        const lifetime = 180000;

        this.client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
            },
            setup: {
                keepAlive: keepAlive,
                lifetime: lifetime,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            transport: new RSocketWebSocketClient({url: url}),
        });
    }

    /* Note that rsocket is a higher level protocol that can use websocket as a transport -
       neither the client or server can start pushing arbitrary data to the other (as in your WS example)
       unless it initiates one of the defined actions (request-response, request-stream, etc).
       In this case the client would typically make a requestResponse with a payload indicating the data it is requesting, and the server would reply
       ith one response (to send multiple payloads use request stream). The corresponding response payload would be accessible via the onComplete handler
       to requestResponse (missing in your second example).
     */

    async requestResponse(messageRoute: String) {

       const socket = await this.client.connect();

       return new Promise ((resolve, reject) => {
            socket.requestResponse({
                data: null,
                metadata: String.fromCharCode(messageRoute.length) + messageRoute,
            }).subscribe({
                onComplete: complete => resolve(complete),
                onError: error => {
                    reject(error);
                },
                onNext(payload: any) {
                    console.log('onNext(%s)', payload.data);
                },
            });
            setTimeout(() => {
            }, 30000000);
        })
    }

    requestStream(messageRoute: String, callbackRecv: function, callBackError: function) {

        this.client.connect().subscribe({
            onComplete: socket => {
                socket.requestStream({
                    data: null,
                    metadata: String.fromCharCode(messageRoute.length) + messageRoute,
                }).subscribe({
                    onComplete: () => console.log('complete'),
                    onError: error => {
                        console.log("requestStream error: " + error);
                    },
                    onNext: payload => {
                        callbackRecv(payload.data);
                    },
                    onSubscribe: subscription => {
                        subscription.request(2147483647);
                    },
                });
            },
            onError: error => {
                console.error(error);
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
