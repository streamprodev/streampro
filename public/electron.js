// import axios from 'axios';
// import axios from 'axios';



const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { inititateDB, } = require("../src/helpers/helper.js");
const path = require('path');
const fs = require('fs');
const ngrok = require("@ngrok/ngrok");
const { axios } = require('axios');
// const handler = require("../src/helpers/handlers.js");
const dbPath = path.join(app.getPath('documents'), 'egfm-app/database.sqlite');
var os = require("os");
const { v4: uuidv4 } = require('uuid');
const { parseString } = require("xml2js");





const { machineId, machineIdSync } = require("node-machine-id");
const { initializeApp } = require("firebase/app");
const { getFirestore, getCountFromServer, collection, getDocs, query, where, setDoc, doc } = require("@firebase/firestore");
const { electron } = require('process');

// const { firestore: firedb } = require("../src/firebase_setup/firebase.js")
// var ping = require('ping');
// const icmp = require('icmp');


let db
let win
let allSongs
let bookMarkedSongs
let firestore
let bibleKey
let songKey

const port = 8088;                  //Save the port number where your server will be listening
var session = '';
var reconnecting = '';
var generatereconnecting = '';
var intervalId = '';
var intervalIdGenerate = '';
var password = '';
var auth_token = '2S8k5VeomU47NgyTXJHoJfuHW5i_4J7x3iWftMy77LUzoDMtd'; //eniolorund
var bearer_token = '2S8k9KqD12kvPVeT5CxUacNymrv_7TXuGa24NwpgxuiyAmLd6';//api key
// var auth_token = '2Rv5xmImI4seTXcXf2ZBkgmdwq2_5joFWi3uvvnvwhyGV5ZjD'; // fola.aremu
// var bearer_token = '2S8r9kyyOmD0qzn36rdwu1ouTuH_7TPAHoA6EiEErMAGgvKad';//api key
// var auth_token = '1bXHu9TS8UqouHW9z35ttCKL8VC_6saRQWiViaJDisjavzT5Q';
// var bearer_token = '2RxyddNquVUsbclmKkrN9POK9j1_Joh8LMatgfKscCoQNmnq';//api key
var session_id;

//handlers
ipcMain.handle('getSongData', async () => {
    return allSongs = await loadInitialData()
});
ipcMain.handle('refreshSongData', async () => {
    return allSongs = await loadInitialData()
});

ipcMain.handle('singleInsert', (event, record) => {
    db.run('INSERT INTO songs (title, body,created,updated) VALUES (?, ?,?,?)', [
        record.title,
        record.body,
        new Date().toJSON(),
        new Date().toJSON()
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'add');
            return 'done'
        }
    });

});
ipcMain.handle('singleEdit', (event, record) => {
    db.run('UPDATE songs SET title = ?, body = ?,updated = ?  where uuid = ?', [
        record.title,
        record.body,
        new Date().toJSON(),
        record.uuid,
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.sender.send('resetSongData', 'edit');
            return 'done'
            event.reply('bulkInsertComplete', 'done');
        }
    });

});

ipcMain.handle('open-file-dialog-for-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
    }

    return null;
});




ipcMain.handle('readFile', async (event, filePath) => {
    try {
        const data = await readFileAsync(filePath);
        const fileName = path.parse(filePath).name;
        const response = { data, filePath, fileName };
        return response;
    } catch (error) {
        console.error('Error reading file:', error);
        return null; // or handle the error in an appropriate way
    }
});

const updateReconnectingStatus = (event, status) => {

    // console.log(event)
    reconnecting = status
    event.sender.send('setReconnecting', status);
}
const updateGenerateReconnectingStatus = (event, status) => {

    console.log(generatereconnecting, 'generatereconnecting')
    generatereconnecting = status
    event.sender.send('setGenerateReconnecting', status);
}

const checkIfConnectedToVmix = async (event, filePath) => {

    intervalId = setInterval(async () => {
        var myHeaders = new Headers();
        const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
        };
        try {
            const response = await fetch(filePath.outputUrl + "/api", requestOptions);
            if (!response.ok) {
                console.log("not connected")
                if (!reconnecting) {
                    updateReconnectingStatus(event, true)
                    stopIntervalRun(event)
                }
            } else {
                console.log("connected")
                updateReconnectingStatus(event, false)
            }

        } catch (error) {
            console.log("not connected")
            if (!reconnecting) {
                updateReconnectingStatus(event, true)
                stopIntervalRun(event)
            }
        }


    }, 5000);

}

