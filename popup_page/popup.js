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
input.focus();

btnAdd.addEventListener('click', () => {
    if(channelList.includes(input.value)) return;
    channelList.push(input.value);
    chrome.storage.sync.set({ channels: channelList });
    renderChannels();
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

        let channelDiv = document.createElement("div");
        channelDiv.classList.add("channel");
        channelDiv.title = channel;

        channelDiv.addEventListener('click', () => {
            openChannel(channel);
        });

        let channelName = document.createElement('p');
        channelName.innerText = channel;

        let channelIconsDiv = document.createElement("div");
        channelIconsDiv.classList.add("icons-channel");

        let spanOpen = document.createElement('span');
        spanOpen.classList.add("material-icons", "icon-channel");
        spanOpen.innerHTML = "open_in_new";
        spanOpen.title = `Go to t.tv/${channel}`;

        let spanVideos = document.createElement('span');
        spanVideos.classList.add("material-icons", "icon-channel");
        spanVideos.innerHTML = "auto_awesome_motion";
        spanVideos.title = `Go to t.tv/${channel}/videos`;

        spanVideos.addEventListener('click', (e) => {
            e.stopPropagation();
            openChannel(channel+"/videos");
        });

        let spanDel = document.createElement('span');
        spanDel.classList.add("material-icons", "icon-channel");
        spanDel.innerHTML = "delete";
        spanDel.title = `Delete this channel`;

        spanDel.addEventListener('click', (e) => {
            e.stopPropagation();
            const channelNode = e.target.parentElement.parentElement;
            const channel = channelNode.innerText;
    
            channelList.splice(channelList.indexOf(channel),1);
            alreadyAdded.splice(alreadyAdded.indexOf(channel),1);
            channelsDiv.removeChild(channelNode);
    
            chrome.storage.sync.set({ channels: channelList });
            renderChannels();
        });
        
        channelIconsDiv.appendChild(spanOpen);
        channelIconsDiv.appendChild(spanVideos);
        channelIconsDiv.appendChild(spanDel);

        channelDiv.appendChild(channelName);
        channelDiv.appendChild(channelIconsDiv);

        channelsDiv.appendChild(channelDiv);
    });
}

function openChannel(channel){
    chrome.tabs.create(
        {url: `https://twitch.tv/${channel}`}
    )
}