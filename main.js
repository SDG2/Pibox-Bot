const TelegramBot = require('node-telegram-bot-api');
const download = require('download-file');
const token = "411849524:AAEtKLkuxExheirQiFF9F4I5w73bW8gnuHo";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/nueva_cancion/, msg =>{
    let chat_id = msg.chat.id;
    bot.sendMessage(chat_id,"Escriba el nombre con el que va a guardar el fichero\n Máximo 16 caracteres\n");
    bot.once('message',answer =>{
        if(answer.text.length <= 0 || answer.text.length > 16){
            bot.sendMessage("Nombre invalido, repita el proceso");
            return;
        }
        let file_name = answer.text+".mp3";
        bot.sendMessage(chat_id,"Mande ahora la cancion que desea depositar");
        console.log(file_name);
        bot.once('audio',cancion =>{
            if(cancion.audio.mime_type !== 'audio/mp3'){
                bot.sendMessage(chat_id,"Por el momento solo soportamos mp3");
                return;
            }
            bot.getFileLink(cancion.audio.file_id).then(url =>{
                return downloadSong(url,file_name).then(()=>{
                    bot.sendMessage(chat_id, 'Cancion correctamente depositada');
                    boy.sendMessage(chat_id, `Se ha depositado con el nombre %s ${file_name}`);
                });
            });
        });
    });
});

let downloadSong = (url,file_name) =>{ 
    return new Promise((resolve, reject) =>{
        let options = {
            directory: "./music",
            filename: file_name
        };
        download(url, options, err => {
            console.log(err);
            reject();
        });
        resolve(); 
    })

};