const stopIntervalRun = (event) => {
    setTimeout(() => {
        if (reconnecting) {
            console.log('disconnected')
            reconnecting = false;
            clearInterval(intervalId)
            event.sender.send('vmixDisconected', 'add');
            bibleKey = ''
            songKey = ''
            // intervalId=''vmixDisconected
        }
    }, 60000);
    // stopOutputConnectionCheck

}

ipcMain.on('stopOutputConnectionCheck', (event, record) => {
    // console.log(intervalId)
    clearInterval(intervalId)

});
const checkIfGeneratedLinkActiv = async (event, filePath) => {
    console.log(filePath)
    intervalIdGenerate = setInterval(async () => {
        var myHeaders = new Headers();
        const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
        };
        try {
            const response = await fetch(filePath.outputUrl, requestOptions);
            if (!response.ok) {
                console.log("not connected")
                if (!generatereconnecting) {
                    console.log(event)
                    updateGenerateReconnectingStatus(event, true)
                    stopGeneratedLinkIntervalRun(event)
                }
            } else {
                console.log("connected")
                updateGenerateReconnectingStatus(event, false)
            }

        } catch (error) {
            console.log("not connected")
            if (!generatereconnecting) {
                updateGenerateReconnectingStatus(event, true)
                stopGeneratedLinkIntervalRun(event)
            }
        }
    }, 5000);

}

const stopGeneratedLinkIntervalRun = (event) => {
    setTimeout(() => {
        if (generatereconnecting) {
            console.log('disconnected')
            generatereconnecting = false;
            clearInterval(intervalIdGenerate)
            event.sender.send('vmixDisconected2', 'add');
            closeNgrokSession(event, 'Session closed successfuly')
        }
    }, 60000);
    // stopOutputConnectionCheck

}

ipcMain.on('stopGeneratedLinkConnectionCheck', (event, record) => {
    clearInterval(intervalIdGenerate)

});

ipcMain.handle('connectVmix', async (event, filePath) => {
    var myHeaders = new Headers();
    const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
    myHeaders.append("Authorization", "Basic " + base_64);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
        mode: "no-cors",
    };
    const response = await fetch(filePath.outputUrl + "/api", requestOptions);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;

        if (!reconnecting) {
            //updateReconnectingStatus(event, true)
        }
        throw new Error(message);
    }
    checkIfConnectedToVmix(event, filePath)
    const data = await response.text();
    // console.log(data)
    // parseString(data, function (err, results) {
    //     const bibleKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Bible")
    //     bibleKey = bibleKeyObj.$.key
    //     const songKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Lyrics")
    //     songKey = songKeyObj.$.key
    // });

    return data;

});

