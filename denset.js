//Bienvenue sur le bot Densetsuno-bot-discord
//Pour pouvoir comment crée un bot, allez ici : http://densetsuno.forumactif.org/forum rubrique Tutoriel

//Version Discord : 10.0.1, license MIT

//En tête

const Discord = require("discord.js"); // Pour se connecter à Discord
const client = new Discord.Client();   // Ceci est pour les constantes que nous utiliserons pour lancer les commandes
const weather = require("weather-js"); // Ceci permettra d'afficher la météo 
//const token = "MjcxMzE0NTE0NDEzMDkyODY0.C2fU9Q.P7FDWBLLOhl5WyoZZAoqknX3WZg"; // Très important, ceci vous permettra de vous connecté au bot
const request = require('superagent'); // Besoin
const Anime = require('malapi').Anime; // My anime list
var fs = require('fs-extra'); // Petite amélioration de fs de base
const translate = require('google-translate-api'); //Pour traduire
const randomAnimeWallpapers = require('random-anime-wallpapers'); // Pour afficher des images randoms
var http = require('http'); // Pour se connecter
var prefix = "$";
var mention = "<@!255828814041448448>";
var mentionid = "<@!"
var status = prefix + "aide";
var google = require('google'); // Permet de faire une recherche sur Facebook



//Lancement du bot via le cmd

/* Démarrage du bot */

