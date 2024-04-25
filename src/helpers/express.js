'use strict';
(function () {
    const express = require('express');
    // const ngrok = require('ngrok');
    const axios = require('axios');
    var ngrok_nodejs = require("@ngrok/ngrok");
    const { Server } = require("socket.io");
    const { io } = require("socket.io-client");
    var session = '';
    var session_id;


    const app = express();
    // const publicPath = path.resolve(__dirname, '../dist');
    const port = 4000;

    // point for static assets
    // app.use(express.static(publicPath));

    //view engine setup
    // app.set('views', path.join(__dirname, '../dist'));
    // app.engine('html', require('ejs').renderFile);
    // app.set('view engine', 'html');

    // app.use(logger('dev'));
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));

    // app.use('/', routes);

    // app.use(cookieParser());

    app.get('/enable-sp-control', (req, res) => {
        // res.sendFile('index.html', { root: __dirname });

        (async function () {
            //When SP Control is enabled, and allow external control is selected.
            //1. Create a web socket connection
            //2. Create an ngrok connection (both http and tcp)

            const io = new Server(4000, { pingInterval: 2000, pingTimeout: 5000 });
            io.on("connection", (socket) => {
                // ...
                console.log("connection to created socket at: ".concat(new Date().toLocaleTimeString()));
            });

            const res = await axios.get('https://api.ngrok.com/tunnel_sessions', {
                headers: {
                    'Authorization': 'Bearer 2RxyddNquVUsbclmKkrN9POK9j1_Joh8LMatgfKscCoQNmnq',
                    'Ngrok-Version': '2'
                }
            });
            if ((res.data) && (res.data.tunnel_sessions.length > 0)) {
                console.log('A session exist already')
                session_id = res.data.tunnel_sessions[0].id

                //check if session exist locally within this app
                if (session) {
                    console.log('Session exists locally, so going ahead to establish a tunnel');
                    //open http tunnel
                    const tunnelHttp = await session.httpEndpoint().listen();
                    console.log("Tunnel established at:", tunnelHttp.url());

                    //open tcp tunnel
                    const tunnelTCP = await session.tcpEndpoint().listen();
                    console.log("Tunnel established at:", tunnelTCP.url());
                    //save tcp tunnel url also as part of remote connection document saved on firebase
                    tunnelTCP.forwardTcp("localhost:4000");
                } else {
                    console.log('Session does not exist locally, so asking for already existing session to close');
                    const res = await axios.post('https://api.ngrok.com/tunnel_sessions/' + session_id + '/stop', '{}', {
                        headers: {
                            'Authorization': 'Bearer 2RxyddNquVUsbclmKkrN9POK9j1_Joh8LMatgfKscCoQNmnq',
                            'Ngrok-Version': '2',
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(res);
                    console.log('Existing session closed');
                }
            } else {
                console.log('no active agent/session on the account, would create one')
                //create session and tunnel
                session = await new ngrok_nodejs.NgrokSessionBuilder().authtoken('1bXHu9TS8UqouHW9z35ttCKL8VC_6saRQWiViaJDisjavzT5Q').handleStopCommand(() => {
                    console.log('received request to stop session')
                    session.close();
                    console.log('session closed')
                })
                    .handleHeartbeat((latency) => {
                        console.log("heartbeat, latency:", latency, "milliseconds");
                    })
                    .handleDisconnection((addr, error) => {
                        console.log("disconnected, addr:", addr, "error:", error);
                        return true;
                    })
                    .connect();

                //open http tunnel
                const tunnelHttp = await session.httpEndpoint().listen();
                console.log("Tunnel established at:", tunnelHttp.url());
                tunnelHttp.forwardTcp("localhost:8500");


                // //open tcp tunnel
                const tunnelTCP = await session.tcpEndpoint().listen();
                console.log("Tunnel established at:", tunnelTCP.url());
                //save tcp tunnel url also as part of remote connection document saved on firebase
                tunnelTCP.forwardTcp("localhost:4000");


            }

        })();

        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
    });

    app.get('/connect-to-output', (req, res) => {
        res.sendFile('index.html', { root: __dirname });
        //url ngrok created - tcp://5.tcp.eu.ngrok.io:17268
        //take note the tcp was replaced with ws
        socket = io("ws://5.tcp.eu.ngrok.io:17268", { reconnectionAttempts: 12 });

        socket.on("connect", () => {
            console.log("connected successfully at".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
            //fires when it connect successfully at first, or connected successfully after reconnect
            //when ever this fires, if it was blinking before, let blinking stop
        });


        socket.on("connect_error", (error) => {
            console.log('connect error')
            //fired everytime a connection was attempted and it failed either initially, or on reconnect.
            //for everytime this happens, let the blinking continue to happen
            if (socket.active) {
                // temporary failure, the socket will automatically try to reconnect
                console.log("temporary connection failure".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
                console.log(error.message);
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                //just go ahead and close the output here, it won't try to automatically reconnect,so no need to blink here
                console.log("permament connection failure".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
                console.log(error.message);
            }

        });

        socket.on("disconnect", (reason, details) => {
            console.log("disconnect")
            //fired just once, the moment a disconnect happens, let the blinking start
            console.log(reason)
            if (socket.active) {
                // temporary failure, the socket will automatically try to reconnect
                console.log("temporary disconnect".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
                console.log(details);
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                //just go ahead and close the output here, it won't try to automatically reconnect,so no need to blink here
                console.log("total disconnect".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
                console.log(details);
            }

        });


        socket.io.on("reconnect_failed", () => {
            // Fired when couldn't reconnect within reconnectionAttempts.
            // It has attempted 12 times(or no of time configured) and stopped
            // Close the output here
            console.log("Reconnection attempt has finished")

        });


        //setInterval(sendMessage, 5000);



        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
    });

    app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
        console.log(`Now listening on port ${port}`);
    });

    process.on('SIGINT', (signal) => {
        appStatus = 0;
        console.log('*** Signal received ****');
        console.log('*** App will be closed in 1 sec ****');
        setTimeout(shutdownProcedure, 1);
    })

    function shutdownProcedure() {
        console.log('*** App is now closing ***');
        process.exit(0);
    }

    // const server = app.listen(port, () => console.log(`Express server listening on port ${port}`));

    module.exports = app;

}());