ipcMain.handle('goLiveWSongs', async (event, filePath) => {
    try {

        var myHeaders = new Headers();
        const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
        };
        //set text
        let text = filePath.finaloutputLine || "";
        const setTextResponse = await fetch(filePath.outputUrl + "/api?Function=SetText&Input=Lyrics&Value=" + text, requestOptions);
        if (!setTextResponse.ok) {
            // event.reply('vmixDisconected', 'add');
            //throw disconnected event
            const message = `An error has occured: ${setTextResponse.status}`;

            if (!reconnecting) {
                //updateReconnectingStatus(event, true)
            }
            throw new Error(message);
        }
        //updateReconnectingStatus(event, false)

        // const overLayResponse = await fetch(filePath.outputUrl + "/api?Function=OverlayInput1In&Input=Lyrics", requestOptions);
        // if (!overLayResponse.ok) {
        //     event.reply('vmixDisconected', 'add');
        //     //throw disconnected event
        //     const message = `An error has occured: ${overLayResponse.status}`;
        //     throw new Error(message);
        // }
        // return await overLayResponse.text();
    } catch (error) {

        if (!reconnecting) {
            //updateReconnectingStatus(event, true)
        }

    }
});
ipcMain.handle('goLiveWBible', async (event, filePath) => {

    try {

        var myHeaders = new Headers();
        const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
        };

        if (!bibleKey) {
            const setTextResponse = await fetch(filePath.outputUrl + "/api", requestOptions);
            const data = await setTextResponse.text();
            parseString(data, function (err, results) {
                const bibleKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Bible")
                bibleKey = bibleKeyObj.$.key
                const songKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Lyrics")
                songKey = songKeyObj.$.key
            });
        }

        // console.log(filePath.selectedVerseArray)
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        var details = {
            'txtMessage': filePath.selectedVerseArray?.text ? filePath.selectedVerseArray?.text : "",
            'txtTitle': filePath.selectedVerseArray?.text ? filePath?.selectedVerseArray?.ref : "",
            'Update': 'Update'
        };
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        var postrequestOptions = {
            method: 'POST',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
            body: formBody
        };


        const setTextandTitleResponse = await fetch(filePath.outputUrl + "/titles/?key=" + bibleKey, postrequestOptions)
        if (!setTextandTitleResponse.ok) {
            if (!reconnecting) {
                //updateReconnectingStatus(event, true)
            }
        }
        //updateReconnectingStatus(event, false)
        const data = await setTextandTitleResponse.text();
        // console.log(data)






        //set text
        // const setTextResponse = await fetch(filePath.outputUrl + "/api?Function=SetText&Input=Bible&Value=" + filePath.finaloutputLine, requestOptions);
        // if (!setTextResponse.ok) {
        //     event.reply('vmixDisconected', 'add');
        //     //throw disconnected event
        //     const message = `An error has occured: ${setTextResponse.status}`;
        //     throw new Error(message);
        // }

        // // let reference = filePath.selectedBook.label + " " + filePath.selectedChapter.chapter_number + ":" + filePath.searchVerse
        // let reference = filePath.selectedVerseArray.label + " " + filePath.selectedVerseArray.chapter_number + ":" + filePath.selectedVerseArray.verse_number
        // const setLocationesponce = await fetch(filePath.outputUrl + "/api?Function=SetText&Input=Bible Reference&Value=" + reference, requestOptions);
        // if (!setTextResponse.ok) {
        //     event.reply('vmixDisconected', 'add');
        //     //throw disconnected event
        //     const message = `An error has occured: ${setTextResponse.status}`;
        //     throw new Error(message);
        // }

        // const overLayResponse = await fetch(filePath.outputUrl + "/api?Function=OverlayInput1In&Input=Bible", requestOptions);
        // if (!overLayResponse.ok) {
        //     event.reply('vmixDisconected', 'add');
        //     //throw disconnected event
        //     const message = `An error has occured: ${overLayResponse.status}`;
        //     throw new Error(message);
        // }
        // const overLayResponsed = await overLayResponse.text();
        // // console.log(overLayResponsed)
        // return overLayResponsed;
    } catch (error) {
        if (!reconnecting) {
            //updateReconnectingStatus(event, true)
        }
        throw error
    }
});

ipcMain.handle('sendToVmix', async (event, filePath) => {
    var myHeaders = new Headers();
    const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
    myHeaders.append("Authorization", "Basic " + base_64);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
        mode: "no-cors",
    };
    //set text
    const setTextResponse = await fetch(filePath.outputUrl + "/api?Function=SetText&Input=Lyrics&Value=" + filePath.outputLine, requestOptions);
    if (!setTextResponse.ok) {
        // event.reply('vmixDisconected', 'add');
        //throw disconnected event
        const message = `An error has occured: ${setTextResponse.status}`;

        if (!reconnecting) {
            //updateReconnectingStatus(event, true)
        }
        throw new Error(message);
    }
    //updateReconnectingStatus(event, false)
    return await setTextResponse.text();
});


