let channelList = [];
let alreadyAdded = [];
  
channelList = chrome.storage.sync.get(["channels"]).then((result) => {
    console.log("Value currently is " + result.key)
});

const channelsDiv = document.getElementById("channelListDiv");
const form = document.getElementById('form');
const input = document.getElementById('input');
const btnAdd = document.querySelector(".button-add");
input.focus();

btnAdd.addEventListener('click', () => {
    channelList.push(input.value);
    chrome.storage.sync.set({ channels: channelList }).then(() => {
        console.log("Value is set");
    });
    renderChannels();
});

form.addEventListener('submit', () => {
    channel = input.value;
    openChannel(channel);
});


function addChannel(){
    channelList.push(input.value);
    renderChannels();
}

renderChannels();

function renderChannels(){
    channelList.forEach(channel => {
        if(alreadyAdded.includes(channel)) return;
        alreadyAdded.push(channel);

        let link = document.createElement('a');
        link.classList.add("channel");
        link.href = `https://www.twitch.tv/${channel}`;
        link.innerText = channel;
        link.addEventListener('click', () => {
            openChannel(channel);
        });
    
        channelsDiv.appendChild(link);
    });
}

function openChannel(channel){
    chrome.tabs.create(
        {url: `https://twitch.tv/${channel}`}
    )
}