client.on("ready", () => {
  var servers = client.guilds.array().map(g => g.name).join(',');
  console.log("--------------------------------------");
  console.log('[!]Connexion en cours... \n[!]Veuillez Patienté! \n[!]Les évenement sont après ! :)  \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention);
  client.user.setGame(status, streamingURL); //Joue à ...
});

/* DEBUG */

client.on('error', m => console.log('debug', m));
client.on('reconnecting', m => console.log('debug', m));

/* Signalons les nouveaux membres et ceux qui quiite */ 

client.on('guildMemberAdd', member => {
member.guild.defaultChannel.sendMessage(`${member.user.username} a rejoins le serveur ${member.guild.name}`);
});
client.on('guildMemberRemove', member => {
member.guild.defaultChannel.sendMessage(`${member.user.username} a quitté le serveur ${member.guild.name}`);
});

/* Codons ! */ 

client.on("message", message => {
  if (message.content.startsWith(prefix + 'aide')){
      message.channel.sendMessage('**Bienvenu sur l\' aide du bot**' +
                                  '\n**' + prefix + 'avatar** : Affiche l\'avatar' +
                                  '\n**' + prefix + 'météo <Ville> <Pays>** : Affiche la météo de votre ville (si introuvable, ajouter pays' + 
                                  '\n**' + prefix + 'join** : Rejoint le vocal' + 
                                  '\n**' + prefix + 'leave** : Quitte le vocal (doit être en vocal)' + 
                                  '\n**' + prefix + 'radio <Nom Radio>** : Met la Radio sur le channel, radio disponible :' +
                                  '\n' +          '   - Fun Radio : 1' +
                                  '\n' +          '   - Radio Classique : 2' +
                                  '\n' +          '   - Radio Anime : 3' +
                                  '\n**' + prefix + 'anime <Nom>** : Donne les infos du mangas (FR bêta)' + 
                                  '\n**' + prefix + 'trad <phrase>** : Traduit de l\'Anglais au Français (FR bêta)' + 
                                  '\n**' + prefix + 'img <Tags>** : Affiche une images celon votre Tags (bêta)' +
                                  '\n';
    }
      // Voir son avatar
    if (message.content.startsWith(prefix + 'avatar')){
      message.reply(message.author.avatarURL);
    }
        // Images Randoms
    if (message.content.startsWith(prefix +'img')){
    var keyword = message.content.substr(4);
    randomAnimeWallpapers(keyword)
      .then(images => {
        message.reply(images[0].full);
      })   
  }
    //Connaitre la météo
  if (message.content.startsWith(prefix + 'météo')){
    var location = message.content.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                console.log(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                message.reply("\n" + "Je ne peux pas trouvé d'information pour la méteo de " + location);
                } else {
                data = data[0];
               console.log("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
               message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
              }
        });
    } catch(err) {
        console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("Une erreur est survenu, contacter l'administrateur ;) ");
        }
  }
  //Rejoindre un channel vocal
  if (message.content.startsWith(prefix + 'join')){
    const voiceConnection = message.member.voiceConnection;
      const voiceChannel = message.member.voiceChannel;
      if (!voiceChannel){
        message.reply("Vous n'êtes pas connecté sur un channel vocal");
      }else{
        message.reply("Connexion en cours ...");
        voiceChannel.join()
        .then(connection => {
        message.delete();
              message.reply('Je suis connecté'); 
        })
          .catch(console.error);
        }
  }
  //Quittez le channel vocal
  if (message.content.startsWith(prefix + 'leave')){
    const voiceChannel = message.member.voiceChannel;
    if(!voiceChannel){
        message.reply("Erreur, vous ne pouvez pas leave le bot car vous ne l'avez pas connecté ou vous n'êtes pas connecté aux channel vocal");
      }else{
        message.reply("Déconnexion en cours ...");
        message.member.voiceChannel.leave();
      }
  }  
  // Mettons un peu de manga :) /*Code en béta*/
  if (message.content.startsWith(prefix + "anime")){
    var rec = message.content.toUpperCase().split(' ');
    var lrec = message.content.split(' ');
    rec.shift()
    Anime.fromName(rec.join(' ')).then(anime => {
      message.channel.sendMessage("**" + anime.title + ":**\n");
      translate(anime.synopsis, {from: 'en', to: 'fr'}).then(res => {
        message.channel.sendMessage(res.text);
        message.channel.sendMessage('\n**Episodes : **' + anime.episodes);
          translate(anime.status, {from: 'en', to: 'fr'}).then(res => {
            message.channel.sendMessage(res.text);
            message.channel.sendMessage('\n**Réalisée: **' + anime.aired + '\n**Type: **' + anime.type +
      '\n**Note: **' + anime.statistics.score.value + "/10" + "\n**Genres: **" + anime.genres +
      '\n**Plus D\'Info: **' + anime.detailsLink + '\n');

          })
            .catch(err => {
               console.error(err);
             });
      })
      .catch(err => {
         console.error(err);
      });
      })

    }
    //Faisons une recherche google ! 
    google.resultsPerPage = 1; // je veux qu'une seul page
    var nextCounter = 0;
    google.lang = 'fr'; // Je veux des recherche en Fr
    google.tld = 'fr'; // Pareille
    	if (message.content.startsWith(prefix + 'g')){
		    var recherchegoogle = message.content.substr(2);
		    google(recherchegoogle, function (err, res){
        if (err) console.error(err)
 
        for (var i = 0; i < res.links.length; ++i) {
          var link = res.links[i];
          message.channel.sendMessage(link.title + ' - ' + link.href+ "\n" + link.description + "\n");
        }
      })
	  }

    // Faisons un peu de traduction :) 
    if (message.content.startsWith(prefix + 'trad')){
      var traduction = message.content.substr(5);
      translate(traduction, {from: 'en', to: 'fr'}).then(res => {
        message.channel.sendMessage(res.text); 
      }).catch(err => {
         console.error(err);
      });
    }
if (message.content.startsWith(prefix + 'radio 1')){
    message.member.voiceChannel.join()
    .then(connection => {
      require('http').get('http://streaming.radio.funradio.fr/fun-1-44-96', (res) => {
      connection.playStream(res);
      message.channel.sendMessage('Lecture radio : Fun Radio sélectionné !');
      })
    })
  }
  if (message.content.startsWith(prefix + 'radio 2')){
    message.member.voiceChannel.join()
    .then(connection =>{
      require('http').get('http://broadcast.infomaniak.ch/radioclassique-high.aac', (res) => {
        connection.playStream(res);
        message.channel.sendMessage('Lecture radio : Radio Classique séléctionné !');
      })
    })
  }
  if (message.content.startsWith(prefix + 'radio 3')){
    message.member.voiceChannel.join()
    .then(connection =>{
      require('http').get('http://sv2.vestaradio.com/Radio-Animes', (res) => {
        connection.playStream(res);
        message.channel.sendMessage('Lecture radio : Radio Anime séléctionné !');
      })
    })
  }
})

//identification
var dt = process.env.DISCORD_TOKEN || process.argv[2];

if (!dt) {
    console.log('Mjc5OTIyMzQxNDc4MTM3ODU2.C4B5hA.16zG9SKeRGGfBX2YwFswmGm_hlk');
}

client.login(dt);


