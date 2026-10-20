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
    // Keep the full league catalogue visible even when a competition has no fixture in this feed window.
    const competitionSports={
      'Premier League':'Football','Bundesliga':'Football','Scottish Premiership':'Football',
      'Champions League':'Football','Europa League':'Football','Conference League':'Football',
      'Eredivisie':'Football','La Liga':'Football','Ligue 1':'Football','Serie A':'Football',
      'Brazil Serie A':'Football','Championship':'Football','Formula 1':'F1',
      'EuroLeague':'Basketball','NBA':'Basketball','UFC':'Fight','Boxing':'Fight',
      'ATP Masters 1000':'Tennis'
    };
    for(const name of feed.replacesCompetitions){
      if(!competitionCatalogue.some(c=>c.name===name))competitionCatalogue.push({name,sport:competitionSports[name]||'Football'});
    }
    for(const e of feed.events)if(!competitionCatalogue.some(c=>c.name===e.competition))competitionCatalogue.push({name:e.competition,sport:e.sport});
    for(let i=events.length-1;i>=0;i--)if(feed.replacesCompetitions.includes(events[i].competition))events.splice(i,1);
    for(const e of feed.events){const i=events.findIndex(x=>x.id===e.id);if(i>=0)events[i]=e;else events.push(e);}
    for(let i=events.length-1;i>=0;i--){const start=Date.parse(events[i].start);if(Number.isFinite(start)&&start+3*60*60*1000<Date.now())events.splice(i,1);}
    events.sort((a,b)=>a.priority-b.priority||Date.parse(a.start)-Date.parse(b.start));
    render();
    let note=document.getElementById('programme-feed-status');
    if(!note){note=document.createElement('p');note.id='programme-feed-status';note.className='status';document.getElementById('list').before(note);}
    note.textContent='Programme checked '+feed.checked+' · All times in Greece · Ask Tebra to confirm screening.';
    for(const notice of document.querySelectorAll('.notice')){
      if(notice.textContent.trim().startsWith('Programme checked '))notice.textContent=note.textContent+' Table requests open WhatsApp; reservations require Tebra’s reply.';
    }
  }catch(error){/* Preserve the last verified programme when the network fails. */}
}
refreshProgrammeFeed();
setInterval(refreshProgrammeFeed,300000);
