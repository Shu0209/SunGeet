let currentSong=new Audio();

let songs;
let currFolder;

// Second to minute
function convertTime(seconds) {
    if(isNaN(seconds)){
        return `0:0`;
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    var result = minutes + ":" + remainingSeconds;
    return result;
}

async function getsongs(folder) {
    currFolder=folder
    let a = await fetch(`/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }


    let songLi = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songLi.innerHTML=""
    for (const song of songs) {
        songLi.innerHTML = songLi.innerHTML + `<li>
        <img src="svg/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>-Artist</div>
        </div>
        <div class="playnow">
            <div>Play now</div>
            <img style="filter:invert();" src="svg/play.svg" alt="">
        </div>
       

        </li>`
    }

  

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
          //  console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    
    return songs
}

// Play Music
const playmusic=(track,pause=false)=>{
    currentSong.src=`${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="svg/pause.svg"
    }
    
    
    //Display current song name
    document.querySelector(".songname").innerHTML=track.split(".mp3")[0].replaceAll("%20"," ")
}

//displayAlbum Function
async function displayAlbums(){
let a=await fetch(`songs/`)
console.log(a)
let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors=div.getElementsByTagName("a")
    console.log(anchors)
    let cardContainer=document.querySelector(".container")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("songs/")){
            let folder=e.href.split("/").slice(-1)[0]
            //get meta data of folder
            let a=await fetch(`songs/${folder}/info.json`)
             let response = await a.json()
             console.log(response)
             cardContainer.innerHTML=cardContainer.innerHTML+` <div data-folder="${folder}" class="card">
             <div class="hoverPlay">
                 <img src="hoverPlay.svg" alt="">
             </div>
             <img src="songs/${folder}/cover.jpg" alt="">
             <h2>${response.Title}</h2>
             <p>${response.Discription}</p>
         </div>`
        }
    }


//Load playlist whenever we clicked the card
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
    console.log(item,item.currentTarget.dataset)
    console.log(`songs/${item.currentTarget.dataset.folder}`)
    songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    playmusic(songs[0])

})
})

}


async function main() {

    
    //Get all the list of songs
    songs = await getsongs("songs/first");
   // console.log(songs)
    
   
    //Display all the albums on the page

    displayAlbums()
      
   
  

    //Attatch event listener in play button
     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="svg/pause.svg"
        }
        else{
            currentSong.pause();
            play.src="svg/play.svg"
        }
     })
//set time and seekbar
currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${
    convertTime(currentSong.currentTime)}/${convertTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left=currentSong.currentTime/currentSong.duration*100+"%";
})
     
//add event listner in seekbar

document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%"
    currentSong.currentTime=((currentSong.duration)*percent)/100;
})


  


}
  

//add event listener in next button
next.addEventListener("click",()=>{
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //console.log(index)
    if(index+1<songs.length){
        playmusic(songs[index+1])
    }
    else{
        playmusic(songs[0])
    }
    })

//add event listener in previous button
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if(index-1>=0){
        playmusic(songs[index-1])
    }
    else{
        playmusic(songs[0])
    }
    })


//add event listener in hamburger

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0px"
})
//add event listner in close button

document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
})

//add event listner in volume

document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    //console.log(e);
    currentSong.volume=e.target.value/100;
    if(currentSong.volume==0){
        vol.src="svg/mute.svg";
    }
    else{
        vol.src="svg/volume.svg";
    }
})
vol.addEventListener("click",()=>{
if(currentSong.muted){
    currentSong.muted=false;
    vol.src="svg/volume.svg";
}
else{
    currentSong.muted=true;
    vol.src="svg/mute.svg";

}
})




main()