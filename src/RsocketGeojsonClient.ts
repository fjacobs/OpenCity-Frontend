import {APPLICATION_JSON, RSocketClient, JsonSerializer, IdentitySerializer, MESSAGE_RSOCKET_ROUTING} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import {setErrorNotification} from "./index";
const uuidv1 = require('uuid/v1');

// @ts-ignore
export default class RSocketGeojsonClient {

    // @ts-ignore
    private client: RSocketClient;
    private url: string;
    private guuid: string;

    constructor(url: string) {

        this.url = url;
        this.guuid =  uuidv1();
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
            transport: new RSocketWebSocketClient({
                debug:true,
                url:url
            })
        } );
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


    requestStream(messageRoute: String, callbackRecv, onComplete) {

        this.client.connect().subscribe({
            onComplete: socket => {
                socket.requestStream({
                    data: null,
                    metadata: String.fromCharCode(messageRoute.length) + messageRoute,
                }).subscribe({
                    onComplete: () => {
                        console.log('RSocket.requestStream onComplete() called.');
                        onComplete(messageRoute);
                    },
                    onError: error => {
                        error.url = this.url+"/"+messageRoute;
                        let streamError = {Id:this.guuid, Name:"TravelTime.rSocketClient", Description:"Error during streaming: "+ error, Category: 3, Availability: false };
                        setErrorNotification(streamError);
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
                error.url = this.url+"/"+messageRoute;
                let connectionError = {Id: this.guuid, Name:"TravelTime RSocketClient", Description:"Could not connect to: " + error.url, Category: 3, Availability: false };
                setErrorNotification(connectionError);
            },
            onSubscribe: cancel => {
                /* call cancel() to abort */},
        });
    }

}
