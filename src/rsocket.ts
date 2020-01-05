import {APPLICATION_JSON} from "rsocket-core";

// @ts-ignore
const {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer,
    MESSAGE_RSOCKET_ROUTING,
} = require('rsocket-core');

// @ts-ignore
const RSocketWebSocketClient = require('rsocket-websocket-client').default;

export default class RSocketGeojsonClient {

    // @ts-ignore
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
                dataMimeType: 'application/stream+json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            transport: new RSocketWebSocketClient({url: url}),
        });
    }

    async requestResponse(messageRoute: String) {

       const socket = await this.client.connect();

       return new Promise ((resolve, reject) => {
            socket.requestResponse({
                data: null,
                metadata: String.fromCharCode(messageRoute.length) + messageRoute,
            })
            .subscribe({
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

    requestStream(messageRoute: String, callbackRecv, onComplete, callBackError) {

        this.client.connect().subscribe({
            onComplete: socket => {
                socket.requestStream({
                    data: null,
                    metadata: String.fromCharCode(messageRoute.length) + messageRoute,
                }).subscribe({
                    onComplete: () => {
                        console.log('RSocket.requestStream->onComplete() called.');
                        onComplete(messageRoute);
                    },
                    onError: error => {
                        console.log("requestStream error: " + error);
                    },
                    onNext: payload => {
                        callbackRecv(payload);
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