ipcMain.handle('sendToVmixBible', async (event, filePath) => {
    var myHeaders = new Headers();
    const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
    myHeaders.append("Authorization", "Basic " + base_64);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
        mode: "no-cors",
    };


    if (!bibleKey) {
        const setTextResponse = await fetch(filePath.outputUrl + "/api", requestOptions);
        const data = await setTextResponse.text();
        parseString(data, function (err, results) {
            const bibleKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Bible")
            bibleKey = bibleKeyObj.$.key
            const songKeyObj = results.vmix.inputs[0].input.find(({ _ }) => _ === "Lyrics")
            songKey = songKeyObj.$.key
        });
    }


    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    var details = {
        'txtMessage': filePath.selectedVerseArray.text,
        'txtTitle': filePath.selectedVerseArray.ref,
        'Update': 'Update'
    };
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    var postrequestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: myHeaders,
        mode: "no-cors",
        body: formBody
    };

    const setTextandTitleResponse = await fetch(filePath.outputUrl + "/titles/?key=" + bibleKey, postrequestOptions)
    if (!setTextandTitleResponse.ok) {
        if (!reconnecting) {
            //updateReconnectingStatus(event, true)
        }
    }
    //updateReconnectingStatus(event, false)
    const data = await setTextandTitleResponse.text();




    // //set text
    // console.log(new Date().toJSON(), 'bible-before')
    // const setTextResponse = fetch(filePath.outputUrl + "/api?Function=SetText&Input=Bible&Value=" + filePath.outputLine, requestOptions).then(res => console.log(new Date().toJSON(), 'bible-after'));
    // let timeout = 250

    // if (filePath.outputLine.length < 15) {
    //     timeout = 0
    // } else if (filePath.outputLine.length < 90) {
    //     timeout = 0
    // }
    // // if (!setTextResponse.ok) {
    // //     event.reply('vmixDisconected', 'add');
    // //     //throw disconnected event
    // //     const message = `An error has occured: ${setTextResponse.status}`;
    // //     throw new Error(message);
    // // }

    // setTimeout(() => {

    //     if (filePath.selectedVerseArray) {
    //         let reference = filePath.selectedVerseArray.book_name + " " + filePath.selectedVerseArray.chapter_number + ":" + filePath.selectedVerseArray.verse_number
    //         console.log(new Date().toJSON(), 'reference-before')
    //         const setLocationesponce = fetch(filePath.outputUrl + "/api?Function=SetText&Input=Bible Reference&Value=" + reference, requestOptions).then(res => console.log(new Date().toJSON(), 'reference-after'));
    //     }
    // }, timeout);
    // if (!setLocationesponce.ok) {
    //     event.reply('vmixDisconected', 'add');
    //     //throw disconnected event
    //     const message = `An error has occured: ${setTextResponse.status}`;
    //     throw new Error(message);
    // }
    // return await setTextResponse.text();
    return 'working'
});


ipcMain.handle('goOfflineWSongs', async (event, filePath) => {
    //updateReconnectingStatus(event, false)
    try {
        var myHeaders = new Headers();
        const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
            mode: "no-cors",
        };

        const overLayResponse = await fetch(filePath.outputUrl + "/api?Function=OverlayInput1Out", requestOptions);
        if (!overLayResponse.ok) {
            // event.reply('vmixDisconected', 'add');
            //throw disconnected event
            const message = `An error has occured: ${overLayResponse.status}`;
            throw new Error(message);
        }
        bibleKey = ''
        songKey = ''
        return await overLayResponse.text();

    } catch (error) {

    }
});
ipcMain.handle('fetchHostName', async (event) => {
    return machineId({ original: true })
    // return machineId({ original: true });
});
ipcMain.handle('fetchHostNameOld', async (event) => {
    return os.hostname();
    // return machineId({ original: true });
});


ipcMain.handle('createVmixOverlay', async (event, filePath) => {
    var myHeaders = new Headers();
    const base_64 = btoa(filePath.outputPasscode + "STP" + ":" + filePath.outputPasscode + "STP")
    myHeaders.append("Authorization", "Basic " + base_64);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
        mode: "no-cors",
    };

    // https://440b-41-184-211-130.ngrok-free.app/api?Function=SetText&Input=Lyrics&Value=Boy
    //https://440b-41-184-211-130.ngrok-free.app/api?Function=OverlayInput1&Input=Lyrics&Value=Boy
    const response = await fetch(filePath.outputUrl + "/api", requestOptions);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.text();
    return 1;
});
ipcMain.handle('close-app', async (event, filePath) => {
    win?.close()
});
ipcMain.handle('maximize-app', async (event, filePath) => {
    if (win?.isMaximized()) {
        win?.unmaximize();
    } else {
        win?.maximize();
    }
});
ipcMain.handle('minimize-app', async (event, filePath) => {
    win?.minimize();
});
ipcMain.handle('getRegistrationInfo', async (event, device_id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM registration_info where device_id = ? limit 1', [machineIdSync({ original: true })], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve([])
                }
            }
        })
    })

});


//events

ipcMain.on('list-txt-files', (event, folderPath) => {
    const txtFiles = [];

    function traverseFolder(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isFile() && path.extname(entry.name) === '.txt') {
                txtFiles.push(fullPath);
            } else if (entry.isDirectory()) {
                traverseFolder(fullPath);
            }
        }
    }

    traverseFolder(folderPath);
    event.reply('txt-files-listed', txtFiles);
});

