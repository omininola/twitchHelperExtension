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

channelsDiv.addEventListener('dragover', (e) => {
    const draggingChannel = channelsDiv.querySelector('.dragging');
    const siblings = [...channelsDiv.querySelectorAll('.channel:not(.dragging)')];

    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;

    });

    channelsDiv.insertBefore(draggingChannel, nextSibling);
});

btnAdd.addEventListener('click', () => {
    if(channelList.includes(input.value)) return;
    channelList.push(input.value);
    chrome.storage.sync.set({ channels: channelList });
    input.value = "";
    input.focus();
    renderChannels();
});

form.addEventListener('submit', () => {
    channel = input.value;
    openChannel(channel);
});

function renderChannels(){
    channelList.forEach(channel => {
        if(alreadyAdded.includes(channel)) return;
        alreadyAdded.push(channel);

        let channelDiv = document.createElement("div");
        channelDiv.classList.add("channel");
        channelDiv.title = channel;
        channelDiv.draggable = "true";

        channelDiv.addEventListener('click', () => {
            openChannel(channel);
        });

        channelDiv.addEventListener('dragstart', () => {
            channelDiv.classList.add('dragging')
        });

        channelDiv.addEventListener('dragend', () => {
            channelDiv.classList.remove('dragging')
        });

        let channelName = document.createElement('p');
        channelName.innerText = channel;

        let channelIconsDiv = document.createElement("div");
        channelIconsDiv.classList.add("icons-channel");

        let spanVideos = document.createElement('span');
        spanVideos.classList.add("material-icons", "icon-channel", "icon-videos");
        spanVideos.innerHTML = "auto_awesome_motion";
        spanVideos.title = `Go to t.tv/${channel}/videos`;

        spanVideos.addEventListener('click', (e) => {
            e.stopPropagation();
            openChannel(channel+"/videos");
        });

        let spanDel = document.createElement('span');
        spanDel.classList.add("material-icons", "icon-channel", "icon-del");
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

        let spanDrag = document.createElement('span');
        spanDrag.classList.add("material-icons", "icon-channel", "icon-drag");
        spanDrag.innerHTML = "drag_indicator";
        
        channelIconsDiv.appendChild(spanVideos);
        channelIconsDiv.appendChild(spanDel);
        channelIconsDiv.appendChild(spanDrag);

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