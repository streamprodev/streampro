
const { app } = require('electron');
const { db, bookMarkedSongs, allSongs } = require('./helper.js')
const { ipcMain } = require('electron');

ipcMain.handle('getSongData', async () => {
    return allSongs;
});