ipcMain.on('bulkInsert', (event, records) => {
    // Prepare the SQL statement with placeholders for values

    const sql = 'INSERT INTO songs (title, body,created,updated) VALUES (?, ?, ?,?)';

    // Begin a transaction for better performance
    db.run('BEGIN TRANSACTION');
    // Insert records
    records.forEach((record) => {
        // stmt.run(record.title, record.body);
        db.run('INSERT INTO songs (title, body, created,uuid,updated) VALUES (?, ?, ?,?,?)', [
            record.title,
            record.body,
            new Date().toJSON(),
            uuidv4(),
            new Date().toJSON()
        ]);
    });

    // Commit the transaction
    db.run('COMMIT', (err) => {
        if (err) {
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'add');
            event.reply('bulkInsertComplete', new Date().toJSON());
        }
    });
});

ipcMain.on('singleInsert', (event, record) => {
    db.run('INSERT INTO songs (title, body,created,updated,uuid) VALUES (?, ?,?, ?,?)', [
        record.title,
        record.body,
        new Date().toJSON(),
        new Date().toJSON(),
        uuidv4()
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'add');
            return 'done'
        }
    });

});
ipcMain.on('singleEdit', (event, record) => {
    db.run('UPDATE songs SET title = ?, body = ?,updated= ?  where uuid = ?', [
        record.title,
        record.body,
        new Date().toJSON(),
        record.uuid,
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'edit');
            return 'done'
            event.reply('bulkInsertComplete', 'done');
        }
    });

});
ipcMain.on('singleBookmark', (event, record) => {
    db.run('UPDATE songs SET bookmarked = 1 where uuid = ?', [
        record.uuid,
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'bookmark');
            return 'done'
            event.reply('bulkInsertComplete', 'done');
        }
    });

});
ipcMain.on('singleBookmarkRemove', (event, record) => {
    db.run('UPDATE songs SET bookmarked = 0 where uuid = ?', [
        record.uuid,
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('resetSongData', 'bookmark-remove');
            return 'done'
            event.reply('bulkInsertComplete', 'done');
        }
    });

});
ipcMain.on('singleDelete', (event, record) => {
    // console.log(record)
    db.run('Delete from songs where uuid = ?', [
        record.uuid,
    ], (err) => {
        if (err) {
            return err
            event.reply('bulkInsertError', err.message);
        } else {
            event.reply('deleteSong', record);
            event.reply('resetSongData', 'delete');
            return 'done'
            event.reply('bulkInsertComplete', 'done');
        }
    });
});

ipcMain.on('closengrok', async (event) => {
    closeNgrokSession(event, 'Session closed successfuly')
})



ipcMain.on('enableSync', async (event, data) => {

    const registrationInfo = data.registrationInfo
    const lastSyncDate = registrationInfo.last_sync_date
    if (!lastSyncDate) {
        if (!firestore) {
            const firebaseConfig = {
                apiKey: registrationInfo.firestore_apikey,
                projectId: registrationInfo.firestore_projectid,
                appId: registrationInfo.firestore_appid,
            };
            firestore = getFirestore(initializeApp(firebaseConfig))

        }

        // Initialize Firebase
        const collection_name = registrationInfo.license_key + "_songs"
        // console.log(collection_name)

        const coll = collection(firestore, collection_name);
        const snapshot = await getCountFromServer(coll);

        if (snapshot.data().count > 0 && data.notified == 0) {
            event.reply('syncStatus', 'enable-notify');
            // console.log('there')
        } else {
            // console.log('here')
            db.run('UPDATE registration_info SET auto_sync = 1  where license_key = ?', [
                registrationInfo.license_key,
            ], (err) => {
                if (err) {
                    event.reply('syncStatus', 'enable-error');
                    return
                } else {
                    event.reply('syncStatus', 'enable-success');
                    return
                }
            });
        }
    } else {
        // console.log('here')
        db.run('UPDATE registration_info SET auto_sync = 1  where license_key = ?', [
            registrationInfo.license_key,
        ], (err) => {
            if (err) {
                event.reply('syncStatus', 'enable-error');
                return
            } else {
                event.reply('syncStatus', 'enable-success');
                return
            }
        });
    }
});

ipcMain.on('disableSync', async (event, data) => {
    const registrationInfo = data.registrationInfo
    db.run('UPDATE registration_info SET auto_sync = 0  where license_key = ?', [
        registrationInfo.license_key,
    ], (err) => {
        if (err) {
            event.reply('syncStatus', 'disable-error');
            return
        } else {
            event.reply('syncStatus', 'disable-success');
            return
        }
    });
})

