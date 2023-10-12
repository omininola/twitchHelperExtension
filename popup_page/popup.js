let channelList = ["felps", "yasminhalves", "lhardoo"];
const channelsDiv = document.getElementById("channelListDiv");

channelList.forEach(channel => {
    let link = document.createElement('a');
    link.classList.add("channel");
    link.href = `https://www.twitch.tv/${channel}`;
    link.innerText = channel[0].toUpperCase() + channel[1].toLowerCase();
    link.addEventListener('click', () => {
        openChannel(channel);
    })

    channelsDiv.appendChild(link);
})

form = document.getElementById('form');
input = document.getElementById('input');
input.focus();

form.addEventListener('submit', () => {
    channel = input.value;
    openChannel(channel);
})

function openChannel(channel){
    chrome.tabs.create(
        {url: `https://twitch.tv/${channel}`}
    )
}