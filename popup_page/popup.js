let channelList = [];
let alreadyAdded = [];
  
chrome.storage.sync.get(["channels"]).then((result) => {
    if(result.channels == null) channelList = [];
    else channelList = result.channels;
    renderChannels();
});

const channelsDiv = document.getElementById("channelListDiv");
const form = document.getElementById('form');
const input = document.getElementById('input');
const btnAdd = document.querySelector("#btnAdd");
const btnRem = document.querySelector("#btnRem");
input.focus();

btnAdd.addEventListener('click', () => {
    if(channelList.includes(input.value)) return;
    channelList.push(input.value);
    chrome.storage.sync.set({ channels: channelList });
    renderChannels();
});

btnRem.addEventListener('click', () => {
    channelsDiv.innerHTML = "";
    channelList = [];
    alreadyAdded = [];
    chrome.storage.sync.set({ channels: channelList });
});

form.addEventListener('submit', () => {
    channel = input.value;
    openChannel(channel);
});


function addChannel(){
    channelList.push(input.value);
    input.value = "";
    renderChannels();
}

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

        let span = document.createElement('span');
        span.classList.add("material-icons icon-channel");
        span.innerHTML = "open_in_new";

        link.appendChild(span);
        channelsDiv.appendChild(link);
    });
}

function openChannel(channel){
    chrome.tabs.create(
        {url: `https://twitch.tv/${channel}`}
    )
}