ipcMain.on('syncSongs', async (event, data) => {
    // const registrationInfo = data.registrationInfo
    db.all('SELECT * FROM registration_info where device_id = ? limit 1', [machineIdSync({ original: true })], async (err, rows) => {
        if (err) {
        } else {
            if (rows.length > 0) {
                const registrationInfo = rows[0]
                if (registrationInfo.auto_sync == 1) {
                    event.reply('setSyncingToaster');

                    //get last sync date


                    const lastSyncDate = registrationInfo.last_sync_date
                    if (!firestore) {
                        const firebaseConfig = {
                            apiKey: registrationInfo.firestore_apikey,
                            projectId: registrationInfo.firestore_projectid,
                            appId: registrationInfo.firestore_appid,
                        };
                        firestore = getFirestore(initializeApp(firebaseConfig))

                    }

                    // Initialize Firebase
                    const collection_name = registrationInfo.license_key + "_songs"




                    // console.log(cloud_songs)

                    //get local songs

                    db.all('SELECT * FROM songs order by title asc', async (err, rows) => {
                        if (err) {
                            console.log(err)
                            // reject(err);
                        } else {
                            const local_songs = rows;
                            if (!lastSyncDate) {
                                //get songs in memory
                                const collection_ref = collection(firestore, collection_name)
                                const q = query(collection_ref)
                                const doc_refs = await getDocs(q);
                                let cloud_songs = []

                                doc_refs.forEach(country => {
                                    cloud_songs.push({
                                        ...country.data()
                                    })
                                })


                                if (cloud_songs.length > 0) {
                                    //delete all songs locally and insert cloud songs

                                    db.run('BEGIN TRANSACTION');
                                    // Insert records
                                    local_songs.forEach((record) => {
                                        // stmt.run(record.title, record.body);
                                        db.run('delete from songs where uuid = ?', [
                                            record.uuid,
                                        ]);
                                    });

                                    // Commit the transaction
                                    db.run('COMMIT', (err) => {
                                        if (err) {
                                            event.reply('syncError', err);
                                            return
                                        } else {
                                            event.reply('clearDisplayData', 'sync');
                                            // return 
                                            db.run('BEGIN TRANSACTION');
                                            // Insert records
                                            cloud_songs.forEach((record) => {
                                                // stmt.run(record.title, record.body);
                                                db.run('INSERT INTO songs (title, body, created,uuid) VALUES (?, ?, ?,?)', [
                                                    record.title,
                                                    record.body,
                                                    record.created,
                                                    record.uuid
                                                ]);
                                            });

                                            // Commit the transaction
                                            db.run('COMMIT', (err) => {
                                                if (err) {
                                                    event.reply('syncError', err);
                                                    return
                                                } else {
                                                    db.run('UPDATE registration_info SET last_sync_date = ?  where license_key = ?', [
                                                        new Date().toJSON(),
                                                        registrationInfo.license_key,
                                                    ], (err) => {
                                                        if (err) {
                                                            event.reply('syncError', err);
                                                            return
                                                        } else {
                                                            // event.reply('syncComplete', 'done');
                                                            // return
                                                        }
                                                    });
                                                    event.reply('resetSongData', 'sync');
                                                    event.reply('syncComplete', 'done');
                                                    return
                                                }
                                            });
                                        }
                                    });

                                } else {
                                    //send all local songs to cloud
                                    const result = await uploadToFirebase(firestore, collection_name, local_songs)

                                    // for (const song of local_songs) {
                                    //     try {
                                    //         await setDoc(doc(firestore, collection_name, song['uuid']), song);
                                    //     } catch (error) {
                                    //     }
                                    // }
                                    // await local_songs.forEach(async (song) => {
                                    //     try {
                                    //         await setDoc(doc(firestore, collection_name, song['uuid']), song);
                                    //     } catch (error) {
                                    //     }
                                    // })

                                    db.run('UPDATE registration_info SET last_sync_date = ?  where license_key = ?', [
                                        new Date().toJSON(),
                                        registrationInfo.license_key,
                                    ], (err) => {
                                        if (err) {
                                            event.reply('syncError', err);
                                            return
                                        } else {

                                            event.reply('resetSongData', 'sync');
                                            event.reply('syncComplete', 'done');
                                            return
                                        }
                                    });
                                }
                            } else {
                                //map to get songs where updated is greater than last sync date on cloud songs
                                const collection_ref = collection(firestore, collection_name)
                                const q = query(collection_ref, where("updated", ">", lastSyncDate))
                                const doc_refs = await getDocs(q);
                                const updated_cloud_songs = []

                                doc_refs.forEach(country => {
                                    updated_cloud_songs.push({
                                        ...country.data()
                                    })
                                })
                                // return 

                                //map to get songs where updated is greater than last sync date on local songs
                                let newArray = local_songs.filter(function (el) {
                                    return el.updated > lastSyncDate
                                }
                                );

                                //create or update cloud mapped songs to local db
                                if (updated_cloud_songs.length > 0) {
                                    console.log('updated_cloud_songs.length')
                                    db.run('BEGIN TRANSACTION');
                                    // Insert records
                                    updated_cloud_songs.forEach((record) => {
                                        db.run('INSERT OR REPLACE INTO songs (title, body, uuid,created,updated)VALUES(?, ?, ?,?,?); ', [
                                            record.title,
                                            record.body,
                                            record.uuid,
                                            record.created,
                                            new Date().toJSON()
                                        ]);
                                    });

                                    // Commit the transaction
                                    db.run('COMMIT', (err) => {
                                        if (err) {
                                            console.log(err)
                                            event.reply('syncError', err);
                                            return
                                        } else {
                                        }
                                    });

                                }

                                //save cloud array to db
                                if (newArray.length > 0) {
                                    console.log('newArray.length')

                                    const result = await uploadToFirebase(firestore, collection_name, newArray)

                                }

                                setTimeout(() => {
                                    db.run('UPDATE registration_info SET last_sync_date = ?  where license_key = ?', [
                                        addSeconds(new Date(), 2).toJSON(),
                                        registrationInfo.license_key,
                                    ], (err) => {
                                        if (err) {
                                            event.reply('syncError', err);
                                            return
                                        } else {


                                            event.reply('resetSongData', 'sync');
                                            event.reply('syncComplete', 'done');
                                            return
                                        }
                                    });

                                }, 100);

                            }
                        }
                    });



                }
            } else {
                resolve([])
            }
        }
    })

    //get all songs where updated > sync_date - locally

    //get all songs where updated > sync_date - firestore
})

