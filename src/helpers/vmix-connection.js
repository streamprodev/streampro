var net = require('net');



module.exports = class VmixConnection {


    #_host = "";
    #_port = "";
    _socket;
    #status;

    isNowConnected = false;
    waitingOnPong = false;
    waitingOnTimeout = false;
    pingInterval = null;
    pingIntervalTime = 2000;
    pingTimeout = null;
    pingTimeoutTime = 5000;
    isReconnecting = false;
    reconnectInterval = null;
    reconnectIntervalTime = 5000;
    reconnectAttemptCount = 0;
    maxReconnectAttempt = 12;
    connection = false
    event = false

    _onRetryCompletedCallBack;
    _updateReconnectingStatusTCP;
    // 50684






    constructor(url, onConnectCallback, onCloseCallBack, onRetryCompletedCallBack, updateReconnectingStatusTCP, connection) {

        this.#setConnectionParameters(url);

        this._socket = new net.Socket();

        this.#status = "open";
        this.connection = connection

        this._socket.on('connect', () => {
            this.isNowConnected = true;
            console.log("connected successfully at".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
            this.#startPingHeartBeat();
            if (typeof onConnectCallback === 'function') {
                onConnectCallback();
            }

            console.log()
            this._updateReconnectingStatusTCP('setReconnectingMulti', { status: false, connection: this.connection });
            //Call Back
        });

        this._socket.on('close', (hadError,) => {
            console.log("connected closed at".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
            this.#stopPingHeartBeat(this.pingInterval);
            if (this.#status == 'open') {
                this.#reconnect();
                if (typeof onCloseCallBack === 'function') {
                    onCloseCallBack();
                }
            } else {
                this._updateReconnectingStatusTCP('vmixDisconectedMulti', this.connection);
            }

        });

        this._socket.on('error', (hadError,) => {
            console.error();
        });

        this._socket.on('data', (data) => {
            let dataString = data.toString();
            //console.log(dataString);
            if (dataString == "pong") {
                this.#pongReceived();
            }

            if (dataString.includes("XMLTEXT OK")) {
                this.#pongReceived();
            }
        });



        if (typeof onRetryCompletedCallBack === 'function') {
            this._onRetryCompletedCallBack = onRetryCompletedCallBack;
        }

        this._updateReconnectingStatusTCP = updateReconnectingStatusTCP
        let connectOption = { port: this.#_port, host: this.#_host };
        this._socket.connect(connectOption);

    }


    #setConnectionParameters(url) {
        let connParams = url.split("//")
        let hostAndPort = connParams[1];
        if (hostAndPort) {
            let hostAndPortArray = hostAndPort.split(":")
            this.#_host = hostAndPortArray[0];
            this.#_port = hostAndPortArray[1];
        }
    }

    #pongReceived() {
        //console.log("pong received at ".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
        this.waitingOnPong = false;
        if (this.waitingOnTimeout) {
            clearTimeout(this.pingTimeout);
            this.waitingOnTimeout = false;
            this.#startPingHeartBeat();
        }
        if (this.isReconnecting) {
            this.#stopReconnection(true);
        }
    }

    #pingTimedOut() {
        console.log("ping timedout at ".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
        this.waitingOnTimeout = false;
        this._socket.destroy();
    }

    #ping() {
        if (!this.waitingOnPong) {
            this._socket.write("XMLTEXT vmix/inputs/input[1]/@title\r\n");
            //socket.write("ping")
            this.waitingOnPong = true;
            //console.log("ping sent at ".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));
        } else {
            this.#stopPingHeartBeat(this.pingInterval);
            console.log("no pong received as at ".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()).concat(" so will disonnect in 5sec"));
            if (!this.waitingOnTimeout) {
                this.pingTimeout = setTimeout(this.#pingTimedOut.bind(this), this.pingTimeoutTime)
                this.waitingOnTimeout = true;
            }
        }
    }

    #startPingHeartBeat() {
        this.waitingOnPong = false;
        this.pingInterval = setInterval(this.#ping.bind(this), this.pingIntervalTime);
    }

    #stopPingHeartBeat(pingInterval) {
        clearInterval(pingInterval);
    }

    #reconnect() {
        if (!this.isReconnecting) {
            this.reconnectInterval = setInterval(this.#attemptReconnect.bind(this), this.reconnectIntervalTime)
            this.isReconnecting = true
        }
    }

    #attemptReconnect() {
        if (this.reconnectAttemptCount == this.maxReconnectAttempt) {
            this.#stopReconnection();
            if (this._onRetryCompletedCallBack) {
                this._onRetryCompletedCallBack();
            }
        } else {
            this.reconnectAttemptCount++;
            console.log("reconnect count ", this.reconnectAttemptCount)
            console.log("reconnect attempt at".concat(new Date().toLocaleTimeString()).concat(new Date().getMilliseconds()));

            this._updateReconnectingStatusTCP('setReconnectingMulti', { status: true, connection: this.connection });

            let connectOption = { port: this.#_port, host: this.#_host };
            this._socket.connect(connectOption);
        }
    }

    #stopReconnection(isNowConnected) {
        clearInterval(this.reconnectInterval);
        this.isReconnecting = false;
        if (isNowConnected) {
            this.reconnectAttemptCount = 0;
        } else {
            this._updateReconnectingStatusTCP('vmixDisconectedMulti', this.connection);
        }
    }

    setTextFunction(input, title, message) {
        let commandMessage = "FUNCTION SetText " + "Input=" + input + "&SelectedName=Message" + "&Value=" + message +
            "\r\n" + "FUNCTION SetText " + "Input=" + input + "&SelectedName=Title" + "&Value=" + title +
            "\r\n";
        console.log("about to write message")
        this._socket.write(commandMessage);
    }

    close() {
        this.#status = "closed";
        this._socket.destroy()
    }

}






