const axios = require('axios');
const fs = require('fs');

const baseUrl = 'https://www.cbc.ca/listen/api/v1/';
const outputFile = 'show-stream-mapping.json';

getStreams().then(streams => {
  const requests = streams.map(stream => getShowsForStream(stream))
  return Promise.all(requests);
}).then(result => {
  const collated = collate(result);
  let data = JSON.stringify(collated);
  fs.writeFileSync(outputFile, data);
  console.log(`wrote ${outputFile}`);
}).catch(e => {
  console.log(e);
})

  // returns all streams for R1 & CBCMusic from fetch
function getStreams() {
  const url = baseUrl + '/networks?inline=streams';

  return axios.get(url).then(resp => {
    let streams = [];
    const networks = resp.data.data;
    for (const network of networks) {
      let networkStreams = network.streams.map(stream => {
        return {  networkID: network.id,
                  id: stream.id,
                  programGuideLocationKey: stream.programGuideLocationKey }
      })
      streams.push(networkStreams);
    }
    streams = streams.flat();
    return streams;
  })
}

// takes a given stream object from getStreams
// fetches program queue data for stream
// returns an object with the stream id and an array of all the show IDs played on that stream (ShowsForStream)
function getShowsForStream(stream) {
  const url = baseUrl + `program-queue/${stream.networkID}/${stream.programGuideLocationKey}/day/${formatDateToYYYYMMDD()}/15`

  return axios.get(url).then(resp => {
      const shows = resp.data.data.map(show => show.showID);
      return { id: stream.id, shows: shows }
  })
}

// takes an array of ShowsForStream objects,
// returns a collation with showIDs as keys, and an array of streamIDs that air that show as values
function collate(streamShowData) {
  let result = {}
  for (streamShowPair of streamShowData) {
    for (show of streamShowPair.shows) {
      let ids = result[show] || new Set();
      ids.add(streamShowPair.id);
      result[show] = ids;
    }
  }
  // convert Set to Array
  const formatted = Object.keys(result).map(key => ({showID: key, liveStreams: Array.from(result[key])} ));
  return formatted;
}

function formatDateToYYYYMMDD() {
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return '' + y + (m<=9 ? '0' + m : m) + (d <= 9 ? '0' + d : d);
}