const uploadToFirebase = async (firestore, collection_name, local_songs) => {
    const result = await Promise.allSettled(
        local_songs.map(async (song) => {
            await setDoc(doc(firestore, collection_name, song['uuid']), song);
        })

    )
    return result;
}
// ipcMain.on('setSongDataEvent', async (event) => {
//     closeNgrokSession(event, 'Session closed successfuly')
// })

const closeNgrokSession = (event, message) => {
    if (session) {
        session.close()
        session = '';
        event.reply('closeNgrokSession', message);
    }
}

ipcMain.on('setngrok', async (event, registration_info) => {
    bearer_token = registration_info.ngrok_bearertoken;
    auth_token = registration_info.ngrok_key;
    try {
        const online_sessions = await fetch('https://api.ngrok.com/tunnel_sessions', {
            method: 'GET',
            headers: {
                "Authorization": 'Bearer ' + bearer_token,
                "Ngrok-Version": "2",
                "Content-Type": "application/json",
            }
        })
        const online_session = await online_sessions.json();

        if (online_session.tunnel_sessions && online_session.tunnel_sessions.length > 0) {
            session_id = online_session.tunnel_sessions[0].id

            if (session) {
                password = generateRandom()
                console.log('Session exists locally, so going ahead to establish a tunnel');
                const tunnel = await session.httpEndpoint().basicAuth(password + "STP", password + "STP").listen();
                const url = tunnel.url()
                tunnel.forwardTcp('127.0.0.1:' + port)
                console.log("tunnel established at:", url);
                event.reply('setngrokUrl', { url, password, registration_info });
                checkIfGeneratedLinkActiv(event, { outputUrl: url, outputPasscode: password })
            } else {
                console.log('Session does not exist locally, so asking for already existing session to close');

                await fetch('https://api.ngrok.com/tunnel_sessions/' + session_id + '/stop', {
                    method: 'POST',
                    headers: {
                        "Authorization": 'Bearer ' + registration_info.ngrok_bearertoken,
                        "Ngrok-Version": "2",
                        "Content-Type": "application/json",
                    },
                    body: '{}'
                })
                // await closesessions.json();

                console.log('Existing session closed');
                password = generateRandom()
                setTimeout(async () => {
                    session = await new ngrok.NgrokSessionBuilder().authtoken(auth_token).handleStopCommand(() => {
                        closeNgrokSession(event, 'Received request to stop session')
                        console.log('received request to stop session')
                        console.log('session closed')
                    })
                        .connect();
                    const tunnel = await session.httpEndpoint().basicAuth(password + "STP", password + "STP").listen();
                    const url = tunnel.url()
                    tunnel.forwardTcp('127.0.0.1:' + port)
                    console.log("tunnel established at:", url);
                    event.reply('setngrokUrl', { url, password, registration_info });
                    checkIfGeneratedLinkActiv(event, { outputUrl: url, outputPasscode: password })

                }, 20000);


            }
        } else {
            console.log('no active agent/session on the account, would create one')
            //create session and tunnel
            password = generateRandom()
            session = await new ngrok.NgrokSessionBuilder().authtoken(auth_token).handleStopCommand(() => {
                closeNgrokSession(event, 'Received request to stop session')
                // event.reply('setngrokUrlError', 'session setup error: received request to stop session');
                console.log('received request to stop session')
                // session.close();
                console.log('session closed')
            })
                .connect();
            const tunnel = await session.httpEndpoint().basicAuth(password + "STP", password + "STP").listen();
            const url = tunnel.url()
            tunnel.forwardTcp('127.0.0.1:' + port)
            console.log("tunnel established at:", url);
            event.reply('setngrokUrl', { url, password, registration_info });
            checkIfGeneratedLinkActiv(event, { outputUrl: url, outputPasscode: password })

        }

    } catch (error) {
        console.log(error)
        event.reply('setngrokUrlError', 'Error Generating Code.');
    }

});

