// The programme is public; no account credentials are used in visitor browsers.
async function refreshProgrammeFeed(){
  try {
    const response=await fetch('https://raw.githubusercontent.com/Tarebeti/tebra-sports-bar/main/public/sports-programme.json?v='+Math.floor(Date.now()/300000));
    if(!response.ok)throw new Error('Programme unavailable');
    const feed=await response.json();
    if(feed.timezone!=='Europe/Athens'||!/^\d{4}-\d{2}-\d{2}$/.test(feed.checked)||!Array.isArray(feed.events)||feed.events.length>1000||!Array.isArray(feed.replacesCompetitions))throw new Error('Invalid programme');
    const safeText=v=>typeof v==='string'&&v.length<250&&!/[<>"'\\`]/.test(v);
    const safeDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v);
    if(feed.replacesCompetitions.some(c=>!safeText(c))||feed.events.some(e=>!safeText(e.title)||!safeText(e.competition)||!safeText(e.sport)||!/^[-a-zA-Z0-9]+$/.test(e.id)||!safeDate(e.date)||!safeDate(e.verified)||!/^\d{2}:\d{2}$/.test(e.time)||!Number.isFinite(Date.parse(e.start))||!/^https:\/\/[^<>"'\\`\s]+$/.test(e.source)||!['confirmed','unconfirmed'].includes(e.screening)||!Number.isFinite(e.priority)))throw new Error('Invalid event');
    for(let i=events.length-1;i>=0;i--)if(feed.replacesCompetitions.includes(events[i].competition))events.splice(i,1);
    for(const e of feed.events){const i=events.findIndex(x=>x.id===e.id);if(i>=0)events[i]=e;else events.push(e);}
    render();
    let note=document.getElementById('programme-feed-status');
    if(!note){note=document.createElement('p');note.id='programme-feed-status';note.className='status';document.getElementById('list').before(note);}
    note.textContent='Programme checked '+feed.checked+' · All times in Greece · Ask Tebra to confirm screening.';
  }catch(error){/* Preserve the last verified programme when the network fails. */}
}
refreshProgrammeFeed();
setInterval(refreshProgrammeFeed,300000);
