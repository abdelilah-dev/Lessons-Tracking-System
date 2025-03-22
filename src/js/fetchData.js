let api_key = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchPlayList(playListId) {
    try {
        let response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playListId}&maxResults=180&key=${api_key}`);
        if (!response.ok)
            throw new Error(`HTTPS ERROR! Status: ${response.status}`);
        let data = await response.json();
        if (data.items.length === 0)
            return;
        return data;
    }
    catch (error) {
        throw new Error(`Http Error! Status: ${error}`);
    }
}


export async function fetchMoreVideos(playListId) {
    let allItems = [];
    let nextPageToken = null;
    try {
        do {
            let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playListId}&maxResults=180&key=${api_key}`
            if (nextPageToken) {
                url += `&pageToken=${nextPageToken}`
            }
            let response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTPS ERROR! Status: ${response.status}`);
            let data = await response.json();
            if (data.items.length === 0)
                return;
            nextPageToken = data.nextPageToken || null;
            allItems.push(...data.items);
        } while (nextPageToken);
    } catch (error) {
        throw new Error(`Http Error! Status: ${error}`);
    }
    return allItems;
}