ipcMain.on('disconnectngrok', async (event) => {

    if (session) {
        session.close();
        session = ''
    }
});

ipcMain.on('minimize', () => {
    win.minimize();
});

ipcMain.on('close', () => {
    win.close();
});
ipcMain.on('saveRegistrationInfo', async (event, registration_info) => {
    db.run('INSERT INTO registration_info (uuid, license_key,license_owner,ngrok_key,ngrok_bearertoken,device_id,firestore_apikey,firestore_projectid,firestore_appid,documentid,device_name,license_owner_email) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)', [
        uuidv4(),
        registration_info.license_key,
        registration_info.license_owner,
        registration_info.ngrok_key,
        registration_info.ngrok_bearertoken,
        machineIdSync({ original: true }),
        registration_info.firestore_apikey,
        registration_info.firestore_projectid,
        registration_info.firestore_appid,
        registration_info.documentid,
        os.hostname(),
        registration_info.license_owner_email,
    ], (err, row) => {
        if (err) {
            console.log(err)
            return err
        } else {


            db.all('SELECT * FROM registration_info where device_id = ? and license_key = ? limit 1', [machineIdSync({ original: true }), registration_info.license_key], (err, rows) => {
                if (err) {
                } else {
                    if (rows.length > 0) {
                        event.reply('resetRegistrationInfo', rows[0]);

                    } else {
                        resolve([])
                    }
                }
            })
            event.reply('resetRegistrationInfo', 'add');
            return 'done'
        }
    });
});



async function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;

    // var os = require("os");
    win = new BrowserWindow({
        width: 1440,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,

        },
        icon: "/icon.ico"
    });

    db = await inititateDB()
    allSongs = await loadInitialData()
    // loadInitialBookMarkedData()

    win.loadURL(startUrl);
    // win.removeMenu(true);
    win.webContents.send('data-loaded', 'loaded');

    // win.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });


}



app.whenReady().then(async () => {
    createWindow();
    // setTimeout(function () {
    //     win.show();
    // }, 5000);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});


//functions
async function loadInitialData() {
    if (!db) {
        db = await inititateDB()
    }

    setTimeout(() => {
        db.all('SELECT * FROM songs order by title asc', (err, rows) => {
            if (err) {
                console.log(err)
                // reject(err);
            } else {
                win.webContents.send('setSongDataEvent', rows);
            }
        });

    }, 1000);
    // return new Promise((resolve, reject) => {
    //     db.all('SELECT * FROM songs', (err, rows) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(rows);
    //         }
    //     });
    // });


}

const generateRandom = () => {
    var characters = '0123456789';
    var result = ""
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}

function loadInitialBookMarkedData() {
    bookMarkedSongs = new Promise((resolve, reject) => {
        db.all('SELECT * FROM songs where bookmarked = 1', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    return bookMarkedSongs
}

function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function addSeconds(date, seconds) {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}



