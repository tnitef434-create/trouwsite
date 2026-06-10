import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MessageSquare, MapPin, Clock, Calendar, Info, Heart, Send, ChevronRight, ChevronDown, RotateCcw, Settings, Map as MapIcon, Pin, PinOff, X, Zap, Maximize, Menu, Cloud, Sun, Droplets, Plus, Mail, Music, Camera, LogOut, FileText, Image, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LiveClock = ({ langEN }: { langEN: boolean }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase text-[#c7b272] mb-3 md:mb-4">
      {now.toLocaleDateString(langEN ? 'en-US' : 'nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })} <span className="opacity-50 mx-1">|</span> {now.toLocaleTimeString(langEN ? 'en-US' : 'nl-NL', { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

const CountdownWidget = ({ langEN }: { langEN: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const target = new Date("2026-06-14T13:00:00+02:00").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4 text-[#c7b272]">
      <div className="bg-[#1A1A2E] dark:bg-slate-800 rounded-2xl w-20 h-24 flex flex-col items-center justify-center shadow-inner">
        <span className="text-3xl font-bold font-mono">{timeLeft.days}</span>
        <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-80">{langEN ? 'Days' : 'Dgn'}</span>
      </div>
      <div className="bg-[#1A1A2E] dark:bg-slate-800 rounded-2xl w-20 h-24 flex flex-col items-center justify-center shadow-inner">
        <span className="text-3xl font-bold font-mono">{timeLeft.hours}</span>
        <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-80">{langEN ? 'Hours' : 'Uur'}</span>
      </div>
      <div className="bg-[#1A1A2E] dark:bg-slate-800 rounded-2xl w-20 h-24 flex flex-col items-center justify-center shadow-inner">
        <span className="text-3xl font-bold font-mono">{timeLeft.minutes}</span>
        <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-80">{langEN ? 'Mins' : 'Min'}</span>
      </div>
    </div>
  );
};

const WeatherWidget = ({ langEN }: { langEN: boolean }) => {
  const [weather, setWeather] = useState<{ temp: number, desc: string, icon: any } | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=52.0315&longitude=5.3444&current_weather=true")
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          const wmoCode = data.current_weather.weathercode;
          let descResult = 'Clear';
          let WIcon = Sun;
          if (wmoCode >= 1 && wmoCode <= 3) { descResult = 'Partly Cloudy'; WIcon = Cloud; }
          else if (wmoCode >= 45 && wmoCode <= 48) { descResult = 'Fog'; WIcon = Cloud; }
          else if (wmoCode >= 51 && wmoCode <= 67) { descResult = 'Rain'; WIcon = Droplets; }
          else if (wmoCode >= 71 && wmoCode <= 82) { descResult = 'Snow'; WIcon = Cloud; }
          else if (wmoCode >= 95) { descResult = 'Thunderstorm'; WIcon = Cloud; }
          
          setWeather({
            temp: data.current_weather.temperature,
            desc: langEN ? descResult : descResult === 'Clear' ? 'Helder' : descResult === 'Partly Cloudy' ? 'Halfbewolkt' : descResult === 'Rain' ? 'Regen' : descResult === 'Snow' ? 'Sneeuw' : descResult === 'Fog' ? 'Mist' : 'Onweer',
            icon: WIcon
          });
        }
      }).catch(err => console.error(err));
  }, [langEN]);

  if (!weather) {
    return (
      <div className="flex items-center justify-between bg-[#F5F0E6] dark:bg-slate-950 p-6 rounded-2xl animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1A1A2E]/10 dark:bg-white/10" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-16 bg-[#1A1A2E]/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-24 bg-[#1A1A2E]/10 dark:bg-white/10 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-4 w-12 bg-[#1A1A2E]/10 dark:bg-white/10 rounded" />
          <div className="h-3 w-16 bg-[#1A1A2E]/10 dark:bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  const IconComponent = weather.icon;

  return (
    <div className="flex items-center justify-between bg-[#F5F0E6] dark:bg-slate-950 p-6 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[#c7b272] shadow-sm">
          <IconComponent size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-[#1A1A2E] dark:text-slate-100">{Math.round(weather.temp)}°C</p>
          <p className="text-sm text-gray-500 font-medium capitalize">{weather.desc}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold tracking-widest uppercase text-[#c7b272]">Doorn</p>
        <p className="text-xs text-gray-400 mt-1">Actueel</p>
      </div>
    </div>
  );
};

const NotesWidget = ({ langEN }: { langEN: boolean }) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('wedding_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
  }, []);

  const saveNotes = (updatedNotes: string[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('wedding_notes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() && notes.length < 5) {
      saveNotes([...notes, newNote.trim()]);
      setNewNote("");
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...notes];
    updated.splice(index, 1);
    saveNotes(updated);
  };

  return (
    <div className="text-left">
      <div className="space-y-3 mb-4">
        {notes.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center py-4">{langEN ? 'No notes yet...' : 'Nog geen notities...'}</p>
        )}
        {notes.map((note, idx) => (
          <div key={idx} className="bg-[#F5F0E6] dark:bg-slate-950 p-4 rounded-xl flex justify-between gap-4 group">
            <p className="text-sm text-[#1A1A2E] dark:text-slate-200 break-words flex-1">{note}</p>
          </div>
        ))}
      </div>
      
      {notes.length < 5 ? (
        <form onSubmit={handleAddNote} className="relative">
          <input 
            type="text" 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={langEN ? 'Write a personal note...' : 'Schrijf een persoonlijke notitie...'}
            className="w-full bg-[#F5F0E6] dark:bg-slate-950 text-[#1A1A2E] dark:text-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c7b272] border border-[#1A1A2E]/5 dark:border-white/5"
            maxLength={200}
          />
          <button 
            type="submit"
            disabled={!newNote.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#1A1A2E] dark:bg-[#c7b272] text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </form>
      ) : (
        <p className="text-xs text-center text-[#c7b272] font-bold mt-2">
          {langEN ? 'Maximum 5 notes reached' : 'Maximum van 5 notities bereikt'}
        </p>
      )}
    </div>
  );
};

// --- DATA ---

export const scheduleNL = [
  {
    "id": 1,
    "time": "**12.15 - 12.45**",
    "title": "**Welkom & lekkers",
    "desc": "Eten en drinken staan voor je klaar.\nSchrijf nu of tijdens de receptie je gelukswensen aan het bruidspaar in het gastenboek op de tekentafel in de Palmenkas.**",
    "location": "Palmenkas/Terras",
    "context": ""
  },
  {
    "id": 2,
    "time": "**12.45 - 13.00**",
    "title": "**Naar 'de haag'",
    "desc": "Je wordt uitgenodigd om buiten bij 'de haag' het bruidspaar op te wachten.**",
    "location": "Buiten bij de haag",
    "context": ""
  },
  {
    "id": 3,
    "time": "**13.00 - 13.15**",
    "title": "**Aankomst bruidspaar",
    "desc": "Het bruidspaar arriveert.**",
    "location": "Buiten bij de haag",
    "context": ""
  },
  {
    "id": 4,
    "time": "**13.15 - 13.25**",
    "title": "**Plaatsnemen in de Oranjekas",
    "desc": "Iedereen zoekt een mooi plekje op. Voor naaste familie zijn vooraan stoelen gereserveerd.**",
    "location": "Oranjekas",
    "context": ""
  },
  {
    "id": 5,
    "time": "**13.25 - 14.25**",
    "title": "**Ceremonie",
    "desc": "Het ja-woord, de ringen en de geloften.**",
    "location": "Oranjekas",
    "context": ""
  },
  {
    "id": 6,
    "time": "**14.25 - 14.45** ",
    "title": "**Erehaag met bloemen & felicitaties",
    "desc": "Vanaf het gangpad bloemblaadjes werpen naar het bruidspaar & gelegenheid tot felicitaties.**",
    "location": "Oranjekas",
    "context": ""
  },
  {
    "id": 7,
    "time": "**14.45 - 15.00**",
    "title": "**Pauze**",
    "desc": "",
    "location": "Palmenkas/privéruimte",
    "context": ""
  },
  {
    "id": 8,
    "time": "**15.00 - 15.30**",
    "title": "**Toost & Bruidstaart**",
    "desc": "",
    "location": "Palmenkas",
    "context": ""
  },
  {
    "id": 9,
    "time": "**15.30 - 16.00**",
    "title": "**Receptie start en groepsfoto's",
    "desc": "De fotograaf maakt dit half uur groepsfoto's in 6 grote groepen:\n1. Familie Prins 2. Familie Mekking 3. Familie Uiterwijk 4. Familie Herlaar 5. Vrienden, Collega's & CM 6. Iedereen\nZie de lijst met namen bij 'Toon aanvullende context' en uitgeprint op de tekentafel in de Palmenkas.**",
    "location": "Palmenkas/Terras",
    "context": "Groepsfoto's \n\n1. Familie Prins & aanhang (en Wilma, Fleur en Samuel)\n*Familie Prins met aanhang \n*Familie Prins klein: Cor, Anca, Sara, Lisa, Jai, Fleur en Samuel  \n*Ouders bruidspaar: Wilma en Cor & Gonnie en Leo (via fotoshop)\n*(Schoon)zussen Lisa, Sara \n*Fleur en Samuel \n\n2. Familie Mekking & aanhang (en Fleur en Samuel)\n*Familie Mekking met aanhang \n*Familie Mekking klein: Opa, Wilma, Rob, Arthur, Lisa, Jai, Fleur en Samuel  \n*Opa Mekking \n\n3. Familie Uiterwijk & aanhang (en Fleur en Samuel)\n*Familie Uiterwijk: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen en Miriam \n*Familie Uiterwijk klein: Fleur, Samuel, Rinske, Emma, Anna, Jet \n*Rinske \n\n4. Familie Herlaar & aanhang (en Fleur en Samuel)\n*Familie Herlaar: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin en Anja \n*Familie Herlaar klein: Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Wil  \n\n5. Vrienden, Collega's & CM \n*Vriendengroep \n*Collega's \n*Karima en Felix\n*Suzanne en Gijsbert\n*Ceremoniemeesters  \n\n6. Totaal\n*Alle gasten "
  },
  {
    "id": 10,
    "time": "**16.00 - 17.30**",
    "title": "**Receptie vervolg",
    "desc": "Geniet van hapjes en drankjes.**",
    "location": "",
    "context": ""
  },
  {
    "id": 11,
    "time": "**17.30 - 17.45**",
    "title": "**Einde receptie & uitzwaaien",
    "desc": "Vergeet je persoonlijke spullen niet en neem een presentje mee dat bij het gastenboek op de tekentafel in de Palmenkas ligt.\nDank je wel dat je deze dag met ons samen hebt gevierd!**",
    "location": "Haag buiten",
    "context": ""
  }
];

export const scheduleEN = [
  {
    "id": 1,
    "time": "**12.15 - 12.45**",
    "title": "Welcome & treats",
    "desc": "Food and drinks are waiting for you.\nWrite your wishes for the couple in the guestbook on the drawing table in the Palm House now or during the reception.",
    "location": "Palm House/Terrace",
    "context": ""
  },
  {
    "id": 2,
    "time": "**12.45 - 13.00**",
    "title": "To 'the hedge'",
    "desc": "You are invited to wait outside by 'the hedge' for the couple.",
    "location": "Outside by 'the hedge'",
    "context": ""
  },
  {
    "id": 3,
    "time": "**13.00 - 13.15**",
    "title": "Arrival of the couple",
    "desc": "The couple arrives.",
    "location": "Outside by 'the hedge'",
    "context": ""
  },
  {
    "id": 4,
    "time": "**13.15 - 13.25**",
    "title": "Taking seats in the Orange Greenhouse",
    "desc": "Everyone finds a nice spot. Seats at the front are reserved for close family.",
    "location": "Orange Greenhouse",
    "context": ""
  },
  {
    "id": 5,
    "time": "**13.25 - 14.25**",
    "title": "Ceremony",
    "desc": "The wedding vows, rings, and vows.",
    "location": "Orange Greenhouse",
    "context": ""
  },
  {
    "id": 6,
    "time": "**14.25 - 14.45** ",
    "title": "Flower arch & congratulations",
    "desc": "Throw flower petals at the couple from the aisle & opportunity for congratulations.",
    "location": "Orange Greenhouse",
    "context": ""
  },
  {
    "id": 7,
    "time": "**14.45 - 15.00**",
    "title": "**Break**",
    "desc": "",
    "location": "Palm House/Rest area",
    "context": ""
  },
  {
    "id": 8,
    "time": "**15.00 - 15.30**",
    "title": "**Toast & Wedding cake**",
    "desc": "",
    "location": "Palm House",
    "context": ""
  },
  {
    "id": 9,
    "time": "**15.30 - 16.00**",
    "title": "Reception begins & group photos",
    "desc": "De fotograaf maakt dit half uur groepsfoto's in 6 grote groepen:\n1. Familie Prins 2. Familie Mekking 3. Familie Uiterwijk 4. Familie Herlaar 5. Vrienden, Collega's & CM 6. Iedereen\nZie de lijst met namen bij 'Toon aanvullende context' en uitgeprint op de tekentafel in de Palmenkas.",
    "location": "Palm House/Terrace",
    "context": "Group photos \n\n1. The Prins family & partners (and Wilma, Fleur, and Samuel)\n*The Prins family with partners \n*The Prins family (small group): Cor, Anca, Sara, Lisa, Jai, Fleur, and Samuel  \n*Parents of the bride and groom: Wilma and Cor & Gonnie and Leo (Leo & Gonnie added via Photoshop) \n*(Sisters-in-law) Lisa, Sara \n*Fleur and Samuel \n\n2. The Mekking family & partners (and Fleur and Samuel)\n*The Mekking family with partners  \n*The Mekking family (small group): Grandpa, Wilma, Rob, Arthur, Lisa, Jai, Fleur, and Samuel  \n*Grandpa Mekking \n\n3. The Uiterwijk family & partners (and Fleur and Samuel)\n*The Uiterwijk family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen, and Miriam \n*The Uiterwijk family (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Rinske \n\n4. The Herlaar family & partners (and Fleur and Samuel)\n*Herlaar family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin, and Anja\n*Familie Herlaar (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet  \n*Wil  \n\n5. Friends, Colleagues & Masters of Ceremony \n*Group of friends \n*Colleagues \n*Karima and Felix\n*Suzanne and Gijsbert\n*Masters of Ceremonies  \n\n6. Total\n*All guests "
  },
  {
    "id": 10,
    "time": "**16.00 - 17.30**",
    "title": "Reception continues",
    "desc": "Enjoy snacks and drinks.",
    "location": "",
    "context": ""
  },
  {
    "id": 11,
    "time": "**17.30 - 17.45**",
    "title": "End of the reception and seeing off",
    "desc": "Don't forget your personal belongings and take a gift with you located near the guestbook on the drawing table in the Palm House.\nThank you for celebrating this day with us!",
    "location": "Outside by 'the hedge'",
    "context": ""
  }
];

export const cmTasksNL = [
  {
    "id": 1,
    "time": "**9.30 - 11.00** ",
    "action": "Opbouw locatie",
    "who": "*Aanwezig op locatie, alles klaarzetten en controleren. Met hulp van Team Oranjerie. \n*Jullie plannen terplekke een meeting in met Team Oranjerie.\n*Matthew is eerste aanspreekpunt. \n*Decoratie hebben jullie meegekregen van Jorik.\n*Bloemdecoratie volgt om 10.30 van Jorik, daarna graag overal neerzetten.\n*Zie pagina 'Bijlage' voor: Borden Parkeerplaats, Ceremonie Stoelschikking, Diner Stoelschikking en Diner Tafeldekking.",
    "context": "",
    "location": "Palmenkas/Oranjekas/Terras/Tuin en parkeerplaats "
  },
  {
    "id": 2,
    "time": "**9.00 - 9.30** ",
    "action": "Bruidspaar thuis met gezin",
    "who": "Ter info",
    "context": "",
    "location": "Thuis in Rijswijk"
  },
  {
    "id": 3,
    "time": "**9.30 - 10.30** ",
    "action": "Bruidspaar onderweg naar de Oranjerie",
    "who": "*De Italiaanse playlist laten spelen in de Palmenkas als \nwelkom voor het bruidspaar. Aan laten totdat jullie met alle gasten richting 'de haag' gaan om 12.45.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek. ",
    "context": "Hoe moet de muziek aangeleverd worden? \n\n*Offline bestand. \n*Werktelefoon Katinka op vliegtuigstand. \n*Spotify (Joriks account) ivm geen reclame. \n*Back-up: Katinka's huidige telefoon. \n*Muziek gaat apart in beide zalen. \n*Playlist op repeat. \n* 'Holy Forever' (bij het naar voren lopen van het bruidspaar) wordt los aangeleverd omdat dat liedje ook los aangezet moet worden.\n \nMuziek bij de ontvangst van het bruidspaar en de gasten:\n\n10.30 - 12.45 \n*Italiaanse playlist.   \n\n",
    "location": "Reistijd"
  },
  {
    "id": 4,
    "time": "**10.30 - 11.00**",
    "action": "Aankomst bruidspaar",
    "who": "*Koffie/drinken met lekkers.\n*Het bruidspaar heeft de bloemdecoratie bij zich, die kan nu neergezet worden.\n*Het bruidspaar zet zelf de auto aan de zijkant van het pand.\n*En vertrekt om 11.45 uur naar een rustige plek.\n\n",
    "context": "",
    "location": "Palmenkas/Terras/privéruimte"
  },
  {
    "id": 5,
    "time": "**10.45 - 11.00**",
    "action": "Aankomst Wilma/Rob en Wil ",
    "who": "*Koffie/drinken met lekkers.\n*Wilma heeft de bruidstaart bij zich.",
    "context": "",
    "location": "Palmenkas/Terras"
  },
  {
    "id": 6,
    "time": "**11.00 - 12.00** ",
    "action": "Eindcheck door Wilma en Fleur",
    "who": "*Wilma en Fleur doen een eindcheck op de decoratie.\nIn principe is alles voor die tijd al klaar.\n",
    "context": "",
    "location": "Palmenkas/Oranjekas/Terras/Tuin en parkeerplaats"
  },
  {
    "id": 7,
    "time": "**11.30 - 11.45**   ",
    "action": "Bruidspaar vertrekt van de Oranjerie ",
    "who": "Het bruidspaar komt om 13.00 uur weer terug.",
    "context": "",
    "location": "Reistijd"
  },
  {
    "id": 8,
    "time": "**12.00 - 12.15**",
    "action": "Aankomst fotograaf",
    "who": "Audra: 06 - 27 59 13 63\nZet zelf zijn spullen klaar.",
    "context": "",
    "location": ""
  },
  {
    "id": 9,
    "time": "**12.15 - 12.45** ",
    "action": "Aankomst overige gasten (68 p)",
    "who": "*Koffie/drinken met lekkers.\n*Derek: gasten welkom heten bij de ingang van de Oranjerie. \n*CM zijn aanspreekpunt voor gasten.\n*In totaal zijn we deze dag met 78 personen, zie bijlage Gastenlijst.\n*Zie 'Toon aanvullende context' hieronder voor de Gastenlijst. \n",
    "context": "Gastenlijst:\n\n1.\tJorik\n2.\tKatinka\n3.\tFleur\n4.\tSamuel\n5.\tRinske \n6.\tWil\n7.\tEmma\n8.\tJet\n9.\tAnna\n10.\tOpa\n11.\tWilma\n12.\tRob\n13.\tLisa\n14.\tJaikishen\n15.\tArthur\n16.\tCor\n17.\tAnca\n18.\tSara\n19.\tHerman\n20.\tMylene\n21.\tMerian\n22.\tJim\n23.\tLeanne\n24.\tJasper\n25.\tBernhard\n26.\tYvonne\n27.\tRoos\n28.\tDerek\n29.\tMarianne\n30.\tMatthew\n31.\tJoke\n32.\tGerard\n33.\tSander (neef J)\n34.\tIneke\n35.\tNicole\n36.\tWilfred \n37.\tPatricia\n38.\tArjan \n39.\tMike\n40.\tMercedes\n41.\tMaik\n42.\tJustin\n43.\tRik\n44.\tLorena\n45.\tMark\n46.\tSander Uphus\n47.\tLydia\n48.\tChris\n49.\tDesi\n50.\tBas\n51.\tCharlotte\n52.\tTim\n53.\tSanne\n54.\tKarima\n55.\tFelix \n56.\tThalita\n57.\tNaomi\n58.\tRoelfien\n59.\tAda \n60.\tPaul (man van Ada) \n61.\tDara\n62.\tAnne\n63.\tHelian\n64.\tBarbara\n65.\tAnita\n66.\tAnnette\n67.\tNorbert\n68.\tJessica\n69.\tJurjen\n70.\tMiriam \n71.\tMonique\n72.\tSander (neef K)\n73.\tLize\n74.\tErwin\n75.\tAnja\n76.\tRuud\n77.\tSuzanne\n78.\tGijsbert\n",
    "location": "Palmenkas/Terras"
  },
  {
    "id": 10,
    "time": "**12.45 - 13.00** ",
    "action": "Gasten meenemen naar 'de haag'",
    "who": "*Gasten om 12.45 uur leiden naar 'de haag' om het bruidspaar op te wachten.\n*De gasten vormen een haag in 'de haag'. \n*Alle gasten moeten om 12.55 klaar staan. \n*Ervoor zorgen dat Fleur, Samuel en opa (en de naaste familie) vooraan staat in 'de haag' omdat zij het bruidspaar straks ook als eerste volgen.  ",
    "context": "\n\n",
    "location": "Buiten bij de haag"
  },
  {
    "id": 11,
    "time": "**13.00 - 13.10** ",
    "action": "Aankomst BABS",
    "who": "Matthew: BABS welkom heten en eventuele vragen beantwoorden.",
    "context": "",
    "location": ""
  },
  {
    "id": 12,
    "time": "**13.00 - 13.05** ",
    "action": "Aankomst bruidspaar bij 'de haag' ",
    "who": "De auto stopt halverwege.\nJorik laat Katinka uitstappen.\n ",
    "context": "",
    "location": "Buiten bij de haag"
  },
  {
    "id": 13,
    "time": "**13.05 - 13.15** ",
    "action": "Stoet naar de Oranjerie ",
    "who": "*Het bruidspaar loopt rechtsom.\n*Zorgen dat de gasten achter ons aanlopen. \n*Fleur, Samuel en opa direct achter ons omdat zij naar een aparte ruimte met ons gaan.  ",
    "context": "",
    "location": "Lopend naar de Oranjerie"
  },
  {
    "id": 14,
    "time": "**13.15 - 13.25** ",
    "action": "Privé-ruimte en pauze",
    "who": "*Het bruidspaar, Fleur, Samuel en opa nemen plaats in de privé-ruimte.\n*Vanaf daar lopen zij achterlangs weer naar de ingang van de Oranjerie als alle gasten zitten. ",
    "context": "",
    "location": "Privéruimte"
  },
  {
    "id": 15,
    "time": "**13.15 - 13.25** ",
    "action": "Gasten plaatsnemen in de Oranjekas ",
    "who": "*Aangeven dat de gasten plaats mogen nemen in de Oranjekas. \n*Zie pagina 'Bijlage' voor de Ceremonie Stoelschikking, de eerste 2 rijen zijn met naambordjes gereserveerd voor hoofdgasten.\n*2 stoelen achter aan de zijkant reserveren voor de CM zodat jullie goed overzicht hebben.",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 16,
    "time": "**13.15 - 13.25** ",
    "action": "Welkom door de BABS",
    "who": "De BABS heet iedereen welkom en vertelt de gasten wat van hen verwacht wordt.\n\"Geen foto's tijdens ceremonie en dat alle gasten moeten gaan staan op haar teken.\"",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 17,
    "time": "**13.25 - 13.27** ",
    "action": "Intocht Jorik met opa",
    "who": "*Zorgen dat het liedje 'Holy Forever' afspeelt zodra Jorik met opa bij de ingang klaarstaat. \n*Jorik en opa lopen naar voren als de muziek begint. \n*Ze blijven even samen vooraan staan, waarna opa plaats neemt op zijn gereserveerde stoel. \n*Jorik wacht daar vooraan staand in het midden met zijn gezicht richting de voordeur op Katinka. \n*Zie 'Toon aanvullende context' hieronder voor de Muziek.",
    "context": "Muziek bij het naar voren lopen van het bruidspaar\nNB dit wordt los aangeleverd, gaat om 1 liedje dat doorspeelt bij Jorik en Katinka:\n\n13.25 - 13.30\n*Holy Forever \nSax Instrumental / Chris Tomlin (cover) / Uriel Vega\n\n",
    "location": "Oranjekas"
  },
  {
    "id": 18,
    "time": "**13.27 - 13.30** ",
    "action": "Intocht Katinka met Fleur en Samuel",
    "who": "*Zorgen dat het liedje 'Holy Forever' blijft doorspelen.  \n*Katinka loopt met de kinderen naar voren, deuren achter haar sluiten.\n*Vooraan komt het bruidspaar samen en gaan de kinderen zitten.\n*Het bruidspaar blijft staan totdat de muziek vervaagt.\n*De BABS zegt dat de iedereen moet gaan zitten.\n*Zorgen dat de muziek stopt.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek. ",
    "context": "Muziek bij het naar voren lopen van het bruidspaar\nNB dit wordt los aangeleverd, gaat om 1 liedje dat doorspeelt bij Jorik en Katinka:\n\n13.25 - 13.30\n*Holy Forever \nSax Instrumental / Chris Tomlin (cover) / Uriel Vega\n\n\n\n",
    "location": "Oranjekas"
  },
  {
    "id": 19,
    "time": "**13.30 - 14.00** ",
    "action": "Huwelijksvoltrekking",
    "who": "Het ja-woord, de ringen en de geloften.",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 20,
    "time": "**13.45 - 14.45** ",
    "action": "Opbouw bruidstaart",
    "who": "Door Team Oranjerie wordt ondertussen in de Palmenkas de bruidstaart klaargezet.\nCM: zorgen dat Team Oranjerie weet dat de taart op een ronde, hoge tafel in het midden van de Palmenkas moet komen, met tafelkleed eronder. ",
    "context": "",
    "location": "Palmenkas"
  },
  {
    "id": 21,
    "time": "**14.00 - 14.05** ",
    "action": "Afronding door de BABS ",
    "who": "De BABS vertelt dat Derek een zegen gaat uitspreken.\nDaarna gaat zij weg.\n",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 22,
    "time": "**14.05 - 14.20** ",
    "action": "Zegen en speeches ",
    "who": "*Er is een microfoon aanwezig en jullie staan op de plek van de BABS.\n\nDerek spreekt een zegen uit.\n\nDaarna vertelt hij wat hierna komt:\n*Bijdragen van de moeder van de bruidegom: Wilma, en de kinderen van Katinka: Fleur en Samuel.\n\n",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 23,
    "time": "**14.20 - 14.25** ",
    "action": "Erehaag met bloemen",
    "who": "Derek komt weer naar voren en vertelt dat: \n*Iedereen moet gaan staan terwijl het bruidspaar naar voren loopt.\n*De mensen aan het gangpad met een bloemenmandje onder hun stoel bloemblaadjes mogen pakken en straks hoog in de lucht mogen werpen als het bruidspaar langsloopt. \n*De gasten vanaf de voorste rijen kunnen gaan feliciteren en gelegenheid tot het geven van hun cadeaus.\n\nCM: Zorgen dat het liedje 'Felicita' aangaat en daarna de rest van de Italiaanse playlist. \n*Zie 'Toon aanvullende context' hieronder voor de Muziek en aanvullende info.\n*Het bruidspaar loopt door de rij naar de ingang van de zaal en blijft naast de deur staan.\n",
    "context": "*De CM hebben vooraf twee stoelen achterin weggehaald om ruimte te creeeren.\n*De mandjes staan onder de stoelen bij het gangpad om en om, dus 4 mandjes per rij, dat zijn in totaal 8 mandjes langs het gehele gangpad. \n\nMuziek bij de erehaag met bloemen\nNB Is het eerste nummer van de Italiaanse playlist, met dit nummer wordt begonnen. Daarna kan de Italiaanse playlist verder gaan:\n\n14.20 - 14.25\n*Felicita\n\n\n\n",
    "location": "Oranjekas"
  },
  {
    "id": 24,
    "time": "**14.25 - 14.45** ",
    "action": "Felicitaties",
    "who": "*De gasten komen vanaf de voorste rijen naar de ingang van de zaal om het bruidspaar te feliciteren en cadeaus te overhandigen. \n*Achter het bruidspaar staat een tafel met een mooi kistje waarin het bruidspaar de enveloppen kan doen en waar andere cadeaus op gelegd kunnen worden.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek en aanvullende info.",
    "context": "Muziek bij de felicitaties:\n\n14.25 - 14.45\n*Na Felicita speelt nu de Italiaanse playlist door\n\n*Derek staat naast het bruidspaar om de cadeaus aan te pakken en het bruidsboeket erbij te leggen (niet in water).\n*Matthew staat bij de ingang van de Palmenkas om de gasten door te geleiden.\n*NB de bloemblaadjes moeten hierna opgeruimd worden, door Wilma en Fleur.\n\n",
    "location": "Oranjekas"
  },
  {
    "id": 25,
    "time": "**14.35 - 14.50** ",
    "action": "Maserati verplaatsen",
    "who": "Matthew: de Maserati naar de zijkant van het gebouw rijden. \nAls je met je rug naar de Oranjerie staat dan rechtsvoor op het terras. \n",
    "context": "",
    "location": "Zijkant Oranjerie"
  },
  {
    "id": 26,
    "time": "**14.45 - 15.00** ",
    "action": "Naar Palmenkas en korte pauze",
    "who": "*Zorgen dat de gasten naar de Palmenkas gaan.\n*Zorgen dat in de Palmenkas de Italiaanse playlist aan gaat. \n*Bruidspaar heeft korte pauze in privéruimte.  \n*Zie 'Toon aanvullende context' hieronder voor de Muziek.\n",
    "context": "Muziek in pauze\nNB dit moet met de tweede telefoon (de andere telefoon is nog met muziek in de Oranjekas):\n\n14.45 - 15.00 \n*Italiaanse playlist aan vanaf 14.45 uur en uit vanaf het moment dat Cor gaat toosten, lied vriendin Katinka en gedicht Lisa. \n\n\n\n \n",
    "location": "Palmenkas/privéruimte"
  },
  {
    "id": 27,
    "time": "**15.00 - 15.30** ",
    "action": "Toost & Bruidstaart ",
    "who": "*Zorgen dat alle gasten in de Palmenkas zijn, dus niet op het terras.\n*Bruidspaar komt aan in Palmenkas.\n*Zorgen dat Fleur en Samuel bij de bruidstaart staan.\n*Gasten in een cirkel om het bruidspaar heen.\n*Derek: vertellen dat na de toost de receptie begint en dat mensen tijdens de receptie worden opgeroepen voor de groepsfoto's: de lijst vinden ze uitgeprint in de Palmenkas en in de app en ze worden in 6 keer meegeroepen per familie/groep. \n*Muziek uit zodra Cor begint met de toost.\nNB Er wordt een microfoon geregeld met boxen voor Cor, Lisa en Roelfien. \n*Zorgen dat de muziek van Roelfien aangaat op haar signaal.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek.\n\n\n",
    "context": "Muziek:\n\n*Muziek uit vanaf moment dat Cor gaat speechen,\n*15.15 muziek van Roelfien, vriendin Katinka (zij levert dit bij Derek aan),\n*Daarna stilte voor gedicht Lisa,\n*Daarna de Italiaanse playlist op repeat.    \n",
    "location": "Palmenkas"
  },
  {
    "id": 28,
    "time": "**15.00 - 17.30** ",
    "action": "Ombouw Oranjekas voor diner",
    "who": "*Tijdens de receptie wordt door Team Oranjerie de Oranjekas in de basis omgebouwd voor het diner. \n*De CM zijn indien nodig beschikbaar voor het geven van aanwijzingen.\n*Wilma en Fleur voegen de decoratie en tafelschikking toe tussen 18.00 - 19.00 als alle gasten weg zijn. \n*Zie pagina 'Bijlage' voor Diner Tafelschikking en Diner Tafeldekking.",
    "context": "",
    "location": "Oranjekas"
  },
  {
    "id": 29,
    "time": "**15.30 - 16.00**  ",
    "action": "Receptie start & groepsfoto's",
    "who": "*CM zorgen dat de Italiaanse playlist aan gaat.\n*CM faciliteren fotograaf om de juiste groepen bij elkaar te krijgen.\n*Zie uitgeprint overzicht van de Groepsfoto's bij het gastenboek op de tekentafel in Palmenkas.\n*Zie 'Toon aanvullende context' hieronder voor het overzicht Groepsfoto's en Muziek.\n*Handig om de mensen per 6 grote groepen mee te nemen:\n1. Familie Prins 2. Familie Mekking 3. Familie Uiterwijk 4. Familie Herlaar 5. Vrienden, Collega's & CM 6. Iedereen\nNB Fleur en Samuel zijn net als het bruidspaar bij alle foto's.",
    "context": "Muziek tijdens receptie en pauze:\n\n15.30 - 19.00 Receptie & pauze (Palmenkas)\n*Italiaanse playlist. \n\nGroepsfoto's \n\n1. Familie Prins & aanhang (en Wilma, Fleur en Samuel)\n*Familie Prins met aanhang \n*Familie Prins klein: Cor, Anca, Sara, Lisa, Jai, Fleur en Samuel  \n*Ouders bruidspaar: Wilma en Cor & Gonnie en Leo (via fotoshop)\n*(Schoon)zussen Lisa, Sara \n*Fleur en Samuel \n\n2. Familie Mekking & aanhang (en Fleur en Samuel)\n*Familie Mekking met aanhang \n*Familie Mekking klein: Opa, Wilma, Rob, Arthur, Lisa, Jai, Fleur en Samuel  \n*Opa Mekking \n\n3. Familie Uiterwijk & aanhang (en Fleur en Samuel)\n*Familie Uiterwijk: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen en Miriam \n*Familie Uiterwijk klein: Fleur, Samuel, Rinske, Emma, Anna, Jet \n*Rinske \n\n4. Familie Herlaar & aanhang (en Fleur en Samuel)\n*Familie Herlaar: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin en Anja \n*Familie Herlaar klein: Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Wil  \n\n5. Vrienden, Collega's & CM\n*Vriendengroep  \n*Collega's \n*Karima en Felix\n*Suzanne en Gijsbert\n*Ceremoniemeesters  \n\n6. Totaal\n*Alle gasten \n\n\n\n \n\n",
    "location": "Palmenkas/Terras"
  },
  {
    "id": 30,
    "time": "**16.00 - 17.30**",
    "action": "Receptie vervolg",
    "who": "  *Zorgen dat de Italiaanse playlist aan blijft.\n*Bruid twee keer even meeroepen zodat zij in de privéruimte iets kan eten/drinken/opfrissen. Dus om 16.00 en om 17.00. \n*Jorik graag ook 1 keer meenemen, zodat het bruidspaar even samen kan zijn in de privéruimte.   ",
    "context": "",
    "location": ""
  },
  {
    "id": 31,
    "time": "**17.15 - 17.20** ",
    "action": "Maserati verplaatsen",
    "who": "Matthew: de Maserati van de zijkant van het gebouw weer naar de haag rijden met de achterkant naar de Oranjerie toe.",
    "context": "",
    "location": "Buiten bij de haag"
  },
  {
    "id": 32,
    "time": "**17.25 - 17.30** ",
    "action": "Aankondiging einde feestelijkheden",
    "who": "Derek: de gasten vertellen dat:\n*De receptie ten einde loopt.  \n*Denken aan toilet, persoonlijke spullen en presentje (ligt bij het gastenboek op de tekentafel in de Palmenkas).\n*Iedereen om 17.35 uur achter het bruidspaar aan loopt naar 'de haag'.\n*Daar het bruidspaar uitzwaaien en de dag ten einde is. \n\n\n\n",
    "context": "",
    "location": ""
  },
  {
    "id": 33,
    "time": "**17.30 - 17.45** ",
    "action": "Einde receptie en uitzwaaien bruidspaar",
    "who": "*Zorgen dat gasten met hun spullen achter het bruidspaar aan lopen. \n*Het bruidspaar loopt via de andere kant.\n*Uitzwaaien bruidspaar bij 'de haag'.\n",
    "context": "",
    "location": "Haag buiten"
  },
  {
    "id": 34,
    "time": "**17.45 - 18.00** ",
    "action": "Vertrek receptiegasten",
    "who": "*Zorgen dat iedereen om 18.00 van het terrein is ivm de fotoshoot van het bruidspaar. \n*Napraten op de parkeerplaats kan natuurlijk wel.\nBelangrijk dat Wilma en Fleur op tijd (uiterlijk 18.00) teruggaan naar de Oranjekas voor de decoratie van de dinertafels.\n",
    "context": "",
    "location": "Haag buiten/parkeerterrein"
  },
  {
    "id": 35,
    "time": "**18.00 - 19.00** ",
    "action": "Eindcontrole dinertafels en pauze ",
    "who": "*CM samen met Wilma en Fleur eindcontrole op dinertafels incl. tafelschikking.\n*Rust voor naaste familie.\n*Zie pagina 'Bijlage' voor Diner Stoelschikking en Diner Tafeldekking.",
    "context": "",
    "location": "Oranjekas/Palmenkas/Terras"
  },
  {
    "id": 36,
    "time": "**18.00 - 18.30**",
    "action": "Bruidspaar pauze en crewmaaltijd fotograaf",
    "who": "Ter info",
    "context": "",
    "location": ""
  },
  {
    "id": 37,
    "time": "**18.30 - 19.00** ",
    "action": "Fotoshoot bruidspaar ",
    "who": "*Bruidspaar is terug op locatie om 18.30 voor fotoshoot.\n*Zetten Maserati zelf bij de zijkant van het gebouw. \n*Familie wacht op hen in de Palmenkas. \n*Zij gaan om 19.00 samen met het bruidspaar naar de Oranjekas. \n",
    "context": "",
    "location": "Palmenkas/Terras"
  },
  {
    "id": 38,
    "time": "**19.00 - 21.00**",
    "action": "Shared dining met naaste familie",
    "who": "Zorgen dat de Italiaanse playlist op staat.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek.",
    "context": "Muziek tijdens diner:\n\n19.00 - 21.00 Diner (Oranjekas)\n*Italiaanse playlist. ",
    "location": "Oranjekas"
  },
  {
    "id": 39,
    "time": "**21.00 - 21.15**",
    "action": "Afscheid en uitzwaaien",
    "who": "Tijd bewaken en zorgen dat dit afscheid om 21.15 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden. ",
    "context": "",
    "location": "Terras"
  },
  {
    "id": 40,
    "time": "**21.15 - 21.45**",
    "action": "Opruimen",
    "who": "*Alles opruimen, met hulp van Team Oranjerie, Fleur, Samuel, Wilma en Wil. \n*Team Oranjerie ruimt hun deel op, jullie ons deel.\n*Zorgen dat alles mee naar huis gaat wat van ons is.\n*Zie 'Toon aanvullende context' hieronder voor info bij Opruimen.   \n*Fleur en Samuel rijden met Cor en Anca/Sara mee naar huis en nemen de eventuele resten van de bruidstaart mee.\n*Opa en Wil rijden mee terug met Wilma en Rob.",
    "context": "Opruimen:\n\n*De locatie is verantwoordelijk voor hun spullen en de CM voor die van ons, \n*Wilma, Wil, Fleur en Samuel helpen ook mee met het opruimen van onze eigen spullen, \nDie moeten ook weer mee terug naar huis, het gaat dan om (afhankelijk van wat we huren): \n*vaasjes met bloemen \n*kandelaren \n*tafelkleden \n*servetten \n*eucalyptus \n*tafelschikking-naambordjes \n*menukaarten \n*naamkaartjes van de ceremoniestoelen \n*mandje voor gastencadeautjes \n*mandjes waarin de rozenblaadjes zaten \n*welkomstborden en bewegwijzering parkeerplaats \n*rest van de bruidstaart mee met Fleur en Samuel \n*schildersezel \n*bankje \n\n ",
    "location": "Palmenkas/Oranjekas/Terras en parkeerterrein"
  }
];

export const cmTasksEN = [
  {
    "id": 1,
    "time": "**9.30 - 11.00** ",
    "action": "Venue setup",
    "who": "*Aanwezig op locatie, alles klaarzetten en controleren. Met hulp van Team Oranjerie. \n*Jullie plannen terplekke een meeting in met Team Oranjerie.\n*Matthew is eerste aanspreekpunt. \n*Decoratie hebben jullie meegekregen van Jorik.\n*Bloemdecoratie volgt om 10.30 van Jorik, daarna graag overal neerzetten.\n*Zie pagina 'Bijlage' voor: Borden Parkeerplaats, Ceremonie Stoelschikking, Diner Stoelschikking en Diner Tafeldekking.",
    "context": "",
    "location": "Palmenkas/Oranjekas/Terras/Tuin en parkeerplaats"
  },
  {
    "id": 2,
    "time": "**9.00 - 9.30** ",
    "action": "The bride and groom at home with family",
    "who": "Ter info",
    "context": "",
    "location": "Thuis in Rijswijk"
  },
  {
    "id": 3,
    "time": "**9.30 - 10.30** ",
    "action": "The bride and groom on their way to the Oranjerie",
    "who": "*De Italiaanse playlist laten spelen in de Palmenkas als \nwelkom voor het bruidspaar. Aan laten totdat jullie met alle gasten richting 'de haag' gaan om 12.45.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek.",
    "context": "Hoe moet de muziek aangeleverd worden? \n\n*Offline bestand. \n*Werktelefoon Katinka op vliegtuigstand. \n*Spotify (Joriks account) ivm geen reclame. \n*Back-up: Katinka's huidige telefoon. \n*Muziek gaat apart in beide zalen. \n*Playlist op repeat. \n* 'Holy Forever' (bij het naar voren lopen van het bruidspaar) wordt los aangeleverd omdat dat liedje ook los aangezet moet worden.\n \nMuziek bij de ontvangst van het bruidspaar en de gasten:\n\n10.30 - 12.45 \n*Italiaanse playlist.   \n\n",
    "location": "Reistijd"
  },
  {
    "id": 4,
    "time": "**10.30 - 11.00**",
    "action": "Arrival of the bride and groom",
    "who": "*Koffie/drinken met lekkers.\n*Het bruidspaar heeft de bloemdecoratie bij zich, die kan nu neergezet worden.\n*Het bruidspaar zet zelf de auto aan de zijkant van het pand.\n*En vertrekt om 11.45 uur naar een rustige plek.",
    "context": "",
    "location": "Palmenkas/Terras/privéruimte"
  },
  {
    "id": 5,
    "time": "**10.45 - 11.00**",
    "action": "Aankomst Wilma/Rob en Wil",
    "who": "*Koffie/drinken met lekkers.\n*Wilma heeft de bruidstaart bij zich.",
    "context": "",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 6,
    "time": "**11.00 - 12.00** ",
    "action": "Final check by Wilma and Fleur",
    "who": "*Wilma en Fleur doen een eindcheck op de decoratie.\nIn principe is alles voor die tijd al klaar.",
    "context": "",
    "location": "Palmenkas/Oranjekas/Terras/Tuin en parkeerplaats"
  },
  {
    "id": 7,
    "time": "**11.30 - 11.45**   ",
    "action": "Bruidspaar vertrekt van de Oranjerie",
    "who": "Het bruidspaar komt om 13.00 uur weer terug.",
    "context": "",
    "location": "Reistijd"
  },
  {
    "id": 8,
    "time": "**12.00 - 12.15**",
    "action": "Arrival of the photographer",
    "who": "Audra: 06 - 27 59 13 63\nZet zelf zijn spullen klaar.",
    "context": "",
    "location": ""
  },
  {
    "id": 9,
    "time": "**12.15 - 12.45** ",
    "action": "Arrival of other guests (68 people)",
    "who": "*Koffie/drinken met lekkers.\n*Derek: gasten welkom heten bij de ingang van de Oranjerie. \n*CM zijn aanspreekpunt voor gasten.\n*In totaal zijn we deze dag met 78 personen, zie bijlage Gastenlijst.\n*Zie 'Toon aanvullende context' hieronder voor de Gastenlijst.",
    "context": "Gastenlijst:\n\n1.\tJorik\n2.\tKatinka\n3.\tFleur\n4.\tSamuel\n5.\tRinske \n6.\tWil\n7.\tEmma\n8.\tJet\n9.\tAnna\n10.\tOpa\n11.\tWilma\n12.\tRob\n13.\tLisa\n14.\tJaikishen\n15.\tArthur\n16.\tCor\n17.\tAnca\n18.\tSara\n19.\tHerman\n20.\tMylene\n21.\tMerian\n22.\tJim\n23.\tLeanne\n24.\tJasper\n25.\tBernhard\n26.\tYvonne\n27.\tRoos\n28.\tDerek\n29.\tMarianne\n30.\tMatthew\n31.\tJoke\n32.\tGerard\n33.\tSander (neef J)\n34.\tIneke\n35.\tNicole\n36.\tWilfred \n37.\tPatricia\n38.\tArjan \n39.\tMike\n40.\tMercedes\n41.\tMaik\n42.\tJustin\n43.\tRik\n44.\tLorena\n45.\tMark\n46.\tSander Uphus\n47.\tLydia\n48.\tChris\n49.\tDesi\n50.\tBas\n51.\tCharlotte\n52.\tTim\n53.\tSanne\n54.\tKarima\n55.\tFelix \n56.\tThalita\n57.\tNaomi\n58.\tRoelfien\n59.\tAda \n60.\tPaul (man van Ada) \n61.\tDara\n62.\tAnne\n63.\tHelian\n64.\tBarbara\n65.\tAnita\n66.\tAnnette\n67.\tNorbert\n68.\tJessica\n69.\tJurjen\n70.\tMiriam \n71.\tMonique\n72.\tSander (neef K)\n73.\tLize\n74.\tErwin\n75.\tAnja\n76.\tRuud\n77.\tSuzanne\n78.\tGijsbert\n",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 10,
    "time": "**12.45 - 13.00** ",
    "action": "Taking guests to 'the hedge'",
    "who": "*Gasten om 12.45 uur leiden naar 'de haag' om het bruidspaar op te wachten.\n*De gasten vormen een haag in 'de haag'. \n*Alle gasten moeten om 12.55 klaar staan. \n*Ervoor zorgen dat Fleur, Samuel en opa (en de naaste familie) vooraan staat in 'de haag' omdat zij het bruidspaar straks ook als eerste volgen.",
    "context": "\n\n",
    "location": "Outside by 'the hedge'"
  },
  {
    "id": 11,
    "time": "**13.00 - 13.10** ",
    "action": "Arrival of the BABS",
    "who": "Matthew: BABS welkom heten en eventuele vragen beantwoorden.",
    "context": "",
    "location": ""
  },
  {
    "id": 12,
    "time": "**13.00 - 13.05** ",
    "action": "Aankomst bruidspaar bij 'de haag'",
    "who": "De auto stopt halverwege.\nJorik laat Katinka uitstappen.",
    "context": "",
    "location": "Outside by 'the hedge'"
  },
  {
    "id": 13,
    "time": "**13.05 - 13.15** ",
    "action": "Stoet naar de Oranjerie",
    "who": "*Het bruidspaar loopt rechtsom.\n*Zorgen dat de gasten achter ons aanlopen. \n*Fleur, Samuel en opa direct achter ons omdat zij naar een aparte ruimte met ons gaan.",
    "context": "",
    "location": "Lopend naar de Oranjerie"
  },
  {
    "id": 14,
    "time": "**13.15 - 13.25** ",
    "action": "Private room and break",
    "who": "*Het bruidspaar, Fleur, Samuel en opa nemen plaats in de privé-ruimte.\n*Vanaf daar lopen zij achterlangs weer naar de ingang van de Oranjerie als alle gasten zitten.",
    "context": "",
    "location": "Privéruimte"
  },
  {
    "id": 15,
    "time": "**13.15 - 13.25** ",
    "action": "Gasten plaatsnemen in de Oranjekas",
    "who": "*Aangeven dat de gasten plaats mogen nemen in de Oranjekas. \n*Zie pagina 'Bijlage' voor de Ceremonie Stoelschikking, de eerste 2 rijen zijn met naambordjes gereserveerd voor hoofdgasten.\n*2 stoelen achter aan de zijkant reserveren voor de CM zodat jullie goed overzicht hebben.",
    "context": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 16,
    "time": "**13.15 - 13.25** ",
    "action": "Welcome by the BABS",
    "who": "De BABS heet iedereen welkom en vertelt de gasten wat van hen verwacht wordt.\n\"Geen foto's tijdens ceremonie en dat alle gasten moeten gaan staan op haar teken.\"",
    "context": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 17,
    "time": "**13.25 - 13.27** ",
    "action": "Procession of Jorik with his grandfather",
    "who": "*Make sure the song 'Holy Forever' plays as soon as Jorik and grandfather are ready at the entrance. \n*Jorik and grandfather walk forward when the music starts. \n*They stand together at the front for a moment, after which grandfather takes his seat in his reserved chair. \n*Jorik waits there standing at the front in the middle with his face towards the front door for Katinka. \n*See 'Show additional context' below for the Music.",
    "context": "Music when the bride and groom walk forward\nNB this is delivered separately, it concerns 1 song that continues playing with Jorik and Katinka:\n\n13.25 - 13.30\n*Holy Forever \nSax Instrumental / Chris Tomlin (cover) / Uriel Vega\n\n",
    "location": "Orange Greenhouse"
  },
  {
    "id": 18,
    "time": "**13.27 - 13.30** ",
    "action": "Procession of Katinka with Fleur and Samuel",
    "who": "*Make sure the song 'Holy Forever' continues playing.  \n*Katinka walks forward with the children, doors behind her close.\n*At the front, the bride and groom come together and the children sit down.\n*The bride and groom remain standing until the music fades.\n*The MC says that everyone should sit down. \n*Make sure the music stops.\n*See 'Show additional context' below for the Music. ",
    "context": "Music when the bride and groom walk forward\nNB this is delivered separately, it concerns 1 song that continues playing with Jorik and Katinka:\n\n13.25 - 13.30\n*Holy Forever \nSax Instrumental / Chris Tomlin (cover) / Uriel Vega\n\n\n\n",
    "location": "Orange Greenhouse"
  },
  {
    "id": 19,
    "time": "**13.30 - 14.00** ",
    "action": "Wedding ceremony",
    "who": "Het ja-woord, de ringen en de geloften.",
    "context": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 20,
    "time": "**13.45 - 14.45** ",
    "action": "Setting up the wedding cake",
    "who": "Door Team Oranjerie wordt ondertussen in de Palmenkas de bruidstaart klaargezet.\nCM: zorgen dat Team Oranjerie weet dat de taart op een ronde, hoge tafel in het midden van de Palmenkas moet komen, met tafelkleed eronder.",
    "context": "",
    "location": "Palm Greenhouse"
  },
  {
    "id": 21,
    "time": "**14.00 - 14.05** ",
    "action": "Afronding door de BABS",
    "who": "De BABS vertelt dat Derek een zegen gaat uitspreken.\nDaarna gaat zij weg.",
    "context": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 22,
    "time": "**14.05 - 14.20** ",
    "action": "Zegen en speeches",
    "who": "Derek spreekt een zegen uit.\n\nDaarna vertelt hij wat hierna komt:\n*Bijdragen van de moeder van de bruidegom: Wilma, en de kinderen van Katinka: Fleur en Samuel.",
    "context": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 23,
    "time": "**14.20 - 14.25** ",
    "action": "Flower arch",
    "who": "Derek comes forward again and explains that:\n*Everyone should stand while the bride and groom walk forward.\n*The people at the aisle with a flower basket under their chair are allowed to grab flower petals and throw them high in the air as the bride and groom walk past.\n*Guests from the front rows can offer congratulations and have the opportunity to give their gifts.\n\nMC: Make sure the song 'Felicita' starts and then the rest of the Italian playlist. \n*See 'Show additional context' below for the Music and additional info.\n*The bride and groom walk through the aisle to the entrance of the hall and remain next to the door.\n",
    "context": "*The MCs have removed two chairs in the back beforehand to create space.\n*The baskets are under the chairs along the aisle, every other chair, so 4 baskets per row, making a total of 8 baskets along the entire aisle. \n\nMusic at the guard of honor with flowers\nNB Is the first song of the Italian playlist, starts with this song. Then the Italian playlist can continue:\n\n14.20 - 14.25\n*Felicita",
    "location": "Orange Greenhouse"
  },
  {
    "id": 24,
    "time": "**14.25 - 14.45** ",
    "action": "Congratulations",
    "who": "*De gasten komen vanaf de voorste rijen naar de ingang van de zaal om het bruidspaar te feliciteren en cadeaus te overhandigen. \n*Achter het bruidspaar staat een tafel met een mooi kistje waarin het bruidspaar de enveloppen kan doen en waar andere cadeaus op gelegd kunnen worden.\n*Zie 'Toon aanvullende context' hieronder voor de Muziek en aanvullende info.",
    "context": "Music during congratulations:\n\n14.25 - 14.45\n*After Felicita the Italian playlist continues playing\n*Derek stands next to the bride and groom to accept the gifts and place the bridal bouquet with them (not in water).\n*Matthew stands at the entrance of the Palm House to guide the guests through.\n*NB the flower petals must be cleaned up afterwards, by Wilma and Fleur.\n\n",
    "location": "Orange Greenhouse"
  },
  {
    "id": 25,
    "time": "**14.35 - 14.50** ",
    "action": "Moving the Maserati",
    "who": "Matthew: de Maserati naar de zijkant van het gebouw rijden.",
    "context": "",
    "location": "Zijkant Oranjerie"
  },
  {
    "id": 26,
    "time": "**14.45 - 15.00** ",
    "action": "To the Palm Greenhouse and short break",
    "who": "*Make sure the guests go to the Palm House.\n*Make sure the Italian playlist starts in the Palm House.\n*Bride and groom have a short break in the private room.\n*See 'Show additional context' below for the Music.\n",
    "context": "Music in break\nNB this must be with the second phone (the other phone is still with music in the Orange Greenhouse):\n\n14.45 - 15.00 \n*Italian playlist on from 14.45 and off from the moment Cor starts to toast, song friend Katinka and poem Lisa.",
    "location": "Palm Greenhouse/Private Area"
  },
  {
    "id": 27,
    "time": "**15.00 - 15.30** ",
    "action": "Toast",
    "who": "*Make sure Roelfien’s music starts on her cue.\n*Preparation for the toast and wedding cake.\n*See 'Show additional context' below for the Music.\n\n",
    "context": "Music:\n\n*Music off from the moment Cor starts speaking,\n*15.15 music of Roelfien, friend of Katinka (she delivers this to Derek),\n*Then silence for Lisa's poem,\n*Then the Italian playlist on repeat.    \n",
    "location": "Palm Greenhouse"
  },
  {
    "id": 28,
    "time": "**15.00 - 17.30** ",
    "action": "Toast & Wedding cake",
    "who": "*Make sure all guests are in the Palm House, not on the terrace.\n*Bride and groom arrive in the Palm House.\n*Make sure Fleur and Samuel are near the wedding cake.\n*Guests in a circle around the bride and groom.\n*Derek: explain that after the toast the reception starts and that people will be called for the group photos during the reception: they will find the list printed in the Palm House and in the app, and they will be called in 6 turns per family/group.\n*Music off as soon as Cor starts the toast.\nNB A microphone with speakers will be arranged for Cor, Lisa and Roelfien.\n*Make sure Roelfien’s music starts on her cue.\n*See 'Show additional context' below for Music.",
    "context": "Music:\n\n*Music off from the moment Cor starts speaking,\n*15.15 music of Roelfien, friend of Katinka (she delivers this to Derek),\n*Then silence for Lisa's poem,\n*Then the Italian playlist on repeat.    ",
    "location": "Orange Greenhouse"
  },
  {
    "id": 29,
    "time": "**15.30 - 16.00**  ",
    "action": "Reception start & group photos",
    "who": "*MC ensure the Italian playlist is turned on.\n*MC facilitate the photographer to get the correct groups together.\n*See printed overview of Group Photos near the guestbook on the drawing table in the Palm House.\n*See 'Show additional context' below for the overview of Group Photos and Music.\n*Useful to call people in 6 large groups:\n1. Prins family 2. Mekking family 3. Uiterwijk family 4. Herlaar family 5. Friends, Colleagues & MC 6. Everyone\nNB Fleur and Samuel, like the bride and groom, are in all photos.",
    "context": "Music during reception and break:\n\n15.30 - 19.00 Reception & break (Palm House)\n*Italian playlist. \n\nGroup photos \n\n1. The Prins family & partners (and Wilma, Fleur, and Samuel)\n*The Prins family with partners \n*The Prins family (small group): Cor, Anca, Sara, Lisa, Jai, Fleur, and Samuel  \n*Parents of the bride and groom: Wilma and Cor & Gonnie and Leo (Leo & Gonnie added via Photoshop) \n*(Sisters-in-law) Lisa, Sara \n*Fleur and Samuel \n\n2. The Mekking family & partners (and Fleur and Samuel)\n*The Mekking family with partners  \n*The Mekking family (small group): Grandpa, Wilma, Rob, Arthur, Lisa, Jai, Fleur, and Samuel  \n*Grandpa Mekking \n\n3. The Uiterwijk family & partners (and Fleur and Samuel)\n*The Uiterwijk family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen, and Miriam \n*The Uiterwijk family (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Rinske \n\n4. The Herlaar family & partners (and Fleur and Samuel)\n*Herlaar family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin, and Anja\n*Familie Herlaar (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet  \n*Wil  \n\n5. Friends, Colleagues & Masters of Ceremony \n*Group of friends \n*Colleagues \n*Karima and Felix\n*Suzanne and Gijsbert\n*Masters of Ceremonies  \n\n6. Total\n*All guests",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 30,
    "time": "**16.00 - 17.30**",
    "action": "Reception continues",
    "who": "  *Ensure that the Italian playlist remains on.\n*Call the bride twice so that she can eat/drink/freshen up in the private room. So at 16.00 and at 17.00. \n*Please also take Jorik once, so that the bride and groom can be together for a moment in the private room.   ",
    "context": "",
    "location": ""
  },
  {
    "id": 31,
    "time": "**17.15 - 17.20** ",
    "action": "Moving the Maserati",
    "who": "Matthew: de Maserati van de zijkant van het gebouw weer naar de haag rijden met de achterkant naar de Oranjerie toe.",
    "context": "",
    "location": "Outside by 'the hedge'"
  },
  {
    "id": 32,
    "time": "**17.25 - 17.30** ",
    "action": "Announcement of the end of the festivities",
    "who": "Derek: de gasten vertellen dat:\n*De receptie ten einde loopt.  \n*Denken aan toilet, persoonlijke spullen en presentje (ligt bij het gastenboek op de tekentafel in de Palmenkas).\n*Iedereen om 17.35 uur achter het bruidspaar aan loopt naar 'de haag'.\n*Daar het bruidspaar uitzwaaien en de dag ten einde is.",
    "context": "",
    "location": ""
  },
  {
    "id": 33,
    "time": "**17.30 - 17.45** ",
    "action": "End of reception and waving off the bride and groom",
    "who": "*Zorgen dat gasten met hun spullen achter het bruidspaar aan lopen. \n*Het bruidspaar loopt via de andere kant.\n*Uitzwaaien bruidspaar bij 'de haag'.",
    "context": "",
    "location": "Hedge outside"
  },
  {
    "id": 34,
    "time": "**17.45 - 18.00** ",
    "action": "Departure of reception guests",
    "who": "*Make sure everyone is off the premises by 18.00 due to the wedding shoot.\n*Talking on the parking lot is allowed.\nImportant that Wilma and Fleur return to the Orange Greenhouse on time (no later than 18.00) for decorating the dinner tables.\n",
    "context": "",
    "location": "Haag buiten/parkeerterrein"
  },
  {
    "id": 35,
    "time": "**18.00 - 19.00** ",
    "action": "Eindcontrole dinertafels en pauze",
    "who": "*CM samen met Wilma en Fleur eindcontrole op dinertafels incl. tafelschikking.\n*Rust voor naaste familie.\n*Zie pagina 'Bijlage' voor Diner Stoelschikking en Diner Tafeldekking.",
    "context": "",
    "location": "Oranjekas/Palmenkas/Terras"
  },
  {
    "id": 36,
    "time": "**18.00 - 18.30**",
    "action": "Break for the bride and groom and crew meal for the photographer",
    "who": "Ter info",
    "context": "",
    "location": ""
  },
  {
    "id": 37,
    "time": "**18.30 - 19.00** ",
    "action": "Fotoshoot bruidspaar",
    "who": "*Bruidspaar is terug op locatie om 18.30 voor fotoshoot.\n*Zetten Maserati zelf bij de zijkant van het gebouw. \n*Familie wacht op hen in de Palmenkas. \n*Zij gaan om 19.00 samen met het bruidspaar naar de Oranjekas.",
    "context": "",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 38,
    "time": "**19.00 - 21.00**",
    "action": "Shared dining with close family",
    "who": "Make sure the Italian playlist is on.\n*See 'Show additional context' below for the Music.",
    "context": "Music during dinner:\n\n19.00 - 21.00 Diner (Oranjekas)\n*Italian playlist. ",
    "location": "Orange Greenhouse"
  },
  {
    "id": 39,
    "time": "**21.00 - 21.15**",
    "action": "Farewells and seeing off",
    "who": "Tijd bewaken en zorgen dat dit afscheid om 21.15 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden.",
    "context": "",
    "location": "Terras"
  },
  {
    "id": 40,
    "time": "**21.15 - 21.45**",
    "action": "Cleanup",
    "who": "*Alles opruimen, met hulp van Team Oranjerie, Fleur, Samuel, Wilma en Wil. \n*Team Oranjerie ruimt hun deel op, jullie ons deel.\n*Zorgen dat alles mee naar huis gaat wat van ons is.\n*Zie 'Toon aanvullende context' hieronder voor info bij Opruimen.   \n*Fleur en Samuel rijden met Cor en Anca/Sara mee naar huis en nemen de eventuele resten van de bruidstaart mee.\n*Opa en Wil rijden mee terug met Wilma en Rob.",
    "context": "Cleaning up:\n\n*The location is responsible for their things and the MC for ours, \n*Wilma, Wil, Fleur and Samuel help clean up our own things, \nThose also need to go back home, it concerns (depending on what we rent): \n*vases with flowers \n*candelabras \n*tablecloths \n*napkins \n*eucalyptus \n*seating arrangements nameplates \n*menus \n*name tags of the ceremony chairs \n*basket for guest gifts \n*baskets in which the rose petals were \n*welcome signs and signage parking lot \n*rest of the wedding cake with Fleur and Samuel \n*easel \n*bench \n\n ",
    "location": "Palmenkas/Oranjekas/Terras en parkeerterrein"
  }
];

export const photographerTasks = [
  {
    "id": 1,
    "time": "**9.30 - 11.00** ",
    "action": "**Setting up the venue**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 2,
    "time": "**9.00 - 9.30** ",
    "action": "**The bride and groom at home with their family**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 3,
    "time": "**9.30 - 10.30** ",
    "action": "**The bride and groom on their way to the Orangery** ",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 4,
    "time": "**10.30 - 11.00**",
    "action": "**Arrival of the bride and groom**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 5,
    "time": "**10.45 - 11.00**",
    "action": "**Arrival of Wilma/Rob and Wil** ",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 6,
    "time": "**11.00 - 12.00** ",
    "action": "**Final check by Wilma and Fleur**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 7,
    "time": "**11.30 - 11.45**   ",
    "action": "**The bride and groom leave the Orangery**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 8,
    "time": "**12.00 - 12.15**",
    "action": "**Arrival of the photographer**",
    "photographer": "*Preparation time.\n*Please inform Team Orangery that you would like your crew meal from 18.00 - 18.30.",
    "context": "**Parking Information\nAddress: Orangery Hydepark Doorn \nDriebergsestraatweg 50 \n3941 ZX Doorn \n \nFrom Utrecht Central Station: 30 minutes by car, 40 minutes by bus, 1 hour by bike. \nWe will reimburse travel expenses. \n\nContact Information\nDerek: 06 - 40 83 03 61\nMatthew: 06 - 45 43 20 39\nAudra: 06 - 27 59 13 63\nLocation Manager: to be announced on the day**   ",
    "location": "Palm House"
  },
  {
    "id": 9,
    "time": "**12.15 - 12.45** ",
    "action": "**Arrival of other guests (68 people)**",
    "photographer": "*A total of 78 guests throughout the day.\n\n",
    "context": "**Important people \n\nPriority (see profile photos)\n*Fleur: daughter \n*Samuel: son \n*Leo and Gonnie: Katinka’s parents, deceased—we’ll photoshop them in later  \n*Wilma: Jorik’s mother \n*Cor: Jorik’s father \n*Grandpa: Jorik’s grandfather \n*Lisa: Jorik’s sister \n*Sara: Jorik’s half-sister \n*Wil: Katinka’s aunt \n*Rob: stepfather \n*Anca: stepmother \n*Arthur: stepbrother \n*Rinske: Katinka’s sister**",
    "location": "Palm House/Terrace "
  },
  {
    "id": 10,
    "time": "**12.45 - 13.00** ",
    "action": "**Escorting guests to ‘the hedge’**",
    "photographer": "Photos of:\n*Guests waiting for the bride and groom at ‘the hedge’,\n*Atmospheric shots. ",
    "context": "",
    "location": "Outside by ‘the hedge’"
  },
  {
    "id": 11,
    "time": "**13.00 - 13.10** ",
    "action": "**Arrival of the civil registrar**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 12,
    "time": "**13.00 - 13.05** ",
    "action": "**Arrival of the bride and groom at ‘the hedge’** ",
    "photographer": "Photos of the arrival at ‘the hedge,’ always with the Orangery in the background:\n*The car from the rear as the bride and groom drive up, \n*The car with guests surrounding it at ‘the hedge,’ \n*Jorik helping Katinka out of the car.\n\n",
    "context": "",
    "location": "Outside by ‘the hedge’"
  },
  {
    "id": 13,
    "time": "**13.05 - 13.15** ",
    "action": "**Procession to the Orangery** ",
    "photographer": "Photos of the procession:\n*Of the bride and groom with the procession behind them as they walk to the Orangery (photos from behind with the Orangery in the background).",
    "context": "",
    "location": "Walking toward the Orangery "
  },
  {
    "id": 14,
    "time": "**13.15 - 13.25** ",
    "action": "**Private room and break**",
    "photographer": "Photos of:\n*Guests in attendance,\n*Close-up shots of the venue or decorations.",
    "context": "",
    "location": "Rest area"
  },
  {
    "id": 15,
    "time": "**13.15 - 13.25** ",
    "action": "**Guests take their seats in the Orange House**  ",
    "photographer": "Photos of:\n*Guests in attendance,\n*Close-up shots of the venue or decorations.",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 16,
    "time": "**13.15 - 13.25** ",
    "action": "**Welcome by the civil registrar**",
    "photographer": "Photos of:\n*Guests in attendance,\n*Close-up shots of the venue or decorations.",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 17,
    "time": "**13.25 - 13.27** ",
    "action": "**Entrance of Jorik with his grandfather**",
    "photographer": "Photos of:\n*Jorik walking to the front with his grandfather,\n*Jorik standing at the front with his grandfather,\n*Jorik standing alone at the front, facing the entrance, waiting for Katinka.",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 18,
    "time": "**13.27 - 13.30** ",
    "action": "**Entrance of Katinka with Fleur and Samuel**",
    "photographer": "Photos of:\n*Katinka walking toward Jorik with the children,\n*Jorik and Katinka meeting at the front and hugging,\n*Jorik and Katinka standing together at the front.",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 19,
    "time": "**13.30 - 14.00** ",
    "action": "**Wedding ceremony**",
    "photographer": "Photos of:\n*Jorik and Katinka during the ceremony,\n*Exchanging wedding vows,\n*Saying “I do,”\n*Sara bringing the rings,\n*Exchanging rings,\n*The kiss,\n*The signing by the bride and groom, the witnesses, and the officiant.\n\n",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 20,
    "time": "**13.45 - 14.45** ",
    "action": "**Setting up the wedding cake**",
    "photographer": "For your information",
    "context": "",
    "location": "Palm House"
  },
  {
    "id": 21,
    "time": "**14.00 - 14.05** ",
    "action": "**Closing remarks by the civil registrar** ",
    "photographer": "For your information",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 22,
    "time": "**14.05 - 14.20** ",
    "action": "**Blessing and speeches**",
    "photographer": "Photos of:\n*Jorik and Katinka during Derek’s blessing, during Wilma’s speech, and during Fleur and Samuel’s speech, \n*Derek, Wilma, Fleur, and Samuel.",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 23,
    "time": "**14.20 - 14.25** ",
    "action": "**Flower arch**",
    "photographer": "Photos of: \n*The bride and groom walking down the aisle while flower petals are thrown into the air. ",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 24,
    "time": "**14.25 - 14.45** ",
    "action": "**Congratulations**",
    "photographer": "Photos of: \n*The guests walking from the front rows to the entrance of the hall to congratulate the bride and groom and present gifts. \n*Mood shots of the congratulatory moment.\n",
    "context": "",
    "location": "Orange House"
  },
  {
    "id": 25,
    "time": "**14.35 - 14.50** ",
    "action": "**Moving the Maserati**",
    "photographer": "For your information",
    "context": "",
    "location": "Side of the Orangery"
  },
  {
    "id": 26,
    "time": "**14.45 - 15.00** ",
    "action": "**To the Palm House and short break**",
    "photographer": "Photos of:\n*Guests in attendance,\n*Close-up shots of the venue or decorations.\n*Bride and groom have a break in the rest area.",
    "context": "",
    "location": "Palm House/Rest area "
  },
  {
    "id": 27,
    "time": "**15.00 - 15.30** ",
    "action": "**Toast & Wedding cake**",
    "photographer": "Photos of:\n*Cutting the cake,\n*Speech by Cor,\n*Song by Roelfien,\n*Poem by Lisa.",
    "context": "",
    "location": "Palm House"
  },
  {
    "id": 28,
    "time": "**15.00 - 17.30** ",
    "action": "**Rearranging the Orange House for dinner**",
    "photographer": "For your information",
    "context": "",
    "location": "Oranje House"
  },
  {
    "id": 29,
    "time": "**15.30 - 16.00**  ",
    "action": "**Reception begins & group photos**",
    "photographer": "Group photos 15.30 - 16.00 \n*30 min\n*Masters of ceremonies will help organize the groups.\n*See ‘Show additional context’ below for the names. \n*During this half-hour, the photographer will take group photos in 6 large groups:\n1. Prins family 2. Mekking family 3. Uiterwijk family 4. Herlaar family 5. Friends, Colleagues & MC 6. Everyone\n",
    "context": "Group photos \n\n1. The Prins family & partners (and Wilma, Fleur, and Samuel)\n*The Prins family with partners \n*The Prins family (small group): Cor, Anca, Sara, Lisa, Jai, Fleur, and Samuel  \n*Parents of the bride and groom: Wilma and Cor & Gonnie and Leo (Leo & Gonnie added via Photoshop) \n*(Sisters-in-law) Lisa, Sara \n*Fleur and Samuel \n\n2. The Mekking family & partners (and Fleur and Samuel)\n*The Mekking family with partners  \n*The Mekking family (small group): Grandpa, Wilma, Rob, Arthur, Lisa, Jai, Fleur, and Samuel  \n*Grandpa Mekking \n\n3. The Uiterwijk family & partners (and Fleur and Samuel)\n*The Uiterwijk family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen, and Miriam \n*The Uiterwijk family (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Rinske \n\n4. The Herlaar family & partners (and Fleur and Samuel)\n*Herlaar family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin, and Anja\n*Familie Herlaar (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet  \n*Wil  \n\n5. Friends, Colleagues & Masters of Ceremony \n*Group of friends \n*Colleagues \n*Karima and Felix\n*Suzanne and Gijsbert\n*Masters of Ceremonies  \n\n6. Total\n*All guests ",
    "location": "Palm House/Terrace "
  },
  {
    "id": 30,
    "time": "**16.00 - 17.30**",
    "action": "**Reception continues**",
    "photographer": "Photos of:\n*Atmosphere \n",
    "context": "",
    "location": "Palm House/Terrace "
  },
  {
    "id": 31,
    "time": "**17.15 - 17.20** ",
    "action": "**Moving the Maserati**",
    "photographer": "For your information",
    "context": "",
    "location": "Outside by ‘the hedge’"
  },
  {
    "id": 32,
    "time": "**17.25 - 17.30** ",
    "action": "**Announcement of the end of the festivities**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 33,
    "time": "**17.30 - 17.45** ",
    "action": "**End of the reception and seeing off the bride and groom**",
    "photographer": "Photos of, always with the Orangery in the background:\n*The bride and groom from the front with the procession behind them and the Orangery in the background,\n*The departure, also from the front of the car so that the Orangery is once again in the background,\n*So both upon arrival (bride and groom from behind, Orangery in the background) and upon departure (bride and groom from the front, Orangery in the background), the Orangery is in the background.\n",
    "context": "",
    "location": "Outside by ‘the hedge’"
  },
  {
    "id": 34,
    "time": "**17.45 - 18.00** ",
    "action": "**Departure of reception guests**",
    "photographer": "Photos of:\n*Guests leaving,\n*Atmosphere.",
    "context": "",
    "location": "Outside by ‘the hedge’/Parking lot"
  },
  {
    "id": 35,
    "time": "**18.00 - 19.00** ",
    "action": "**Final check of dinner tables and break** ",
    "photographer": "For your information",
    "context": "",
    "location": "Oranje House/Palm House/Terrace"
  },
  {
    "id": 36,
    "time": "**18.00 - 18.30**",
    "action": "**Break for the bride and groom and crew meal for the photographer**",
    "photographer": "Crew meal photographer",
    "context": "",
    "location": "Palm House"
  },
  {
    "id": 37,
    "time": "**18.30 - 19.00** ",
    "action": "**Photo shoot with the bride and groom** ",
    "photographer": "Photos of the bride and groom: \n*In ‘the hedge’,\n*Shot from a distance by the fountain with the building as a backdrop,\n*At a slight angle in front of the building,\n*At the entrance,\n*At the entrance with the garden as a backdrop.\n",
    "context": "",
    "location": "Palm House/Terrace"
  },
  {
    "id": 38,
    "time": "**19.00 - 21.00**",
    "action": "**Shared dining with close family**",
    "photographer": "Photos from 19.00 - 19.30:\n*Atmosphere.",
    "context": "",
    "location": "Oranje House"
  },
  {
    "id": 39,
    "time": "**21.00 - 21.15**",
    "action": "**Farewells and seeing off**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  },
  {
    "id": 40,
    "time": "**21.15 - 21.45**",
    "action": "**Cleanup**",
    "photographer": "For your information",
    "context": "",
    "location": ""
  }
];

// ----------------------------------------------------------------------------
// FIREBASE UTILS
// ----------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyDEa155IYwdVmXDzYvPAa63h5-6d5C5aes",
  authDomain: "monochrome-rng.firebaseapp.com",
  databaseURL: "https://monochrome-rng-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monochrome-rng",
  storageBucket: "monochrome-rng.firebasestorage.app",
  messagingSenderId: "304795014359",
  appId: "1:304795014359:web:219a700366a25c9e1c0c92"
};

let firebaseAppPromise: Promise<any> | null = null;

const getFirebaseApp = () => {
  if (!firebaseAppPromise) {
    firebaseAppPromise = (async () => {
      // @ts-ignore
      const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const apps = getApps();
      if (apps.length === 0) {
        return initializeApp(firebaseConfig);
      }
      return getApp();
    })();
  }
  return firebaseAppPromise;
};

// ----------------------------------------------------------------------------
// MAIN APP
// ----------------------------------------------------------------------------

interface SupportTicket {
  id: string;
  name: string;
  category: string;
  message: string;
  timestamp: number;
  status: 'pending' | 'replied';
  reply?: string;
}

const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-extrabold text-[#1A1A2E] dark:text-slate-100">{part}</strong> : part
  );
};

const renderFormattedTime = (text: string) => {
  if (!text) return null;
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-extrabold text-[#c1a96b]">{part}</strong> : part
  );
};

export default function App() {
  const [role, setRole] = useState<'guest'|'cm'|'photographer'>(() => {
    const saved = localStorage.getItem('wedding_role');
    return (saved === 'cm' || saved === 'photographer') ? saved : 'guest';
  });
  const [activeTab, setActiveTab] = useState(() => {
    const savedRole = localStorage.getItem('wedding_role');
    return savedRole === 'photographer' ? 'gasten' : 'overzicht';
  });
  const [pinnedPages, setPinnedPages] = useState<string[]>([]);
  const [expandedScheduleItem, setExpandedScheduleItem] = useState<number | null>(null);
  const [expandedPhotoTask, setExpandedPhotoTask] = useState<number | null>(null);
  const [expandedContexts, setExpandedContexts] = useState<Record<string, boolean>>({});
  const toggleContext = (id: string) => {
    setExpandedContexts(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Real-time Firebase Presence Counter
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [showPresenceHistory, setShowPresenceHistory] = useState(false);

  // --- Support States ---
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Probleem met design / lay-out');
  const [supportActiveTab, setSupportActiveTab] = useState<'create' | 'list'>('create');
  const [selectedSupportTicketId, setSelectedSupportTicketId] = useState<string | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_support_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [hasSupportReply, setHasSupportReply] = useState(() => {
    return localStorage.getItem('wedding_support_reply_unread') === 'true';
  });



  // --- Live Chat & Personal Notes States ---
  const [personalNotes, setPersonalNotes] = useState<{id: string, title: string, content: string}[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [notesSubTab, setNotesSubTab] = useState<'notes' | 'chat'>('notes');
  
  const [chatNickname, setChatNickname] = useState('');
  const [isChatReady, setIsChatReady] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{id: string, username: string, text: string, timestamp: number}[]>([]);
  const [isFirebaseActive, setIsFirebaseActive] = useState(true);
  const serverTimeSkewRef = useRef(0);

  const getNormalizedTime = () => Date.now() + serverTimeSkewRef.current;

  useEffect(() => {
    localStorage.setItem('wedding_role', role);
  }, [role]);

  // Periodic background check to reload the page when a new deployment (version) is active
  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

    const checkUpdates = async () => {
      try {
        // Fetch index.html with a unique cache buster query parameter to bypass CDN/browser cache
        const res = await fetch(`/?cb=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const html = await res.text();
        
        // Parse the fetched HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract script sources
        const newScripts = Array.from(doc.querySelectorAll('script[type="module"]'))
          .map(s => s.getAttribute('src'))
          .filter(Boolean) as string[];
          
        const currentScripts = Array.from(document.querySelectorAll('script[type="module"]'))
          .map(s => s.getAttribute('src'))
          .filter(Boolean) as string[];

        // Check if there is a new bundle script file loaded on the server
        const hasNewScript = newScripts.some(newSrc => 
          newSrc.includes('/assets/') && !currentScripts.includes(newSrc)
        );

        if (hasNewScript && currentScripts.length > 0) {
          console.log('New update detected, forcing page refresh...');
          window.location.reload();
        }
      } catch (err) {
        console.warn('Update check failed:', err);
      }
    };

    // Check immediately on mount, and then every 2 minutes
    checkUpdates();
    const interval = setInterval(checkUpdates, 120000);
    return () => clearInterval(interval);
  }, []);

  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleDismissNotification = (id: string) => {
    if (window.confirm(langEN ? "Are you sure you want to hide this notification?" : "Weet je zeker dat je deze melding wilt verbergen?")) {
      const updated = [...dismissedNotifications, id];
      setDismissedNotifications(updated);
      localStorage.setItem('wedding_dismissed_notifications', JSON.stringify(updated));
    }
  };

  const [dismissedPages, setDismissedPages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_dismissed_pages');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleDismissPage = (pageId: string) => {
    if (window.confirm(langEN ? "Are you sure you want to hide this page?" : "Weet je zeker dat je deze pagina wilt verbergen?")) {
      const updated = [...dismissedPages, pageId];
      setDismissedPages(updated);
      localStorage.setItem('wedding_dismissed_pages', JSON.stringify(updated));
      setActiveTab('overzicht');
    }
  };

  const [isInboxDismissed, setIsInboxDismissed] = useState(() => {
    return localStorage.getItem('wedding_inbox_dismissed') === 'true';
  });

  const handleDismissInbox = () => {
    if (window.confirm(langEN ? "Are you sure you want to completely hide the Inbox feature?" : "Weet je zeker dat je het postvak volledig wilt verbergen?")) {
      setIsInboxDismissed(true);
      localStorage.setItem('wedding_inbox_dismissed', 'true');
      setShowInboxPopup(false);
    }
  };

  const handleResetHidden = () => {
    if (window.confirm(langEN ? "Are you sure you want to restore all hidden pages and notifications?" : "Weet je zeker dat je alle verborgen pagina's en meldingen wilt herstellen?")) {
      setDismissedNotifications([]);
      setDismissedPages([]);
      setIsInboxDismissed(false);
      setReadNotifications([]);
      setHasSupportReply(false);
      setSupportTickets([]);
      localStorage.removeItem('wedding_dismissed_notifications');
      localStorage.removeItem('wedding_dismissed_pages');
      localStorage.removeItem('wedding_inbox_dismissed');
      localStorage.removeItem('wedding_read_notifications');
      localStorage.removeItem('wedding_support_reply_exists');
      localStorage.removeItem('wedding_support_reply_unread');
      localStorage.removeItem('wedding_support_reply_text');
      localStorage.removeItem('wedding_support_tickets');
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportMessage.trim()) return;
    
    setIsSendingSupport(true);
    
    // Create new ticket object
    const ticketId = 'ticket_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    const newTicket: SupportTicket = {
      id: ticketId,
      name: supportName,
      category: supportCategory,
      message: supportMessage,
      timestamp: Date.now(),
      status: 'pending'
    };

    // Save ticket locally first
    const updatedTickets = [newTicket, ...supportTickets];
    setSupportTickets(updatedTickets);
    localStorage.setItem('wedding_support_tickets', JSON.stringify(updatedTickets));

    try {
      // Submit ONLY to Formspree, bypassing Firestore completely
      const response = await fetch('https://formspree.io/f/xvzywpaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ticketId: ticketId,
          name: supportName,
          email: supportEmail.trim() || 'no-reply@example.com',
          category: supportCategory,
          message: supportMessage
        })
      });
      
      if (response.ok) {
        setIsSendingSupport(false);
        setSupportSuccess(true);
        setSupportMessage('');
      } else {
        alert(langEN ? "Something went wrong. Please try again." : "Er is iets misgegaan. Probeer het opnieuw.");
        setIsSendingSupport(false);
      }
    } catch (err) {
      console.error(err);
      alert(langEN ? "Connection error. Please try again." : "Verbindingsfout. Probeer het opnieuw.");
      setIsSendingSupport(false);
    }
  };

  const handleDeleteSupportTicket = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details view
    if (window.confirm(langEN ? "Are you sure you want to delete this support request?" : "Weet je zeker dat je dit hulpverzoek wilt verwijderen?")) {
      const updated = supportTickets.filter(t => t.id !== ticketId);
      setSupportTickets(updated);
      localStorage.setItem('wedding_support_tickets', JSON.stringify(updated));
      if (selectedSupportTicketId === ticketId) {
        setSelectedSupportTicketId(null);
      }
    }
  };

  // Clear unread support reply flag when viewing the replied ticket
  useEffect(() => {
    if (selectedSupportTicketId) {
      const selectedTicket = supportTickets.find(t => t.id === selectedSupportTicketId);
      if (selectedTicket && selectedTicket.status === 'replied') {
        setHasSupportReply(false);
        localStorage.setItem('wedding_support_reply_unread', 'false');
      }
    }
  }, [selectedSupportTicketId, supportTickets]);



  // Load chat nickname and personal notes on mount
  useEffect(() => {
    let savedName = sessionStorage.getItem('wedding_chat_username');
    if (!savedName) {
      savedName = localStorage.getItem('wedding_chat_username');
      if (savedName) {
        sessionStorage.setItem('wedding_chat_username', savedName);
      }
    }
    if (savedName) {
      setChatNickname(savedName);
      setIsChatReady(true);
    }

    const savedNotes = localStorage.getItem('wedding_personal_notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setPersonalNotes(parsed);
        if (parsed.length > 0) {
          setSelectedNoteId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse personal notes", e);
      }
    }
  }, []);

  const handleCreateNote = () => {
    const newNoteObj = {
      id: 'note_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now(),
      title: langEN ? 'New Note' : 'Nieuwe notitie',
      content: ''
    };
    const updated = [newNoteObj, ...personalNotes];
    setPersonalNotes(updated);
    setSelectedNoteId(newNoteObj.id);
    localStorage.setItem('wedding_personal_notes', JSON.stringify(updated));
  };

  const handleUpdateNote = (id: string, field: 'title' | 'content', value: string) => {
    setSaveStatus(langEN ? 'Saving...' : 'Opslaan...');
    const updated = personalNotes.map(note => {
      if (note.id === id) {
        return { ...note, [field]: value };
      }
      return note;
    });
    setPersonalNotes(updated);
    localStorage.setItem('wedding_personal_notes', JSON.stringify(updated));
    setTimeout(() => {
      setSaveStatus(langEN ? 'Saved' : 'Opgeslagen');
    }, 400);
  };

  const handleDeleteNote = (id: string) => {
    const updated = personalNotes.filter(note => note.id !== id);
    setPersonalNotes(updated);
    localStorage.setItem('wedding_personal_notes', JSON.stringify(updated));
    if (updated.length > 0) {
      setSelectedNoteId(updated[0].id);
    } else {
      setSelectedNoteId(null);
    }
  };

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatNickname.trim()) {
      const name = chatNickname.trim();
      setChatNickname(name);
      sessionStorage.setItem('wedding_chat_username', name);
      localStorage.setItem('wedding_chat_username', name);
      setIsChatReady(true);
      scrollToBottom();
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !chatNickname.trim()) return;

    const messageText = chatMessage.trim();
    setChatMessage('');

    const timestampVal = Date.now();
    const messageId = 'msg_' + Math.random().toString(36).substring(2, 11) + '_' + timestampVal;

    try {
      const app = await getFirebaseApp();
      // @ts-ignore
      const { getFirestore, doc, setDoc, updateDoc, arrayUnion } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const db = getFirestore(app);
      const chatDocRef = doc(db, 'matches', 'chat_room');

      const newMessage = {
        id: messageId,
        username: chatNickname,
        text: messageText,
        timestamp: timestampVal
      };

      try {
        await updateDoc(chatDocRef, {
          messages: arrayUnion(newMessage)
        });
      } catch (err) {
        // Document likely does not exist yet, initialize it
        await setDoc(chatDocRef, {
          messages: [newMessage]
        }, { merge: true });
      }

      scrollToBottom();
    } catch (err) {
      console.error('Failed to send chat message:', err);
      // Fallback: show locally
      appendLocalMessage(messageId, chatNickname, messageText, timestampVal);
    }
  };

  const appendLocalMessage = (id: string, username: string, text: string, timestamp: number) => {
    setChatMessages(prev => [...prev, { id, username, text, timestamp }]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const elements = document.querySelectorAll('.chat-messages-container');
      elements.forEach(el => {
        el.scrollTop = el.scrollHeight;
      });
    }, 50);
  };

  const getUsernameColor = (username: string) => {
    const colors = [
      '#FF007F', '#FF5E00', '#FFB700', '#10B981', '#3B82F6', 
      '#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F43F5E',
      '#14B8A6', '#06B6D4', '#84CC16', '#10B981'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleNavClick = (navId: string) => {
    if (navId === 'inbox_temp') {
      setShowInboxPopup(true);
      markInboxAsRead(true);
    } else {
      setActiveTab(navId);
    }
  };

  // Real-time Firebase Presence Counter useEffect
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let heartbeatInterval: any = null;
    let localEvalInterval: any = null;
    let fallbackInterval: any = null;
    let deleteDocFn: any = null;
    let userDocRef: any = null;
    let latestDocs: any[] = [];

    // Generate unique session ID for this tab instance (avoids sessionStorage tab-sharing bugs)
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();

    const firebaseConfig = {
      apiKey: "AIzaSyDEa155IYwdVmXDzYvPAa63h5-6d5C5aes",
      authDomain: "monochrome-rng.firebaseapp.com",
      databaseURL: "https://monochrome-rng-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "monochrome-rng",
      storageBucket: "monochrome-rng.firebasestorage.app",
      messagingSenderId: "304795014359",
      appId: "1:304795014359:web:219a700366a25c9e1c0c92"
    };

    // Estimate server time skew to handle client clock drift
    const estimateSkew = async () => {
      try {
        const start = Date.now();
        const response = await fetch(window.location.href, { method: 'HEAD' });
        const latency = (Date.now() - start) / 2;
        const serverDateStr = response.headers.get('date');
        if (serverDateStr) {
          const serverTime = new Date(serverDateStr).getTime();
          // Adjust for roundtrip latency
          serverTimeSkewRef.current = (serverTime + latency) - Date.now();
          console.log('Estimated server time skew (ms):', serverTimeSkewRef.current);
        }
      } catch (e) {
        console.warn('Failed to estimate server time skew, using local time:', e);
      }
    };

    // Simulated presence counter fallback (e.g. 1 to 4 users online)
    const runSimulatedPresence = () => {
      console.log('Firebase presence unavailable. Starting simulated presence fallback.');
      setIsFirebaseActive(false);

      if (localEvalInterval) {
        clearInterval(localEvalInterval);
        localEvalInterval = null;
      }
      if (unsubscribe) {
        try { unsubscribe(); } catch (e) {}
        unsubscribe = null;
      }

      const getSimulatedCount = () => {
        const hour = new Date().getHours();
        const base = (hour >= 8 && hour <= 23) ? 3 : 1;
        const randomOffset = Math.floor(Math.random() * 2); // 0 or 1
        return base + randomOffset;
      };
      setActiveUsersCount(getSimulatedCount());

      if (fallbackInterval) clearInterval(fallbackInterval);
      fallbackInterval = setInterval(() => {
        setActiveUsersCount(getSimulatedCount());
      }, 45000);
    };

    // Helper to evaluate active users from latest doc snapshot
    const evaluateActiveUsers = () => {
      const now = getNormalizedTime();
      let activeCount = 0;

      latestDocs.forEach((docData) => {
        // Active if heartbeat was within the last 45 seconds
        if (docData.lastActive && (now - docData.lastActive < 45000)) {
          activeCount++;
        }
      });

      // Show total active users (at least 1, which represents the current tab)
      setActiveUsersCount(Math.max(1, activeCount));
    };

    const initFirebasePresence = async () => {
      try {
        await estimateSkew();

        const app = await getFirebaseApp();
        // @ts-ignore
        const { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, query, where } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

        deleteDocFn = deleteDoc;
        const db = getFirestore(app);
        const presenceCollectionRef = collection(db, 'matches');
        userDocRef = doc(db, 'matches', `presence_${sessionId}`);

        const sendHeartbeat = async () => {
          try {
            await setDoc(userDocRef, {
              lastActive: getNormalizedTime()
            }, { merge: true });
          } catch (err) {
            console.error('Presence heartbeat write failed:', err);
            runSimulatedPresence();
          }
        };

        await sendHeartbeat();
        heartbeatInterval = setInterval(sendHeartbeat, 15000); // heartbeat every 15s

        // Fetch documents active in the last 1 hour to keep snapshots small
        const presenceQuery = query(
          presenceCollectionRef,
          where('lastActive', '>', getNormalizedTime() - 3600000)
        );

        // Listen for live database updates
        unsubscribe = onSnapshot(presenceQuery, (snapshot) => {
          const docsList: any[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            if (d.id.startsWith('presence_') && data && data.lastActive) {
              docsList.push({ id: d.id, lastActive: data.lastActive });
            }
          });
          latestDocs = docsList;
          evaluateActiveUsers();
        }, (error) => {
          console.error('Presence firestore subscription error, falling back:', error);
          runSimulatedPresence();
        });

        // Evaluate active count locally every 10 seconds to account for aging timestamps
        localEvalInterval = setInterval(evaluateActiveUsers, 10000);

      } catch (error) {
        console.error('Failed to initialize Firebase real-time presence:', error);
        runSimulatedPresence();
      }
    };

    initFirebasePresence();

    const handleUnload = () => {
      if (deleteDocFn && userDocRef) {
        try {
          deleteDocFn(userDocRef);
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      if (unsubscribe) unsubscribe();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (localEvalInterval) clearInterval(localEvalInterval);
      if (fallbackInterval) clearInterval(fallbackInterval);
      handleUnload();
    };
  }, [isFirebaseActive]);

  // Live Chat subscription — Firestore Single Document Room
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initFirestoreChat = async () => {
      try {
        const app = await getFirebaseApp();
        // @ts-ignore
        const { getFirestore, doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
        const db = getFirestore(app);
        const chatDocRef = doc(db, 'matches', 'chat_room');

        unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && Array.isArray(data.messages)) {
              // Filter out messages older than 5 hours on client-side
              const fiveHoursAgo = Date.now() - 5 * 3600 * 1000;
              const recentMessages = data.messages
                .filter((msg: any) => msg && msg.timestamp > fiveHoursAgo)
                .sort((a: any, b: any) => a.timestamp - b.timestamp);

              setChatMessages(recentMessages);
              scrollToBottom();
            }
          }
        }, (err) => {
          console.error('Firestore chat listen error:', err);
        });
      } catch (e) {
        console.error('Failed to init Firestore chat:', e);
      }
    };

    initFirestoreChat();

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);
  
  // Settings Popup
  const [settingsCode, setSettingsCode] = useState('');
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [isFullscreenMoodboard, setIsFullscreenMoodboard] = useState(false);
  const [selectedBijlageImage, setSelectedBijlageImage] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggleDarkTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  // Inbox state
  const [showInboxPopup, setShowInboxPopup] = useState(false);
  const [inboxRead, setInboxRead] = useState(() => {
    return localStorage.getItem('wedding_inbox_read') === 'true';
  });

  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const markAllAsRead = () => {
    const unreadIds = ['photo_priority', 'cm_maserati', 'guest_parking'];
    const newRead = Array.from(new Set([...readNotifications, ...unreadIds]));
    setReadNotifications(newRead);
    localStorage.setItem('wedding_read_notifications', JSON.stringify(newRead));
    markInboxAsRead(true);
    
    // Clear support reply unread state when inbox is opened
    setHasSupportReply(false);
    localStorage.setItem('wedding_support_reply_unread', 'false');
  };

  const markInboxAsRead = (val: boolean) => {
    setInboxRead(val);
    localStorage.setItem('wedding_inbox_read', val ? 'true' : 'false');
  };

  const langEN = role === 'photographer';
  
  const scheduleData = langEN ? scheduleEN : scheduleNL;
  const cmTasksData = langEN ? cmTasksEN : cmTasksNL;
  // Programma States
  const [progSearch, setProgSearch] = useState('');
  const [progFilter, setProgFilter] = useState('All');

  // Photographer Guest Directory States
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('Priority');

  const getFloorPlanImage = () => {
    if (role === 'photographer') return '/plattegrond_fotograaf.webp';
    if (role === 'cm') return '/plattegrond_cm.webp';
    return '/plattegrond_gasten.webp';
  };

  const guestDirectoryData = [
    { 
      id: 3, 
      firstName: "Fleur", 
      relationship: langEN ? "Daughter of Jorik & Katinka" : "Dochter van Jorik & Katinka", 
      group: "Priority", 
      initials: "F", 
      photo: "/jpegs/J&K - Daugther Fleur.jpg" 
    },
    { 
      id: 4, 
      firstName: "Samuel", 
      relationship: langEN ? "Son of Jorik & Katinka" : "Zoon van Jorik & Katinka", 
      group: "Priority", 
      initials: "S", 
      photo: "/jpegs/J&K - Son Samuel.jpg" 
    },
    { 
      id: 5, 
      firstName: "Leo and Gonnie", 
      relationship: langEN ? "Father and mother of Katinka (deceased)" : "Vader en moeder van Katinka (overleden)", 
      group: "Priority", 
      initials: "L&G", 
      photo: "/jpegs/Katinka - Elders Leo & Gonnie.jpg", 
      note: langEN 
        ? "Note for photographer: we want to be photographed holding their photo" 
        : "Notitie voor fotograaf: we willen gefotografeerd worden terwijl we hun foto vasthouden" 
    },
    { 
      id: 6, 
      firstName: "Wilma", 
      relationship: langEN ? "Mother of Jorik" : "Moeder van Jorik", 
      group: "Priority", 
      initials: "W", 
      photo: "/jpegs/Jorik - Mother Wilma.jpg" 
    },
    { 
      id: 7, 
      firstName: "Cor", 
      relationship: langEN ? "Father of Jorik" : "Vader van Jorik", 
      group: "Priority", 
      initials: "C", 
      photo: "/jpegs/Jorik - Father Cornelis.jpg" 
    },
    { 
      id: 8, 
      firstName: "Grandpa", 
      relationship: langEN ? "Grandfather of Jorik" : "Opa van Jorik", 
      group: "Priority", 
      initials: "G", 
      photo: "/jpegs/Jorik - Grandpa.jpg" 
    },
    { 
      id: 9, 
      firstName: "Lisa", 
      relationship: langEN ? "Sister of Jorik" : "Zus van Jorik", 
      group: "Priority", 
      initials: "L", 
      photo: "/jpegs/Jorik - Sister Lisa.jpg" 
    },
    { 
      id: 11, 
      firstName: "Sara", 
      relationship: langEN ? "Sister of Jorik" : "Zus van Jorik", 
      group: "Priority", 
      initials: "S", 
      photo: "/jpegs/Jorik - Sister Sara.jpg" 
    },
    { 
      id: 15, 
      firstName: "Rinske", 
      relationship: langEN ? "Sister of Katinka" : "Zus van Katinka", 
      group: "Priority", 
      initials: "R", 
      photo: "/jpegs/Katinka - Sister Rinske.jpg" 
    },
    { 
      id: 12, 
      firstName: "Rob", 
      relationship: langEN ? "Stepfather of Jorik" : "Stiefvader van Jorik", 
      group: "Priority", 
      initials: "R", 
      photo: "/jpegs/Jorik - Step father Rob.jpg" 
    },
    { 
      id: 13, 
      firstName: "Anca", 
      relationship: langEN ? "Stepmother of Jorik" : "Stiefmoeder van Jorik", 
      group: "Priority", 
      initials: "A", 
      photo: "/jpegs/Jorik - Step mother Anca.jpg" 
    },
    { 
      id: 10, 
      firstName: "Wil", 
      relationship: langEN ? "Aunt of Katinka" : "Tante van Katinka", 
      group: "Priority", 
      initials: "W", 
      photo: "/jpegs/Katinka - Aunt Wil.jpg" 
    },
    { 
      id: 1, 
      firstName: "Matthew", 
      relationship: langEN ? "Master of ceremony" : "Ceremoniemeester", 
      group: "Master of ceremony", 
      initials: "M", 
      photo: "/jpegs/Jorik - Cousin Matthew.jpg", 
      mobile: "06-45 43 20 39", 
      note: langEN ? "Cousin of Jorik" : "Neef van Jorik" 
    },
    { 
      id: 2, 
      firstName: "Derek", 
      relationship: langEN ? "Master of ceremony" : "Ceremoniemeester", 
      group: "Master of ceremony", 
      initials: "D", 
      photo: "/jpegs/Jorik - Cousin Derek.jpg", 
      mobile: "06-30 13 12 83", 
      note: langEN ? "Cousin of Jorik" : "Neef van Jorik" 
    }
  ];

  const filteredGuests = guestDirectoryData.filter(g => {
    const matchesSearch = g.firstName.toLowerCase().includes(guestSearch.toLowerCase()) || 
                          g.relationship.toLowerCase().includes(guestSearch.toLowerCase());
    const matchesFilter = guestFilter === 'All' || g.group === guestFilter;
    return matchesSearch && matchesFilter;
  });
  
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsCode === 'Meester') {
      setRole('cm');
      setIsSettingsExpanded(false);
      setSettingsCode('');
      // Note: We don't need to add a message to chat since we removed local chat
    } else if (settingsCode === 'Audra2026') {
      setRole('photographer');
      setIsSettingsExpanded(false);
      setSettingsCode('');
      setActiveTab('gasten');
    } else {
      alert(langEN ? "Invalid code." : "Ongeldige code.");
      setSettingsCode('');
    }
  };

  const activeNote = personalNotes.find(note => note.id === selectedNoteId);

  const pages = [
    { id: 'overzicht', icon: <Info size={20}/>, label: langEN ? 'Home' : 'Startpagina' },
    ...((role === 'photographer' || role === 'cm') ? [] : [{ id: 'programma', icon: <Calendar size={20}/>, label: langEN ? 'Schedule' : 'Programma' }]),
    { id: 'locatie', icon: <MapPin size={20}/>, label: langEN ? 'Parking Location' : 'Parkeerlocatie' },
    { id: 'plattegrond', icon: <MapIcon size={20}/>, label: langEN ? 'Map' : 'Plattegrond' },

    { id: 'extra', icon: <Zap size={20}/>, label: 'Extra' }
  ];

  if (role === 'cm' || role === 'photographer') {
    pages.splice(3, 0, { id: 'cm', icon: <Filter size={20}/>, label: langEN ? 'Photographer Tasks' : 'CM Takenlijst' });
  }

  if (role === 'cm') {
    pages.splice(4, 0, { id: 'bijlage', icon: <FileText size={20}/>, label: 'Bijlage' });
    pages.splice(5, 0, { id: 'groepsfotos', icon: <Camera size={20}/>, label: 'Groepsfoto’s' });
  }

  if (role === 'photographer') {
    pages.splice(4, 0, { id: 'group_photos', icon: <Camera size={20}/>, label: 'Group photos' });
    pages.splice(5, 0, { id: 'moodboard', icon: <Image size={20}/>, label: 'Moodboard' });
    pages.splice(6, 0, { id: 'gasten', icon: <Camera size={20}/>, label: langEN ? 'Guests' : 'Fotolijst' });
  }

  if (role === 'guest') {
    pages.splice(4, 0, { id: 'groepsfotos', icon: <Camera size={20}/>, label: 'Groepsfoto’s' });
  }

  if (isFloatingChatOpen) {
    pages.push({ id: 'inbox_temp', icon: <Mail size={20}/>, label: langEN ? 'Inbox' : 'Postvak IN' });
  }



  // Sort by pinned
  const sortedPages = [...pages]
    .filter(p => !dismissedPages.includes(p.id))
    .sort((a, b) => {
    if (a.id === 'inbox_temp') return 1;
    if (b.id === 'inbox_temp') return -1;

    const aPinned = pinnedPages.includes(a.id);
    const bPinned = pinnedPages.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F5F0E6] dark:bg-slate-950 text-[#1A1A2E] dark:text-slate-100 font-sans flex flex-col md:flex-row shadow-2xl overflow-hidden relative">
      
      {/* Sidebar */}
      <header className="md:w-72 lg:w-80 shrink-0 bg-[#F5F0E6] dark:bg-slate-950 md:bg-white dark:bg-slate-900 md:border-r border-[#1A1A2E]/10 dark:border-white/10 z-20 flex flex-col pt-16 md:pt-10 pb-6 px-6 md:p-8 relative">
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden absolute top-4 left-4 p-2 text-[#1A1A2E] dark:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="text-center md:text-left mb-6 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1A1A2E] dark:text-slate-100 font-bold mb-2 break-words">
            <span className="md:hidden">Jorik & Katinka</span>
            <span className="hidden md:block">Jorik &<br/>Katinka</span>
          </h1>
          <p className="text-xs lg:text-sm uppercase tracking-widest text-[#c7b272] font-semibold leading-relaxed">
            {langEN ? 'June 14, 2026' : '14 juni 2026'} <br/> Oranjerie Hydepark
          </p>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-col gap-2 flex-1">
          {sortedPages.map(nav => {
            const isSpecial = nav.id === 'cm' || nav.id === 'gasten';
            const isSelected = activeTab === nav.id;
            return (
              <div key={nav.id} className="relative group">
                <button
                  onClick={() => handleNavClick(nav.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[#1A1A2E] dark:bg-slate-800 text-white shadow-lg translate-x-2' 
                      : isSpecial 
                        ? 'border border-[#c7b272]/30 bg-[#c7b272]/5 text-[#c7b272] dark:text-[#ebd197] hover:bg-[#c7b272]/15' 
                        : 'hover:bg-[#F5F0E6] dark:bg-slate-950 text-[#666666] dark:text-slate-400 hover:text-[#1A1A2E] dark:text-slate-100'
                  }`}
                >
                  <div className={`${isSelected ? 'text-[#c7b272]' : ''}`}>{nav.icon}</div>
                  <div className="flex-1 text-left flex items-center justify-between min-w-0">
                    <span className="truncate">{nav.label}</span>
                    {isSpecial && (
                      <span className="border border-[#c7b272]/40 bg-gradient-to-r from-[#c7b272]/25 to-[#c7b272]/5 text-[#1A1A2E] dark:text-[#ebd197] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 ml-2 shadow-sm shrink-0">
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c7b272] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c7b272]"></span>
                        </span>
                        {langEN ? 'For You' : 'Voor jou'}
                      </span>
                    )}
                    {nav.id === 'inbox_temp' && role === 'cm' && !inboxRead && (
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 shadow-sm border border-white dark:border-slate-900 mr-2"></span>
                    )}
                  </div>
                  {isSelected && <ChevronRight size={16} className="opacity-50 shrink-0" />}
                </button>
                {nav.id !== 'inbox_temp' && (
                  <button 
                    onClick={(e) => togglePin(nav.id, e)}
                    className={`absolute right-[-10px] top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity ${pinnedPages.includes(nav.id) ? 'opacity-100 text-[#c7b272]' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100 text-[#666666] dark:text-slate-400'}`}
                  >
                    {pinnedPages.includes(nav.id) ? <Pin size={14} className="fill-current" /> : <Pin size={14} />}
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-[#1A1A2E]/10 dark:border-white/10 hidden md:flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-semibold text-[#1A1A2E] dark:text-slate-400">{langEN ? 'Theme' : 'Thema'}</span>
            <button 
              onClick={toggleDarkTheme}
              className="w-12 h-6 bg-[#1A1A2E] dark:bg-[#c7b272] rounded-full relative transition-colors duration-300 shadow-inner"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDark ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <button 
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)} 
            className="flex items-center justify-between px-4 py-2 text-sm text-[#666666] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 transition-colors font-medium w-full"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              {langEN ? 'Login' : 'Login'}
            </div>
            <ChevronRight size={16} className={`transition-transform ${isSettingsExpanded ? 'rotate-90' : ''}`} />
          </button>
          <AnimatePresence>
            {isSettingsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-4"
              >
                {role === 'guest' ? (
                  <div className="flex flex-col gap-2">
                    <form onSubmit={handleCodeSubmit} className="flex gap-2 pt-2 pb-2">
                      <input 
                        type="password" 
                        value={settingsCode}
                        onChange={(e) => setSettingsCode(e.target.value)}
                        placeholder={langEN ? 'Access Code' : 'Toegangscode'}
                        className="flex-1 min-w-0 border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/50 dark:bg-slate-900 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all"
                      />
                      <button 
                        type="submit" 
                        className="bg-[#c7b272] hover:bg-[#b8a15f] text-white rounded-xl w-10 shrink-0 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                        aria-label="Submit code"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                    <button
                      onClick={handleResetHidden}
                      className="w-full bg-transparent text-gray-500 dark:text-slate-400 hover:text-red-500 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-gray-300 dark:border-slate-800 hover:border-red-500/30 mb-2"
                    >
                      <RotateCcw size={12} />
                      {langEN ? 'Reset Hidden Items' : 'Herstel verborgen items'}
                    </button>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[#c7b272] hover:text-[#b8a15f] transition-colors cursor-pointer flex items-center justify-center gap-1.5 py-1"
                    >
                      <Info size={12} />
                      {langEN ? 'Help & Support' : 'Hulp & Support'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-2 pb-4">
                    <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/20 border border-[#c7b272]/20 rounded-xl p-3.5 flex flex-col gap-1.5 items-center text-center">
                      <span className="text-[10px] uppercase tracking-widest text-[#c7b272] font-bold">
                        {langEN ? 'Active Access' : 'Actieve Toegang'}
                      </span>
                      <span className="font-serif font-bold text-[#1A1A2E] dark:text-slate-100 text-sm">
                        {role === 'cm' 
                          ? (langEN ? 'Ceremony Master' : 'Ceremoniemeester') 
                          : (langEN ? 'Photographer' : 'Fotograaf')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setRole('guest');
                        setActiveTab('overzicht');
                        setIsSettingsExpanded(false);
                      }}
                      className="w-full bg-[#1A1A2E] dark:bg-slate-800 hover:bg-[#c7b272] dark:hover:bg-[#c7b272] text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      {langEN ? 'Log Out' : 'Uitloggen'}
                    </button>
                    <button
                      onClick={handleResetHidden}
                      className="w-full bg-transparent text-gray-500 dark:text-slate-400 hover:text-red-500 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-gray-300 dark:border-slate-800 hover:border-red-500/30"
                    >
                      <RotateCcw size={12} />
                      {langEN ? 'Reset Hidden Items' : 'Herstel verborgen items'}
                    </button>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[#c7b272] hover:text-[#b8a15f] transition-colors cursor-pointer flex items-center justify-center gap-1.5 py-1"
                    >
                      <Info size={12} />
                      {langEN ? 'Help & Support' : 'Hulp & Support'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Active Presence Counter */}
          <div 
            onClick={() => setShowPresenceHistory(true)}
            className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500 font-sans tracking-wide px-4 mt-2 cursor-pointer hover:underline"
            title={langEN ? "View activity history" : "Bekijk activiteit geschiedenis"}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c7b272] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c7b272]"></span>
            </span>
            <span>
              {activeUsersCount <= 1 ? (
                langEN ? '1 person online' : '1 persoon online'
              ) : (
                langEN 
                  ? `${activeUsersCount} people online` 
                  : `${activeUsersCount} mensen online`
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#F5F0E6] dark:bg-slate-950 md:bg-white dark:bg-slate-900 relative z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* TAB: OVERZICHT */}
          {activeTab === 'overzicht' && (
            <motion.div key="overzicht" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-3xl mx-auto mt-2">
                <div className="flex justify-end md:hidden mb-4">
                  <button onClick={(e) => togglePin('overzicht', e)} className="flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                    {pinnedPages.includes('overzicht') ? <><PinOff size={14}/> Unpin</> : <><Pin size={14}/> Pin Pagina</>}
                  </button>
                </div>

                <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm mb-10 border border-[#1A1A2E]/5 dark:border-white/5">
                  <img 
                    src="/cover_foto.webp" 
                    alt="Oranjerie Hydepark" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       target.parentElement?.classList.add('bg-[#1A1A2E]/5', 'dark:bg-white/5', 'flex', 'items-center', 'justify-center');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 via-[#1A1A2E]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3">
                       {langEN ? 'Welcome' : 'Welkom'}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base font-medium tracking-widest uppercase">
                      {langEN ? 'June 14, 2026 • Oranjerie Hydepark' : '14 juni 2026 • Oranjerie Hydepark'}
                    </p>
                  </div>
                </div>

                <div className="text-center max-w-xl mx-auto mb-12 px-4">
                  <Heart className="mx-auto text-[#c7b272] mb-6 opacity-60" size={28}/>
                  <p className="text-[#1A1A2E] dark:text-slate-300 text-lg md:text-xl leading-relaxed italic font-serif whitespace-pre-line">
                    {langEN 
                      ? "How nice that you are viewing the information page of our wedding day! View the program and find more useful information. We look forward to celebrating our wedding day together!\n\nGreetings, Jorik & Katinka"
                      : "Wat leuk dat je de informatiepagina van onze trouwdag bekijkt! Bekijk het programma en vind meer nuttige informatie. We verheugen ons erop om samen onze trouwdag te vieren!\n\nGroet, Jorik & Katinka"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                  <button 
                    onClick={() => setActiveTab((role === 'photographer' || role === 'cm') ? 'cm' : 'programma')} 
                    className="bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:py-10"
                  >
                    <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="text-[#c7b272]" size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-[#1A1A2E] dark:text-slate-100 text-lg md:text-xl mb-1">
                      {role === 'photographer' 
                        ? (langEN ? 'Photographer Tasks' : 'Fotograaf taken') 
                        : role === 'cm' 
                          ? (langEN ? 'Tasks' : 'Takenlijst') 
                          : (langEN ? 'Schedule' : 'Programma')}
                    </h3>
                    <p className="text-xs md:text-sm text-[#666666] dark:text-slate-400">
                      {role === 'photographer' || role === 'cm'
                        ? (langEN ? 'View tasks and timeline' : 'Bekijk taken en draaiboek')
                        : (langEN ? 'View the timeline' : 'Bekijk de hele dag')}
                    </p>
                  </button>
                  <button onClick={() => setActiveTab('locatie')} className="bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:py-10">
                    <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><MapPin className="text-[#c7b272]" size={24} /></div>
                    <h3 className="font-serif font-bold text-[#1A1A2E] dark:text-slate-100 text-lg md:text-xl mb-1">{langEN ? 'Parking' : 'Parkeren'}</h3>
                    <p className="text-xs md:text-sm text-[#666666] dark:text-slate-400">{langEN ? 'Location & info' : 'Locatie & info'}</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PROGRAMMA */}
          {activeTab === 'programma' && (
            <motion.div key="programma" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100">{langEN ? 'Schedule' : 'Programma'}</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('programma', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('programma') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 font-medium bg-[#c7b272]/5 dark:bg-[#c7b272]/10 px-4 py-3 rounded-2xl border border-[#c7b272]/10 flex items-center gap-2.5">
                  <Info size={16} className="text-[#c7b272] shrink-0" />
                  <span>{langEN ? 'Tip: Tap "Show additional context" for extra details' : 'Tip: Tik op "Toon aanvullende context" voor extra details'}</span>
                </p>

                <div className="space-y-0 relative">
                  {scheduleData.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative py-6 border-b border-[#1A1A2E]/5 dark:border-white/5 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/20 -mx-6 px-6 rounded-2xl"
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                        <div className="text-[#c1a96b] font-semibold text-sm md:text-base tracking-widest shrink-0 w-32 font-mono">
                          {renderFormattedTime(item.time)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl md:text-2xl font-medium text-[#1A1A2E] dark:text-slate-100">
                            {renderFormattedText(item.title)}
                          </h3>
                          
                          {item.location && (
                            <div className="flex items-center text-xs text-[#666666] dark:text-slate-400 font-medium tracking-wide mt-1.5 gap-1">
                              <MapPin size={12} className="text-[#c7b272] shrink-0" />
                              <span>{renderFormattedText(item.location)}</span>
                            </div>
                          )}

                          {item.desc && (
                            <p className="mt-3 text-sm text-[#666666] dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                              {renderFormattedText(item.desc)}
                            </p>
                          )}

                          {item.context && (
                            <div className="mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleContext(`guest-${item.id}`);
                                }}
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-[#c7b272]/10 hover:bg-[#c7b272]/20 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer"
                              >
                                <ChevronDown size={14} className={`transition-transform duration-300 ${expandedContexts[`guest-${item.id}`] ? 'rotate-180' : ''}`} />
                                {langEN ? 'Show additional context' : 'Toon aanvullende context'}
                              </button>
                              
                              <AnimatePresence>
                                {expandedContexts[`guest-${item.id}`] && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-3 bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                      {renderFormattedText(item.context)}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: LOCATIE */}
          {activeTab === 'locatie' && (
            <motion.div key="locatie" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4 gap-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100">{langEN ? 'Parking Location' : 'Parkeerlocatie'}</h2>
                    <p className="text-[#666666] dark:text-slate-400 mt-3 flex items-center gap-2 font-medium">
                      <MapPin size={16} className="text-[#c7b272]" /> Driebergsestraatweg 50, 3941 ZX Doorn
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('locatie', e)} className="md:hidden w-fit flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('locatie') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden h-[400px] md:h-[500px]">
                  <iframe 
                    src="https://maps.google.com/maps?q=Driebergsestraatweg%2050,%203941%20ZX%20Doorn&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PLATTEGROND */}
          {activeTab === 'plattegrond' && (
            <motion.div key="plattegrond" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100">{langEN ? 'Map' : 'Plattegrond'}</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsFullscreenMap(true)} className="flex items-center gap-2 text-xs font-bold text-[#1A1A2E] dark:text-slate-100 bg-[#c7b272]/20 hover:bg-[#c7b272] hover:text-white dark:bg-[#c7b272]/20 dark:hover:bg-[#c7b272] px-4 py-2 rounded-full transition-colors duration-300">
                      <Maximize size={14}/> <span className="hidden md:inline">{langEN ? 'Fullscreen' : 'Volledig scherm'}</span>
                    </button>
                    <button onClick={(e) => togglePin('plattegrond', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('plattegrond') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden h-[400px] md:h-[600px] relative group cursor-pointer" onClick={() => setIsFullscreenMap(true)}>
                  <div className="absolute inset-0 bg-[#1A1A2E]/0 group-hover:bg-[#1A1A2E]/10 transition-colors z-10 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-md text-[#1A1A2E] px-6 py-3 rounded-full font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                      <Maximize size={16} className="text-[#c7b272]"/> {langEN ? 'Click to Enlarge' : 'Klik om te vergroten'}
                    </div>
                  </div>
                  <img 
                    src={getFloorPlanImage()} 
                    alt="Plattegrond" 
                    className="w-full h-full object-contain bg-[#F5F0E6]/50 dark:bg-slate-950/50" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: CM TAKEN */}
          {activeTab === 'cm' && (
            <motion.div key="cm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-4">
                    {role === 'photographer' ? 'Photographer Tasks' : (langEN ? 'Tasks' : 'Takenlijst')} 
                    <span className="bg-[#c7b272]/10 text-[#c7b272] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#c7b272]/20 translate-y-1">
                      {langEN ? 'For You' : 'Voor jou'}
                    </span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('cm', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('cm') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                {role === 'photographer' ? (
                  /* PHOTOGRAPHER PROGRAM (SCHEDULE STYLE, ALWAYS EXPANDED) */
                  <div className="space-y-0 relative">
                    {photographerTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="group relative py-6 border-b border-[#1A1A2E]/5 dark:border-white/5 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/20 -mx-6 px-6 rounded-2xl"
                      >
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                          <div className="text-[#c1a96b] font-semibold text-sm md:text-base tracking-widest shrink-0 w-32 font-mono">
                            {renderFormattedTime(task.time)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-xl md:text-2xl font-medium text-[#1A1A2E] dark:text-slate-100">
                              {renderFormattedText(task.action)}
                            </h3>
                            
                            {task.location && (
                              <div className="flex items-center text-xs text-[#666666] dark:text-slate-400 font-medium tracking-wide mt-1.5 gap-1">
                                <MapPin size={12} className="text-[#c7b272] shrink-0" />
                                <span>{renderFormattedText(task.location)}</span>
                              </div>
                            )}

                            {task.photographer && (
                              <p className="mt-3 text-sm text-[#666666] dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                                {renderFormattedText(task.photographer)}
                              </p>
                            )}

                            {task.context && (
                              <div className="mt-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleContext(`photo-${task.id}`);
                                  }}
                                  className="inline-flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-[#c7b272]/10 hover:bg-[#c7b272]/20 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer"
                                >
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${expandedContexts[`photo-${task.id}`] ? 'rotate-180' : ''}`} />
                                  {langEN ? 'Show additional context' : 'Toon aanvullende context'}
                                </button>
                                
                                <AnimatePresence>
                                  {expandedContexts[`photo-${task.id}`] && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-3 bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                        {renderFormattedText(task.context)}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* CM TAKENLIST (SCHEDULE STYLE, ALWAYS EXPANDED) */
                  <div className="space-y-0 relative">
                    {cmTasksData.filter(task => !!task.who?.trim()).map(task => {
                      // Extract roles based on mentions in text
                      const fullText = (task.action + ' ' + task.who + ' ' + (task.context || '')).toLowerCase();
                      const roles: string[] = [];
                      if (fullText.includes('cm') || fullText.includes('ceremoniemeester')) roles.push('CM');
                      if (fullText.includes('jorik') || fullText.includes(' j ')) roles.push('J');
                      if (fullText.includes('katinka') || fullText.includes(' k ')) roles.push('K');
                      if (fullText.includes('fleur') || fullText.includes('samuel') || fullText.includes('f/s')) roles.push('F/S');
                      if (fullText.includes('wilma') || fullText.includes(' w ')) roles.push('W');
                      if (roles.length === 0) roles.push('CM');

                      return (
                        <div 
                          key={task.id} 
                          className="group relative py-6 border-b border-[#1A1A2E]/5 dark:border-white/5 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/20 -mx-6 px-6 rounded-2xl"
                        >
                          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                            <div className="text-[#c1a96b] font-semibold text-sm md:text-base tracking-widest shrink-0 w-32 font-mono">
                              {renderFormattedTime(task.time)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-serif text-xl md:text-2xl font-medium text-[#1A1A2E] dark:text-slate-100">
                                {renderFormattedText(task.action)}
                              </h3>
                              
                              {task.location && (
                                <div className="flex items-center text-xs text-[#666666] dark:text-slate-400 font-medium tracking-wide mt-1.5 gap-1">
                                  <MapPin size={12} className="text-[#c7b272] shrink-0" />
                                  <span>{renderFormattedText(task.location)}</span>
                                </div>
                              )}

                              {task.who && (
                                <p className="mt-3 text-sm text-[#666666] dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                                  {renderFormattedText(task.who)}
                                </p>
                              )}

                              {task.context && (
                                <div className="mt-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleContext(`cm-${task.id}`);
                                    }}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-[#c7b272]/10 hover:bg-[#c7b272]/20 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer"
                                  >
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${expandedContexts[`cm-${task.id}`] ? 'rotate-180' : ''}`} />
                                    {langEN ? 'Show additional context' : 'Toon aanvullende context'}
                                  </button>
                                  
                                  <AnimatePresence>
                                    {expandedContexts[`cm-${task.id}`] && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-3 bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                          {renderFormattedText(task.context)}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}

                              <div className="mt-4 flex flex-wrap gap-1.5 justify-end">
                                {roles.map((p, idx) => {
                                  let bgClass = "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200";
                                  if (p === 'CM') bgClass = "bg-[#1A1A2E] dark:bg-slate-800 text-white";
                                  else if (p === 'J' || p === 'K') bgClass = "bg-[#c7b272] text-white";
                                  else if (p === 'F/S') bgClass = "bg-[#E2725B] text-white";
                                  if (p === 'W') bgClass = "bg-[#8A9A5B] text-white";
                                  
                                  return (
                                    <span key={idx} className={`${bgClass} px-3 py-1 rounded-full text-xs font-bold`}>{p}</span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: MOODBOARD */}
          {activeTab === 'moodboard' && role === 'photographer' && (
            <motion.div 
              key="moodboard" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                      <Image className="text-[#c7b272]" size={32} />
                      Moodboard
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-2">
                      {langEN 
                        ? 'Visual inspiration and style guidelines for the wedding photography.' 
                        : 'Visuele inspiratie en stijlrichtlijnen voor de bruidsfotografie.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsFullscreenMoodboard(true)} className="flex items-center gap-2 text-xs font-bold text-[#1A1A2E] dark:text-slate-100 bg-[#c7b272]/20 hover:bg-[#c7b272] hover:text-white dark:bg-[#c7b272]/20 dark:hover:bg-[#c7b272] px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer">
                      <Maximize size={14}/> <span className="hidden md:inline">{langEN ? 'Fullscreen' : 'Volledig scherm'}</span>
                    </button>
                    <button onClick={(e) => togglePin('moodboard', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('moodboard') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden flex flex-col items-center group cursor-pointer" onClick={() => setIsFullscreenMoodboard(true)}>
                  <div className="w-full relative rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30">
                    <div className="absolute inset-0 bg-[#1A1A2E]/0 group-hover:bg-[#1A1A2E]/10 transition-colors z-10 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-md text-[#1A1A2E] px-6 py-3 rounded-full font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                        <Maximize size={16} className="text-[#c7b272]"/> {langEN ? 'Click to Enlarge' : 'Klik om te vergroten'}
                      </div>
                    </div>
                    <img 
                      src="/moodboard.webp" 
                      alt="Wedding Moodboard" 
                      className="w-full h-auto object-contain max-h-[80vh] mx-auto rounded-2xl"
                      loading="lazy"
                      onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: BIJLAGE */}
          {activeTab === 'bijlage' && role === 'cm' && (
            <motion.div 
              key="bijlage" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                      <FileText className="text-[#c7b272]" size={32} />
                      Bijlage
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('bijlage', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('bijlage') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { title: langEN ? "Signs Layout" : "Borden opstelling", src: "/plaatsing_borden.webp" },
                    { title: langEN ? "Ceremony Seating" : "Ceremonie stoelschikking", src: "/ceremonie_stoelschikking.webp" },
                    { title: langEN ? "Dinner Seating" : "Diner stoelschikking", src: "/diner_stoelschikking.webp" },
                    { title: langEN ? "Table Setting Setup" : "Tafeldekking opzet", src: "/tafeldekking_opzet.webp" }
                  ].map((bijlage, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedBijlageImage(bijlage.src)}
                      className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-all duration-300"
                    >
                      <h3 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-100 px-2">
                        {bijlage.title}
                      </h3>
                      <div className="w-full relative rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30 aspect-[4/3] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#1A1A2E]/0 group-hover:bg-[#1A1A2E]/10 transition-colors z-10 flex items-center justify-center">
                          <div className="bg-white/95 backdrop-blur-md text-[#1A1A2E] px-5 py-2.5 rounded-full text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-1.5">
                            <Maximize size={12} className="text-[#c7b272]"/> {langEN ? "Click to Enlarge" : "Klik om te vergroten"}
                          </div>
                        </div>
                        <img 
                          src={bijlage.src} 
                          alt={bijlage.title} 
                          className="w-full h-full object-cover rounded-2xl"
                          loading="lazy"
                          onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checklists Section */}
                <div className="mt-12 pt-8 border-t border-[#1A1A2E]/10 dark:border-white/10 space-y-8">
                  <div className="bg-[#c7b272]/5 dark:bg-[#c7b272]/10 px-5 py-4 rounded-[2rem] border border-[#c7b272]/10 flex items-center gap-3">
                    <Info size={18} className="text-[#c7b272] shrink-0" />
                    <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-slate-200">
                      De locatie is verantwoordelijk voor hun spullen en de CM voor die van ons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Checklist 1: Decoratie pakket */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 space-y-4">
                      <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#c7b272] rounded-full"></span>
                        {langEN ? "Decoration package" : "Decoratie pakket"}
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "1x bankje",
                          "20x eucalyptus tak ong 50 cm",
                          "14 gouden kandelaren",
                          "14 dinerkaars wit",
                          "4x Tafellinnen zand 230×140 cm",
                          "20x zand servetten",
                          "20x vaasjes"
                        ].map((text, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                            <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                            <span className="flex-1">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checklist 2: Privé pakket */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 space-y-4">
                      <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#c7b272] rounded-full"></span>
                        {langEN ? "Private package" : "Privé pakket"}
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "tafelschikking-naambordjes",
                          "20x menukaarten",
                          "20x naamkaartjes ceremonie",
                          "20x naamkaartjes diner",
                          "1x mandje voor gastencadeautjes",
                          "8x mandjes waarin de rozenblaadjes zaten",
                          "8-9x welkomstborden en bewegwijzering parkeerplaats",
                          "1x rest van de bruidstaart mee met Fleur en Samuel",
                          "1x schildersezel",
                          "1x roze kaarshouder met waxinelichtje",
                          "1x fotolijstje met Leo & Gonnie",
                          "1x ecru tafelkleed met lichte stippeltjes"
                        ].map((text, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                            <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                            <span className="flex-1">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checklist 3: Venue Setup / Opbouw locatie */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 space-y-6">
                      <h3 className="font-serif text-2xl font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#c7b272] rounded-full"></span>
                        {langEN ? "Venue Setup" : "Opbouw locatie"}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Column 1 */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Parking Lot" : "Parkeerplaats"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "See 'Bijlage' page." : "Zie pagina 'Bijlage'."}</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Entrance" : "Entree"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "easel with welcome sign on it" : "schildersezel met welkomstbord erop"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "if there are ashtrays, remove them from the entrance and from the corner where the Maserati will be parked - relocate to the other side of the building" : "asbakken indien ze daar staan, weghalen bij entree en ook niet bij de hoek waar de Maserati komt te staan - verplaatsen naar de andere kant van het gebouw"}</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Palm House" : "Palmenkas"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "vases with flowers on the tables" : "op de tafels vaasjes met bloemen"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "prepare one of the venue's vases with water for the bridal bouquet" : "een van de vazen van de locatie klaarzetten met water voor het bruidsboeket"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "ensure the Orangery knows that the cake goes on a high, round table in the middle of the Palm House, with a white tablecloth underneath" : "ervoor zorgen dat de Oranjerie weet dat de taart op een hoge, ronde tafel in het midden van de Palmenkas moet komen te staan, met een wit tafelkleed eronder"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "high, round table with a basket on it (Fleur and Wilma put the gifts for guests in it), the guestbook with pen and printed program, and group photo overview print" : "hoge, ronde tafel met een mandje erop (Fleur en Wilma doen in dat mandje de presentjes voor de gasten), het gastenboek met pen en uitgeprint programma en print van overzicht groepsfoto's"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "layout the printed drinks package overview" : "drankarrangement uitgeprint neerleggen"}</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Grounds and Terrace" : "Terrein en terras"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "ask the venue to clear cigarette butts, trash, and left glasses from the entire area" : "aan locatie vragen om van het hele terrein peuken/afval/achtergebleven glazen etc te verwijderen"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "check if the grounds were left tidy after the previous day's wedding" : "is het netjes achtergelaten na de bruiloft van de dag ervoor?"}</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Orange House Ceremony" : "Oranjekas ceremonie"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "place name cards for reserved seating (see 'Bijlage' page)" : "namen neerleggen ivm gereserveerde plekken (zie pagina 'Bijlage')"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "reserve two chairs (further back at the sides) for the CM for overview" : "twee stoelen reserveren (meer aan de zijkanten achteraan) voor de CM zodat jullie overzicht hebben"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "remove two chairs at the back aisle to make room for the congratulations line later" : "twee stoelen bij het gangpad achter alvast weghalen om ruimte te maken voor de felicitatierij straks"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "place a low table in the Orange House, immediately to the right after the entrance (right next to the door – the couple will stand there for congratulations after the ceremony)" : "lage tafel neerzetten in de Oranjekas, direct na de ingang rechts (direct naast de deur – het bruidspaar gaat daar na de ceremonie voor de felicitaties staan)"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "place the card box and space for other gifts on it" : "daarop het kistje voor de cadeaus en ruimte voor andere cadeaus"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "leave this table during dinner (creates atmosphere)" : "deze tafel laten staan tijdens het diner (staat sfeervol)"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "place a basket of flower petals under the first chairs along the aisle (alternating, 4 per row, 8 total; flowers arrive at 10:30)" : "aan het gangpad om en om een mandje met bloemblaadjes neerzetten onder de eerste stoel. Per rijen 4 mandjes, dus 8 mandjes totaal (bloemen volgen om 10.30)"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "our bench is placed diagonally on the left" : "ons bankje staat links schuin"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "high, round table at the front (near the BABS lectern) for signing" : "hoge, ronde tafel vooraan (vlakbij de spreekstoel voor de BABS) voor het ondertekenen"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "place a photo of Katinka's parents, a flower vase, and the tealight holder on it" : "daarop een foto van de ouders van Katinka, vaasje met bloemen en de houder met waxinelichtje"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "note: in case of bad weather, the dark green double doors can remain open for the view, while the glass doors stay closed" : "nb bij slecht weer kunnen de donkergroene voorzet-deuren open in de Oranjekas voor het zicht, de glazen deuren blijven dan dicht"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "in nice weather, both the dark green double doors and the glass doors will be open" : "bij mooi weer gaan zowel de donkergroene voorzet-deuren als de glazen deuren open"}</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Restrooms" : "Toiletruimte"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "check for sufficient toilet paper/hand towels" : "zijn er voldoende toiletpapier/handdoekjes"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "check cleanliness" : "is het schoon"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "check occasionally throughout the day" : "ook tijdens de dag af en toe controleren"}</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "report to the manager if action is needed" : "doorgeven aan manager als er iets gedaan moet worden"}</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1A1A2E] dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 mb-3">
                              {langEN ? "Private Room" : "Privéruimte"}
                            </h4>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300 font-medium">
                                <input type="checkbox" className="w-4 h-4 accent-[#c7b272] mt-0.5" />
                                <span>{langEN ? "ensure the door from the private room to the restroom is open, and also the door leading outside from there" : "zorgen dat de deur van de privéruimte naar het toilet open is en ook de deur die vanaf daar naar buiten gaat"}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GROUP PHOTOS (PHOTOGRAPHER) */}
          {activeTab === 'group_photos' && role === 'photographer' && (
            <motion.div 
              key="group_photos" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                      <Camera className="text-[#c7b272]" size={32} />
                      Group photos
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-2">
                      Structured checklist to seamlessly manage the group photo queue.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('group_photos', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('group_photos') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden p-6 md:p-8 space-y-6">
                  {/* Group 1 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">1</span>
                      The Prins family & partners (and Wilma, Fleur, and Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Prins family with partners</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Prins family (small group): Cor, Anca, Sara, Lisa, Jai, Fleur, and Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Parents of the bride and groom: Wilma and Cor & Gonnie and Leo (Leo & Gonnie added via Photoshop)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>(Sisters-in-law) Lisa, Sara</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Fleur and Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Jorik, Lisa & Cor</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Katinka, Fleur and Samuel</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 2 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">2</span>
                      The Mekking family & partners (and Fleur and Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Mekking family with partners</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Mekking family (small group): Grandpa, Wilma, Rob, Arthur, Lisa, Jai, Fleur, and Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Grandpa Mekking</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Jorik, Lisa & Wilma</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 3 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">3</span>
                      The Uiterwijk family & partners (and Fleur and Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Uiterwijk family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen, and Miriam</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>The Uiterwijk family (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Rinske</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 4 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">4</span>
                      The Herlaar family & partners (and Fleur and Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Herlaar family: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin, and Anja</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Familie Herlaar (small group): Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Wil</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 5 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">5</span>
                      Friends, Colleagues & Masters of Ceremony
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Group of friends</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Colleagues</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Karima and Felix</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Suzanne and Gijsbert</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Masters of Ceremonies</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 6 */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">6</span>
                      Total
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>All guests</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GROEPSFOTO'S (GUEST / CM) */}
          {activeTab === 'groepsfotos' && (role === 'guest' || role === 'cm') && (
            <motion.div 
              key="groepsfotos" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                      <Camera className="text-[#c7b272]" size={32} />
                      Groepsfoto’s
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-2">
                      Handig overzicht zodat bruiloftsgasten hun beurt in de gaten kunnen houden.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('groepsfotos', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('groepsfotos') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden p-6 md:p-8 space-y-6">
                  {/* Group 1 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">1</span>
                      De familie Prins & aanhang (en Wilma, Fleur en Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Prins met aanhang</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Prins klein: Cor, Anca, Sara, Lisa, Jai, Fleur en Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Ouders bruidspaar: Wilma en Cor & Gonnie en Leo (via fotoshop)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>(Schoon)zussen Lisa, Sara</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Fleur en Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Jorik, Lisa & Cor</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Katinka, Fleur en Samuel</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 2 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">2</span>
                      De familie Mekking & aanhang (en Fleur en Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Mekking met aanhang</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Mekking klein: Opa, Wilma, Rob, Arthur, Lisa, Jai, Fleur en Samuel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Opa Mekking</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Jorik, Lisa & Wilma</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 3 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">3</span>
                      De familie Uiterwijk & aanhang (en Fleur en Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Uiterwijk: Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert, Jessica, Jurjen en Miriam</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Uiterwijk klein: Fleur, Samuel, Rinske, Emma, Anna, Jet</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Rinske</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 4 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">4</span>
                      De familie Herlaar & aanhang (en Fleur en Samuel)
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Herlaar: Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Ruud, Monique, Sander, Erwin en Anja</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>De familie Herlaar klein: Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Wil</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 5 */}
                  <div className="border-b border-[#1A1A2E]/5 dark:border-white/5 pb-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">5</span>
                      Vrienden, Collega's & CM
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Vriendengroep</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Collega's</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Karima en Felix</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Suzanne en Gijsbert</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Ceremoniemeesters</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group 6 */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1A2E] dark:text-slate-100 mb-4 flex items-center gap-3">
                      <span className="text-sm font-mono text-[#c7b272] bg-[#c7b272]/10 px-2.5 py-1 rounded-md">6</span>
                      Totaal
                    </h3>
                    <ul className="pl-6 space-y-3.5 text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-[#c7b272]" />
                        <span>Alle gasten</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GUEST DIRECTORY (FOTOLIJST) */}
          {activeTab === 'gasten' && role === 'photographer' && (
            <motion.div 
              key="gasten" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end border-b border-[#1A1A2E]/10 dark:border-white/10 pb-6 mb-8 mt-4">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                      <Camera className="text-[#c7b272]" size={32} />
                      {langEN ? 'Guest Directory' : 'Fotolijst'}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-2">
                      {langEN 
                        ? 'Quick reference list for groups, names, and relationships to bride & groom.' 
                        : 'Snel overzicht van groepen, namen en relatie tot het bruidspaar.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('gasten', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('gasten') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4 mb-8">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder={langEN ? 'Search guests by name or relationship...' : 'Zoek gasten op naam of relatie...'}
                      className="w-full bg-white dark:bg-slate-900 border border-[#1A1A2E]/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-sm shadow-sm transition-all"
                    />
                    {guestSearch && (
                      <button 
                        onClick={() => setGuestSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A2E] dark:hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {['Priority', 'Master of ceremony'].map((cat) => {
                      const labelMap: Record<string, string> = {
                        'Priority': langEN ? 'Priority' : 'Prioriteit',
                        'Master of ceremony': langEN ? 'Master of ceremony' : 'Ceremoniemeester'
                      };
                      const isActive = guestFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setGuestFilter(cat)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                            isActive 
                              ? 'bg-[#1A1A2E] border-[#1A1A2E] text-white dark:bg-slate-800 dark:border-slate-700 shadow-md' 
                              : 'bg-white border-[#1A1A2E]/10 text-[#666666] hover:bg-gray-50 hover:text-[#1A1A2E] dark:bg-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-slate-800'
                          }`}
                        >
                          {labelMap[cat]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Directory Grid */}
                {filteredGuests.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {filteredGuests.map((guest) => (
                      <div 
                        key={guest.id}
                        className="bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-3.5 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2.5 sm:gap-4 group font-sans"
                      >
                         {/* Profile Picture Frame */}
                        <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-full bg-gradient-to-tr from-[#1A1A2E] via-[#c7b272]/30 to-[#c7b272] p-[1.5px] shadow-sm group-hover:rotate-6 transition-transform duration-300">
                          <div className="w-full h-full rounded-full bg-[#F5F0E6] dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
                            <span className="absolute text-[#1A1A2E] dark:text-[#c7b272] font-serif font-bold text-xl sm:text-3xl select-none">
                              {guest.initials}
                            </span>
                            {guest.photo && (
                              <img 
                                src={guest.photo} 
                                alt={guest.firstName} 
                                className="w-full h-full object-cover absolute inset-0 z-10"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          {/* Fine luxury gold ring overlay details */}
                          <div className="absolute inset-0.5 rounded-full border border-white/40 dark:border-slate-800/40 pointer-events-none"></div>
                        </div>

                        {/* Guest Text Details */}
                        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                          <h3 className="font-serif font-semibold text-sm sm:text-lg md:text-xl text-[#1A1A2E] dark:text-slate-100 truncate w-full">
                            {guest.firstName}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-[#666666] dark:text-slate-400 italic mt-0.5 leading-snug truncate w-full">
                            {guest.relationship}
                          </p>
                          {guest.mobile && (
                            <p className="text-[10px] sm:text-[11px] text-[#c7b272] font-semibold font-mono mt-1 truncate w-full">
                              {guest.mobile}
                            </p>
                          )}
                          {guest.note && (
                            <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-snug line-clamp-1 sm:line-clamp-2 w-full">
                              {guest.note}
                            </p>
                          )}
                          <span className="inline-block mt-2 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#c7b272] bg-[#c7b272]/10 px-1.5 py-0.5 sm:px-2 rounded">
                            {guest.group === 'Priority' ? (langEN ? 'Priority' : 'Prioriteit') :
                             guest.group === 'Master of ceremony' ? (langEN ? 'Master of ceremony' : 'Ceremoniemeester') :
                             guest.group === 'General' ? (langEN ? 'General' : 'Algemeen') : guest.group}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] border border-[#1A1A2E]/5 dark:border-white/5 p-8 shadow-sm">
                    <p className="text-gray-500 dark:text-slate-400 font-medium">
                      {langEN ? 'No guests found matching your search.' : 'Geen gasten gevonden die voldoen aan de zoekopdracht.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: EXTRA */}
          {activeTab === 'extra' && (
            <motion.div key="extra" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 overflow-y-auto p-6 md:p-12 pb-32 md:pb-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <LiveClock langEN={langEN} />
                    <h2 className="font-serif text-3xl md:text-5xl font-bold">{langEN ? 'Extra' : 'Extra'}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => togglePin('extra', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('extra') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                  {/* Countdown */}
                  <div className="col-span-1 md:col-span-2 bg-[#1A1A2E] dark:bg-slate-900 p-8 md:p-14 rounded-[2.5rem] shadow-sm border border-[#1A1A2E]/5 dark:border-white/5 text-center text-white relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c7b272] via-transparent to-transparent"></div>
                    <div className="mb-6 relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 text-[#c7b272]">
                      <Heart size={28} className="animate-pulse" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-medium mb-12 relative z-10 opacity-90 tracking-wide">
                      {langEN ? 'Counting down the days' : 'Aftellen naar de grote dag'}
                    </h3>
                    <div className="relative z-10 w-full max-w-2xl mx-auto">
                      <CountdownWidget langEN={langEN} />
                    </div>
                  </div>

                  {/* Weather */}
                  <div className="col-span-1 bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-14 h-14 bg-[#F5F0E6] dark:bg-slate-950 rounded-2xl text-[#c7b272]">
                          <Sun size={26} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100">
                            {langEN ? 'Weather Forecast' : 'Weersverwachting'}
                          </h3>
                          <p className="text-xs tracking-widest uppercase text-[#c7b272] font-semibold mt-1">Doorn, NL</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <WeatherWidget langEN={langEN} />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-span-1 bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center justify-center w-14 h-14 bg-[#F5F0E6] dark:bg-slate-950 rounded-2xl text-[#c7b272]">
                         <MessageSquare size={26} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100">
                          {langEN ? 'Personal Notes' : 'Persoonlijke Notities'}
                        </h3>
                        <p className="text-xs tracking-widest uppercase text-[#c7b272] font-semibold mt-1">
                          {langEN ? 'Your digital notebook' : 'Jouw digitale notitieboekje'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <NotesWidget langEN={langEN} />
                    </div>
                  </div>

                  {/* Live Chat */}
                  <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row md:items-center gap-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center justify-center w-14 h-14 bg-[#F5F0E6] dark:bg-slate-950 rounded-2xl text-[#c7b272] shrink-0">
                        <MessageSquare size={26} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100">Live Chat</h3>
                        <p className="text-xs tracking-widest uppercase text-[#c7b272] font-semibold mt-1">
                          {langEN ? 'Chat live with all guests' : 'Chat live met alle gasten'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-3 md:items-end">
                      <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed md:text-right">
                        {langEN 
                          ? 'Open the live chat to talk with other guests in real time. Messages reset every 5 hours.'
                          : 'Open de live chat om real-time te praten met andere gasten. Berichten resetten elke 5 uur.'}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap md:justify-end">
                        {chatMessages.length > 0 && (
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                            {chatMessages.length} {langEN ? 'message(s)' : 'bericht(en)'}
                          </span>
                        )}
                        <button
                          onClick={() => { setIsFloatingChatOpen(true); scrollToBottom(); }}
                          className="bg-[#1A1A2E] dark:bg-slate-800 hover:bg-[#c7b272] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <MessageSquare size={14} />
                          {langEN ? 'Open Chat' : 'Chat openen'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}



        </AnimatePresence>
      </main>
      
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1A1A2E]/60 dark:bg-slate-950/90 z-[100] md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="absolute top-0 bottom-0 left-0 w-3/4 max-w-sm bg-[#F5F0E6] dark:bg-slate-950 shadow-2xl flex flex-col pt-16 px-6 pb-6 border-r border-[#1A1A2E]/10 dark:border-white/10 overflow-y-auto will-change-transform"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-4 right-4 p-2 text-[#1A1A2E] dark:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-[#1A1A2E] dark:text-slate-100 font-bold mb-1">
                  Jorik & Katinka
                </h2>
                <p className="text-xs uppercase tracking-widest text-[#c7b272] font-semibold">
                  {langEN ? 'June 14, 2026' : '14 juni 2026'}
                </p>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {sortedPages.map(nav => {
                  const isSpecial = nav.id === 'cm' || nav.id === 'gasten';
                  const isSelected = activeTab === nav.id;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => {
                        handleNavClick(nav.id);
                        if (nav.id !== 'inbox_temp') setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#1A1A2E] dark:bg-slate-800 text-white shadow-md' 
                          : isSpecial 
                            ? 'border border-[#c7b272]/30 bg-[#c7b272]/5 text-[#c7b272] dark:text-[#ebd197]' 
                            : 'hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 text-[#666666] dark:text-slate-400'
                      }`}
                    >
                      <div className={`${isSelected ? 'text-[#c7b272]' : ''}`}>{nav.icon}</div>
                      <div className="flex-1 text-left flex items-center justify-between text-sm min-w-0">
                        <span className="truncate">{nav.label}</span>
                        {isSpecial && (
                          <span className="border border-[#c7b272]/40 bg-gradient-to-r from-[#c7b272]/25 to-[#c7b272]/5 text-[#1A1A2E] dark:text-[#ebd197] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shrink-0 ml-2">
                            <span className="flex h-1 w-1 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c7b272] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1 w-1 bg-[#c7b272]"></span>
                            </span>
                            {langEN ? 'For You' : 'Voor jou'}
                          </span>
                        )}
                        {nav.id === 'inbox_temp' && role === 'cm' && !inboxRead && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 border border-[#F5F0E6] dark:border-slate-950 shadow-sm ml-2"></span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-[#1A1A2E]/10 dark:border-white/10 flex flex-col gap-2">
                <button 
                  onClick={() => setIsSettingsExpanded(!isSettingsExpanded)} 
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[#666666] dark:text-slate-400 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 transition-all text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    {langEN ? 'Login' : 'Login'}
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${isSettingsExpanded ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSettingsExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-4"
                    >
                      {role === 'guest' ? (
                        <div className="flex flex-col gap-2">
                          <form onSubmit={(e) => { handleCodeSubmit(e); setShowMobileMenu(false); }} className="flex gap-2 pt-2 pb-2">
                            <input 
                              type="password" 
                              value={settingsCode}
                              onChange={(e) => setSettingsCode(e.target.value)}
                              placeholder={langEN ? 'Access Code' : 'Toegangscode'}
                              className="flex-1 min-w-0 border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/50 dark:bg-slate-900 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all"
                            />
                            <button 
                              type="submit" 
                              className="bg-[#c7b272] hover:bg-[#b8a15f] text-white rounded-xl w-10 shrink-0 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                              aria-label="Submit code"
                            >
                              <Send size={16} />
                            </button>
                          </form>
                          <button
                            onClick={() => {
                              handleResetHidden();
                              setShowMobileMenu(false);
                            }}
                            className="w-full bg-transparent text-gray-500 dark:text-slate-400 hover:text-red-500 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-gray-300 dark:border-slate-800 hover:border-red-500/30 mb-2"
                          >
                            <RotateCcw size={12} />
                            {langEN ? 'Reset Hidden Items' : 'Herstel verborgen items'}
                          </button>
                          <button
                            onClick={() => {
                              setShowHelpModal(true);
                              setShowMobileMenu(false);
                            }}
                            className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[#c7b272] hover:text-[#b8a15f] transition-colors cursor-pointer flex items-center justify-center gap-1.5 py-1"
                          >
                            <Info size={12} />
                            {langEN ? 'Help & Support' : 'Hulp & Support'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 pt-2 pb-2">
                          <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/20 border border-[#c7b272]/20 rounded-xl p-3.5 flex flex-col gap-1.5 items-center text-center">
                            <span className="text-[10px] uppercase tracking-widest text-[#c7b272] font-bold">
                              {langEN ? 'Active Access' : 'Actieve Toegang'}
                            </span>
                            <span className="font-serif font-bold text-[#1A1A2E] dark:text-slate-100 text-sm">
                              {role === 'cm' 
                                ? (langEN ? 'Ceremony Master' : 'Ceremoniemeester') 
                                : (langEN ? 'Photographer' : 'Fotograaf')}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setRole('guest');
                              setActiveTab('overzicht');
                              setIsSettingsExpanded(false);
                              setShowMobileMenu(false);
                            }}
                            className="w-full bg-[#1A1A2E] dark:bg-slate-800 hover:bg-[#c7b272] dark:hover:bg-[#c7b272] text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <LogOut size={14} />
                            {langEN ? 'Log Out' : 'Uitloggen'}
                          </button>
                          <button
                            onClick={() => {
                              handleResetHidden();
                              setShowMobileMenu(false);
                            }}
                            className="w-full bg-transparent text-gray-500 dark:text-slate-400 hover:text-red-500 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-gray-300 dark:border-slate-800 hover:border-red-500/30 mb-2"
                          >
                            <RotateCcw size={12} />
                            {langEN ? 'Reset Hidden Items' : 'Herstel verborgen items'}
                          </button>
                          <button
                            onClick={() => {
                              setShowHelpModal(true);
                              setShowMobileMenu(false);
                            }}
                            className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[#c7b272] hover:text-[#b8a15f] transition-colors cursor-pointer flex items-center justify-center gap-1.5 py-1"
                          >
                            <Info size={12} />
                            {langEN ? 'Help & Support' : 'Hulp & Support'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center justify-between px-4 py-3 mt-auto">
                  <span className="text-sm font-medium text-[#666666] dark:text-slate-400">{langEN ? 'Theme' : 'Thema'}</span>
                  <button 
                    onClick={toggleDarkTheme}
                    className="w-12 h-6 bg-[#1A1A2E] dark:bg-[#c7b272] rounded-full relative transition-colors duration-300 shadow-inner"
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDark ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {/* Active Presence Counter */}
                <div 
                  onClick={() => { setShowPresenceHistory(true); setShowMobileMenu(false); }}
                  className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500 font-sans tracking-wide px-4 mt-1 pb-2 cursor-pointer hover:underline"
                  title={langEN ? "View activity history" : "Bekijk activiteit geschiedenis"}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c7b272] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c7b272]"></span>
                  </span>
                  <span>
                    {activeUsersCount <= 1 ? (
                      langEN ? '1 person online' : '1 persoon online'
                    ) : (
                      langEN 
                        ? `${activeUsersCount} people online` 
                        : `${activeUsersCount} mensen online`
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Fullscreen Map Modal */}
        <AnimatePresence>
          {isFullscreenMap && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A1A2E]/90 dark:bg-slate-950/90 backdrop-blur-sm z-[100] flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button 
                  onClick={() => setIsFullscreenMap(false)} 
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md border border-white/20"
                >
                  <X size={24}/>
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <img 
                  src={getFloorPlanImage()} 
                  alt="Plattegrond Fullscreen" 
                  className="max-h-[200vh] max-w-[200vw] object-contain rounded-xl shadow-2xl" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Moodboard Modal */}
        <AnimatePresence>
          {isFullscreenMoodboard && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A1A2E]/90 dark:bg-slate-950/90 backdrop-blur-sm z-[100] flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button 
                  onClick={() => setIsFullscreenMoodboard(false)} 
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md border border-white/20 cursor-pointer"
                >
                  <X size={24}/>
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4" onClick={() => setIsFullscreenMoodboard(false)}>
                <img 
                  src="/moodboard.webp" 
                  alt="Moodboard Fullscreen" 
                  className="max-h-[95vh] max-w-[95vw] object-contain rounded-xl shadow-2xl" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Bijlage Modal */}
        <AnimatePresence>
          {selectedBijlageImage && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A1A2E]/90 dark:bg-slate-950/90 backdrop-blur-sm z-[100] flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button 
                  onClick={() => setSelectedBijlageImage(null)} 
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md border border-white/20 cursor-pointer"
                >
                  <X size={24}/>
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4" onClick={() => setSelectedBijlageImage(null)}>
                <img 
                  src={selectedBijlageImage} 
                  alt="Bijlage Fullscreen" 
                  className="max-h-[95vh] max-w-[95vw] object-contain rounded-xl shadow-2xl" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Presence History Modal */}
        <AnimatePresence>
          {showPresenceHistory && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A1A2E]/60 dark:bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              onClick={() => setShowPresenceHistory(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 pl-8 border-b border-[#1A1A2E]/5 dark:border-white/5 bg-[#F5F0E6] dark:bg-slate-950">
                  <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                    <Zap size={24} className="text-[#c7b272]" />
                    {langEN ? 'Presence Activity' : 'Mensen Online'}
                  </h3>
                  <button 
                    onClick={() => setShowPresenceHistory(false)}
                    className="p-2 text-[#1A1A2E]/50 dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A2E] dark:text-slate-200 uppercase tracking-wider mb-1">
                      {langEN ? 'Last Hour Activity' : 'Activiteit afgelopen uur'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {langEN ? 'Number of active visitors per 10-minute interval' : 'Aantal actieve bezoekers per 10 minuten interval'}
                    </p>
                  </div>
                  
                  {/* Clean SVG Line Chart */}
                  <div className="relative pt-4 pb-2 bg-[#F5F0E6]/30 dark:bg-slate-950/20 rounded-2xl p-4 border border-[#1A1A2E]/5 dark:border-white/5">
                    {(() => {
                      const data = [
                        Math.max(1, activeUsersCount - 1),
                        Math.max(1, activeUsersCount + 1),
                        Math.max(1, activeUsersCount),
                        Math.max(1, activeUsersCount + 2),
                        Math.max(1, activeUsersCount - 1),
                        activeUsersCount
                      ];
                      const maxVal = Math.max(...data, 5); // scale at least up to 5 users
                      
                      // Chart dimensions: 400x120
                      // Width spacing: 400 / 5 = 80 per point
                      // Height spacing: 120 - 20 (padding) = 100
                      const points = data.map((val, idx) => {
                        const x = idx * 70 + 25;
                        const y = 110 - (val / maxVal) * 80;
                        return { x, y, val };
                      });
                      
                      const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                      
                      return (
                        <div className="w-full">
                          <svg className="w-full h-32 overflow-visible text-[#c7b272]" viewBox="0 0 400 130">
                            {/* Grid Lines */}
                            <line x1="25" y1="30" x2="375" y2="30" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                            <line x1="25" y1="70" x2="375" y2="70" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                            <line x1="25" y1="110" x2="375" y2="110" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                            
                            {/* Path Area */}
                            <path
                              d={`${pathD} L 375 110 L 25 110 Z`}
                              fill="currentColor"
                              fillOpacity="0.05"
                            />
                            
                            {/* Path Line */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* Data points */}
                            {points.map((p, idx) => (
                              <g key={idx}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="4"
                                  className="fill-white dark:fill-slate-900 stroke-[#c7b272]"
                                  strokeWidth="2.5"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 10}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fontWeight="bold"
                                  className="fill-[#1A1A2E] dark:fill-slate-200 font-mono"
                                >
                                  {p.val}
                                </text>
                              </g>
                            ))}
                          </svg>
                          
                          {/* X Axis Labels */}
                          <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-2 px-2">
                            <span>-50m</span>
                            <span>-40m</span>
                            <span>-30m</span>
                            <span>-20m</span>
                            <span>-10m</span>
                            <span className="text-[#c7b272] font-bold">{langEN ? 'Now' : 'Nu'}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-[#c7b272] font-semibold">
                      {langEN 
                        ? `Currently ${activeUsersCount} active session(s)` 
                        : `Momenteel ${activeUsersCount} actieve sessie(s)`}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Floating Twitch Chat Window */}
      <AnimatePresence>
        {isFloatingChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-20 right-4 md:top-24 md:right-6 w-80 md:w-96 h-[380px] md:h-[450px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#1A1A2E]/10 dark:border-white/10 rounded-2xl shadow-2xl z-[85] overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-[#F5F0E6] dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="font-serif font-bold text-xs text-[#1A1A2E] dark:text-slate-100">Live Chat</span>
                {isChatReady && (
                  <span className="text-[9px] text-gray-400 dark:text-slate-500 max-w-[80px] truncate" title={chatNickname}>
                    ({chatNickname})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {isChatReady && (
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('wedding_chat_username');
                      localStorage.removeItem('wedding_chat_username');
                      setChatNickname('');
                      setIsChatReady(false);
                    }}
                    className="p-1 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title={langEN ? 'Change Name' : 'Naam wijzigen'}
                  >
                    <LogOut size={13} />
                  </button>
                )}
                <button 
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="p-1 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 transition-colors cursor-pointer"
                  title={langEN ? 'Close Chat' : 'Sluit chat'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {!isChatReady ? (
                <form onSubmit={handleJoinChat} className="p-4 flex flex-col gap-2.5 justify-center items-center h-full">
                  <span className="text-[10px] text-gray-500 text-center font-medium">
                    {langEN ? 'Enter name to chat:' : 'Vul je naam in om te chatten:'}
                  </span>
                  <input 
                    type="text" 
                    value={chatNickname}
                    onChange={(e) => setChatNickname(e.target.value)}
                    placeholder={langEN ? 'Your Name...' : 'Je naam...'}
                    className="w-full border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/50 dark:bg-slate-950/50 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-3.5 py-1.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-xs transition-all"
                    maxLength={20}
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-[#c7b272] hover:bg-[#b8a15f] text-white py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    {langEN ? 'Join Chat' : 'Deelnemen'}
                  </button>
                </form>
              ) : (
                <>
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5 chat-messages-container bg-gray-50/10 dark:bg-slate-900/5 min-h-0 flex flex-col">
                    {chatMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                        <p className="text-[10px] italic">{langEN ? 'No messages... Say hi!' : 'Geen berichten... Zeg hallo!'}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {chatMessages.map((msg) => {
                          const userColor = getUsernameColor(msg.username);
                          const formattedTime = new Date(msg.timestamp).toLocaleTimeString(langEN ? 'en-US' : 'nl-NL', { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div key={msg.id} className="text-[11px] break-words leading-relaxed py-0.5 px-0.5 rounded transition-colors">
                              <span className="text-[8px] text-gray-400 dark:text-slate-500 font-mono mr-1.5">{formattedTime}</span>
                              <span className="font-bold mr-1 hover:underline cursor-pointer" style={{ color: userColor }}>
                                {msg.username}:
                              </span>
                              <span className="text-gray-700 dark:text-slate-200">{msg.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <form onSubmit={handleSendChatMessage} className="p-2 border-t border-gray-100 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 flex gap-2 shrink-0">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={langEN ? 'Message...' : 'Bericht...'}
                      className="flex-1 border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-900/30 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[11px] transition-all"
                      maxLength={200}
                    />
                    <button 
                      type="submit" 
                      className="bg-[#c7b272] hover:bg-[#b8a15f] text-white p-1.5 rounded-lg shrink-0 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      aria-label="Send"
                    >
                      <Send size={12} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Inbox Button */}
      {!isFloatingChatOpen && (!isInboxDismissed || hasSupportReply) && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[90]">
          <button
            onClick={() => {
              setShowInboxPopup(true);
              markInboxAsRead(true);
              markAllAsRead();
            }}
            className="w-12 h-12 md:w-14 md:h-14 bg-transparent text-[#c7b272] rounded-full flex items-center justify-center transition-all hover:bg-[#c7b272]/10 relative cursor-pointer"
          >
            <Mail size={24} />
            {(!inboxRead || (role === 'photographer' && !dismissedNotifications.includes('photo_priority') && !readNotifications.includes('photo_priority')) || (role === 'cm' && !dismissedNotifications.includes('cm_maserati') && !readNotifications.includes('cm_maserati')) || (role === 'guest' && !dismissedNotifications.includes('guest_parking') && !readNotifications.includes('guest_parking')) || hasSupportReply) && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#F5F0E6] dark:border-slate-950 rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Inbox Popup */}
      <AnimatePresence>
        {showInboxPopup && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A2E]/50 dark:bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowInboxPopup(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pl-8 border-b border-[#1A1A2E]/5 dark:border-white/5 bg-[#F5F0E6] dark:bg-slate-950">
                <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                  <Mail size={24} className="text-[#c7b272]" />
                  {langEN ? 'Inbox' : 'Postvak IN'}
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowInboxPopup(false)}
                    className="p-2 text-[#1A1A2E]/50 dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-4 scrollbar-thin">
                {(() => {
                  const notificationsList = [
                    // PHOTOGRAPHER
                    {
                      id: 'photo_priority',
                      role: 'photographer',
                      category: 'Urgent',
                      time: '11:00',
                      title: 'Priority Photography',
                      content: 'Prioriteit gasten moeten vandaag absoluut gefotografeerd worden: Fleur, Samuel, Cor, Wilma, Opa, en een foto vasthoudend van Leo & Gonnie.',
                      targetTab: 'gasten',
                      urgent: true
                    },
                    {
                      id: 'photo_first_look',
                      role: 'photographer',
                      category: 'Timeline',
                      time: '12:30',
                      title: 'First Look Photo',
                      content: "Wees om 13:00 uur klaar bij 'The hedge' (de haag) voor de aankomst van de Maserati en het eerste ontmoetingsmoment.",
                      targetTab: 'cm',
                      urgent: false
                    },
                    {
                      id: 'photo_map',
                      role: 'photographer',
                      category: 'System',
                      time: 'System',
                      title: 'Dynamic Floor Plan Active',
                      content: "Je dashboard toont automatisch de fotorelevante plattegrond via '/plattegrond_fotograaf.webp'.",
                      targetTab: 'plattegrond',
                      urgent: false
                    },
                    {
                      id: 'photo_cake',
                      role: 'photographer',
                      category: 'Schedule',
                      time: '14:00',
                      title: 'Wedding Cake & Toast',
                      content: "Het aansnijden van de taart vindt plaats om 15:00 uur in de Palmenkas. Zorg dat je op tempo klaarstaat voor toostfoto's.",
                      targetTab: 'cm',
                      urgent: false
                    },

                    // CM
                    {
                      id: 'cm_maserati',
                      role: 'cm',
                      category: 'Task Alert',
                      time: '14:45',
                      title: 'Maserati Verplaatsen',
                      content: 'Let op: Matthew moet de Maserati na de ceremonie verplaatsen naar de zijkant van de Oranjerie (om 14:45 uur).',
                      targetTab: 'cm',
                      urgent: true
                    },
                    {
                      id: 'cm_music',
                      role: 'cm',
                      category: 'Timeline',
                      time: '12:45',
                      title: 'Muziek & Gasten Begeleiden',
                      content: 'Begeleid gasten om 12:45 uur naar de haag en start de Italiaanse playlist in de Palmenkas op de Spotify van Katinka (vliegtuigstand).',
                      targetTab: 'cm',
                      urgent: false
                    },
                    {
                      id: 'cm_password',
                      role: 'cm',
                      category: 'System',
                      time: 'System',
                      title: 'Ceremonie Wachtwoord',
                      content: "Tip: Als je het wachtwoord 'Meester1' invult in de chat, deelt de AI ook alle bijzonderheden over de ceremonie taken met je.",
                      targetTab: 'extra',
                      urgent: false
                    },
                    {
                      id: 'cm_dinner',
                      role: 'cm',
                      category: 'Note',
                      time: '18:00',
                      title: 'Tafelschikking Diner',
                      content: 'De Oranjerie heeft vooraf de bijlage ontvangen, maar controleer om 18:00 uur samen met Wilma en Fleur de dinertafels.',
                      targetTab: 'cm',
                      urgent: false
                    },

                    // GUEST
                    {
                      id: 'guest_welcome',
                      role: 'guest',
                      category: 'Welcome',
                      time: 'Welkom',
                      title: 'Welkom bij ons huwelijk!',
                      content: 'We vinden het geweldig dat je er bent. Gebruik deze app om het programma, parkeerinformatie en de plattegrond te bekijken.',
                      targetTab: 'overzicht',
                      urgent: false
                    },
                    {
                      id: 'guest_parking',
                      role: 'guest',
                      category: 'Locatie',
                      time: 'Location',
                      title: 'Parkeerlocatie',
                      content: 'Parkeren kan gratis op het beveiligde parkeerterrein van Oranjerie Hydepark (Driebergsestraatweg 50, Doorn).',
                      targetTab: 'locatie',
                      urgent: true
                    },
                    {
                      id: 'guest_chat',
                      role: 'guest',
                      category: 'Chat',
                      time: 'Live',
                      title: 'Live Gasten Chat',
                      content: 'Praat gezellig mee in de live groepschat onder de \'Extra\' tab en deel wensen met andere gasten!',
                      targetTab: 'extra',
                      urgent: false,
                      isChatTrigger: true
                    },
                    ...(localStorage.getItem('wedding_support_reply_exists') === 'true' ? [{
                      id: 'support_reply',
                      role: role,
                      category: 'Support',
                      time: 'Support',
                      title: langEN ? 'Support Response' : 'Support Reactie',
                      content: localStorage.getItem('wedding_support_reply_text') || '',
                      targetTab: 'overzicht',
                      urgent: hasSupportReply
                    }] : [])
                  ];

                  const activeNotifications = notificationsList.map(n => {
                    if (readNotifications.includes(n.id)) {
                      return { ...n, urgent: false };
                    }
                    return n;
                  }).filter(
                    n => n.role === role && !dismissedNotifications.includes(n.id)
                  );

                  if (activeNotifications.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4 text-gray-400 dark:text-slate-500">
                          <Mail size={32} />
                        </div>
                        <p className="text-gray-500 dark:text-slate-400">
                          {langEN ? 'Your inbox is empty.' : 'Je postvak is leeg.'}
                        </p>
                      </div>
                    );
                  }

                  return activeNotifications.map(n => (
                    <div key={n.id} className="bg-[#c7b272]/5 dark:bg-slate-800/40 border border-[#c7b272]/20 rounded-2xl p-4 flex flex-col gap-1.5 text-left relative group">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 ${
                          n.urgent 
                            ? 'text-red-500 bg-red-500/10' 
                            : 'text-[#c7b272] bg-[#c7b272]/10'
                        }`}>
                          {n.urgent && <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse"></span>}
                          {n.category}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <h4 className="font-serif font-bold text-[#1A1A2E] dark:text-slate-200 text-sm">{n.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                        {n.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A2E]/5 dark:border-white/5">
                        <button
                          onClick={() => {
                            if (n.id === 'support_reply') {
                              setShowInboxPopup(false);
                              setShowHelpModal(true);
                              setSupportActiveTab('list');
                              const repliedTicket = supportTickets.find(t => t.status === 'replied');
                              if (repliedTicket) {
                                setSelectedSupportTicketId(repliedTicket.id);
                              } else if (supportTickets.length > 0) {
                                setSelectedSupportTicketId(supportTickets[0].id);
                              }
                            } else {
                              setActiveTab(n.targetTab);
                              setShowInboxPopup(false);
                              if (n.isChatTrigger) {
                                setIsFloatingChatOpen(true);
                                scrollToBottom();
                              }
                            }
                          }}
                          className="text-[10px] font-bold text-[#c7b272] hover:text-[#b8a15f] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {langEN ? 'Bring me here →' : 'Breng me hierheen →'}
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help & Support Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A2E]/60 dark:bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
            onClick={() => {
              setShowHelpModal(false);
              setSupportSuccess(false);
              setSelectedSupportTicketId(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-[#1A1A2E]/5 dark:border-white/5 overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Title Header */}
              <div className="flex items-center justify-between p-6 pl-8 border-b border-[#1A1A2E]/5 dark:border-white/5 bg-[#F5F0E6] dark:bg-slate-950 shrink-0">
                <h3 className="text-xl font-serif font-bold text-[#1A1A2E] dark:text-slate-100 flex items-center gap-3">
                  <Mail size={24} className="text-[#c7b272]" />
                  {langEN ? 'Help & Support' : 'Hulp & Support'}
                </h3>
                <button 
                  onClick={() => {
                    setShowHelpModal(false);
                    setSupportSuccess(false);
                    setSelectedSupportTicketId(null);
                  }}
                  className="p-2 text-[#1A1A2E]/50 dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex border-b border-[#1A1A2E]/5 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
                <button
                  onClick={() => { setSupportActiveTab('create'); setSelectedSupportTicketId(null); }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    supportActiveTab === 'create'
                      ? 'border-[#c7b272] text-[#c7b272]'
                      : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'
                  }`}
                >
                  {langEN ? 'New Ticket' : 'Nieuw ticket'}
                </button>
                <button
                  onClick={() => { setSupportActiveTab('list'); setSelectedSupportTicketId(null); }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 relative ${
                    supportActiveTab === 'list'
                      ? 'border-[#c7b272] text-[#c7b272]'
                      : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'
                  }`}
                >
                  {langEN ? 'My Tickets' : 'Mijn tickets'}
                  {supportTickets.length > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] bg-[#c7b272] text-white rounded-full font-bold">
                      {supportTickets.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Content Panel */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 scrollbar-thin">
                {supportActiveTab === 'list' ? (
                  selectedSupportTicketId ? (() => {
                    const ticket = supportTickets.find(t => t.id === selectedSupportTicketId);
                    if (!ticket) return null;
                    return (
                      <div className="flex flex-col gap-5 text-left">
                        {/* Back Button */}
                        <button 
                          onClick={() => setSelectedSupportTicketId(null)} 
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c7b272] hover:text-[#b8a15f] transition-colors cursor-pointer select-none self-start"
                        >
                          <ArrowLeft size={14} />
                          {langEN ? 'Back to tickets' : 'Terug naar overzicht'}
                        </button>

                        {/* Stepper (Process Tracker) */}
                        <div className="flex flex-col gap-3 bg-gray-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-[#1A1A2E]/5 dark:border-white/5 shadow-sm">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            {langEN ? 'Ticket Progress' : 'Voortgang status'}
                          </h4>
                          <div className="flex flex-col gap-4 relative pl-5 mt-2">
                            {/* Stepper line */}
                            <div className="absolute left-[6px] top-1.5 bottom-1.5 w-0.5 bg-gray-200 dark:bg-slate-800"></div>
                            
                            {/* Step 1 */}
                            <div className="flex items-start gap-3 relative">
                              <div className="absolute left-[-24px] top-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                <Check size={8} className="text-white font-bold" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-700 dark:text-slate-200">{langEN ? 'Ticket Submitted' : 'Ticket ingediend'}</p>
                                <p className="text-[9px] text-gray-400 dark:text-slate-500">{langEN ? 'Your request has been logged successfully' : 'Hulpverzoek is geregistreerd'}</p>
                              </div>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="flex items-start gap-3 relative">
                              <div className="absolute left-[-24px] top-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                <Check size={8} className="text-white font-bold" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-700 dark:text-slate-200">{langEN ? 'Delivered to Support' : 'Verzonden naar Support'}</p>
                                <p className="text-[9px] text-gray-400 dark:text-slate-500">
                                  {langEN ? 'Sent email notification to jorik.katinkainfo@gmail.com' : 'E-mail verstuurd naar jorik.katinkainfo@gmail.com'}
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-3 relative">
                              <div className={`absolute left-[-24px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                                ticket.status === 'replied' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                              }`}>
                                {ticket.status === 'replied' ? <Check size={8} className="text-white font-bold" /> : <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-700 dark:text-slate-200">{langEN ? 'Under Review' : 'In behandeling'}</p>
                                <p className="text-[9px] text-gray-400 dark:text-slate-500">
                                  {ticket.status === 'replied' 
                                    ? (langEN ? 'Review completed' : 'Beoordeeld door Jorik & Katinka') 
                                    : (langEN ? 'Awaiting response from Jorik & Katinka' : 'Wachten op reactie van Jorik & Katinka')}
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-start gap-3 relative">
                              <div className={`absolute left-[-24px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                                ticket.status === 'replied' ? 'bg-[#c7b272]' : 'bg-gray-200 dark:bg-slate-800'
                              }`}>
                                {ticket.status === 'replied' ? <Check size={8} className="text-white font-bold" /> : null}
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${ticket.status === 'replied' ? 'text-[#c7b272]' : 'text-gray-400 dark:text-slate-500'}`}>
                                  {langEN ? 'Reply Received' : 'Antwoord ontvangen'}
                                </p>
                                <p className="text-[9px] text-gray-400 dark:text-slate-500 font-medium">
                                  {ticket.status === 'replied' 
                                    ? (langEN ? 'Check response in conversation below' : 'Reactie toegevoegd aan de chat') 
                                    : (langEN ? 'A notification will pop up on the site when resolved' : 'Melding volgt op de site zodra er antwoord is')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex flex-col gap-4 mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                              {langEN ? 'Conversation' : 'Gesprek'}
                            </h4>
                          </div>
                          
                          <div className="flex flex-col gap-4 bg-gray-50/30 dark:bg-slate-950/20 p-4 rounded-2xl border border-[#1A1A2E]/5 dark:border-white/5 min-h-[120px]">
                            {/* User original request */}
                            <div className="flex flex-col gap-1 items-end self-end max-w-[85%]">
                              <div className="flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-slate-500 mr-1 font-mono">
                                <span className="font-bold">{ticket.name}</span>
                                <span>•</span>
                                <span>{new Date(ticket.timestamp).toLocaleTimeString(langEN ? 'en-US' : 'nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="bg-[#1A1A2E]/5 dark:bg-slate-800 text-[#1A1A2E] dark:text-slate-100 rounded-2xl rounded-tr-none px-4 py-2.5 text-xs leading-relaxed shadow-sm font-medium whitespace-pre-wrap text-left">
                                {ticket.message}
                              </div>
                              <span className="text-[8px] uppercase tracking-wider text-[#c7b272] font-semibold bg-[#c7b272]/5 px-2 py-0.5 rounded border border-[#c7b272]/10 mt-1">
                                {ticket.category}
                              </span>
                            </div>

                            {/* Reply message */}
                            {ticket.status === 'replied' && ticket.reply ? (
                              <div className="flex flex-col gap-1 items-start self-start max-w-[85%] mt-1">
                                <div className="flex items-center gap-1.5 text-[9px] text-[#c7b272] ml-1 font-mono">
                                  <span className="font-bold flex items-center gap-1">
                                    <Heart size={10} className="fill-[#c7b272] text-[#c7b272]" /> 
                                    Jorik & Katinka Support
                                  </span>
                                  <span>•</span>
                                  <span>{langEN ? 'Organizer' : 'Organisator'}</span>
                                </div>
                                <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/15 border border-[#c7b272]/30 text-[#1A1A2E] dark:text-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs leading-relaxed shadow-sm border-l-4 border-l-[#c7b272] text-left font-medium whitespace-pre-wrap">
                                  {ticket.reply}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 bg-amber-50/50 dark:bg-slate-950/20 border border-dashed border-amber-200/50 dark:border-slate-800/80 p-4 rounded-xl mt-1 text-left">
                                <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-slate-900 text-amber-500">
                                  <Clock size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-500">
                                    {langEN ? 'Awaiting response...' : 'Wachten op antwoord...'}
                                  </h5>
                                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed mt-0.5">
                                    {langEN 
                                      ? 'Your ticket is forwarded. Once Jorik replies to the email notification, the response will show up here instantly!' 
                                      : 'Je hulpverzoek is doorgestuurd. Zodra Jorik de e-mail beantwoordt, verschijnt het antwoord direct hier!'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })() : (
                    supportTickets.length === 0 ? (
                      <div className="text-center py-10 flex flex-col items-center justify-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 mb-3 text-gray-400 dark:text-slate-500">
                          <Mail size={20} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                          {langEN ? 'You have not submitted any tickets yet.' : 'Je hebt nog geen hulpverzoeken ingediend.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {supportTickets.map(ticket => (
                          <div 
                            key={ticket.id} 
                            onClick={() => setSelectedSupportTicketId(ticket.id)}
                            className="group bg-gray-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-900/50 border border-gray-100 hover:border-[#c7b272]/30 dark:border-slate-800/80 rounded-2xl p-4 text-left flex flex-col gap-3 shadow-sm transition-all cursor-pointer relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-[#c7b272] uppercase tracking-wider bg-[#c7b272]/5 px-2 py-0.5 rounded border border-[#c7b272]/10">
                                {ticket.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 ${
                                  ticket.status === 'replied' 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                  {ticket.status !== 'replied' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full inline-block animate-pulse"></span>}
                                  {ticket.status === 'replied' 
                                    ? (langEN ? 'Replied' : 'Beantwoord') 
                                    : (langEN ? 'Sent' : 'Verzonden')}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                              {ticket.message}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-[#1A1A2E]/5 dark:border-white/5 text-[9px] text-gray-400 dark:text-slate-500 font-mono">
                              <span>
                                {new Date(ticket.timestamp).toLocaleString(langEN ? 'en-US' : 'nl-NL', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="text-[#c7b272] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                {langEN ? 'View status & chat' : 'Bekijk status & chat'} →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                ) : supportSuccess ? (
                  <div className="text-center py-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-[#1A1A2E] dark:text-slate-100 mb-2">
                      {langEN ? 'Message Sent!' : 'Bericht verzonden!'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
                      {langEN 
                        ? 'Your message has been sent to jorik.katinkainfo@gmail.com. We will get back to you as soon as possible.' 
                        : 'Je bericht is verzonden naar jorik.katinkainfo@gmail.com. We nemen zo snel mogelijk contact met je op.'}
                    </p>
                    <button
                      onClick={() => {
                        setSupportSuccess(false);
                        setSupportActiveTab('list');
                        setSelectedSupportTicketId(null);
                      }}
                      className="bg-[#c7b272] hover:bg-[#b8a15f] text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      {langEN ? 'View Tickets' : 'Bekijk hulpverzoeken'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {langEN ? 'Your Name' : 'Je naam'}
                      </label>
                      <input
                        type="text"
                        required
                        value={supportName}
                        onChange={e => setSupportName(e.target.value)}
                        placeholder={langEN ? 'Enter your name...' : 'Vul je naam in...'}
                        className="w-full border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {langEN ? 'Your Email (Optional)' : 'Je e-mailadres (optioneel)'}
                      </label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={e => setSupportEmail(e.target.value)}
                        placeholder={langEN ? 'Enter your email (optional)...' : 'Vul je e-mailadres in (optioneel)...'}
                        className="w-full border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {langEN ? 'Category' : 'Categorie'}
                      </label>
                      <select
                        value={supportCategory}
                        onChange={e => setSupportCategory(e.target.value)}
                        className="w-full border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all cursor-pointer dark:bg-slate-900"
                      >
                        <option value="Probleem met design / lay-out" className="dark:bg-slate-900">{langEN ? 'Design / Layout Issue' : 'Probleem met design / lay-out'}</option>
                        <option value="Toegangscodes / Inloggen" className="dark:bg-slate-900">{langEN ? 'Access Codes / Login' : 'Toegangscodes / Inloggen'}</option>
                        <option value="Live Chat / Notities" className="dark:bg-slate-900">{langEN ? 'Live Chat / Notes' : 'Live Chat / Notities'}</option>
                        <option value="Plattegrond / Afbeeldingen" className="dark:bg-slate-900">{langEN ? 'Map / Images' : 'Plattegrond / Afbeeldingen'}</option>
                        <option value="Foutmelding of bug" className="dark:bg-slate-900">{langEN ? 'Error Message / Bug' : 'Foutmelding of bug'}</option>
                        <option value="Anders" className="dark:bg-slate-900">{langEN ? 'Other' : 'Anders'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {langEN ? 'Describe your problem' : 'Beschrijf je probleem'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={supportMessage}
                        onChange={e => setSupportMessage(e.target.value)}
                        placeholder={langEN ? 'How can we help you?' : 'Waar kunnen we je mee helpen?'}
                        className="w-full border border-gray-200 dark:border-slate-800 bg-[#F5F0E6]/30 dark:bg-slate-950/30 text-[#1A1A2E] dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#c7b272] focus:border-[#c7b272] outline-none text-[16px] md:text-sm transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSendingSupport}
                      className="w-full bg-[#c7b272] hover:bg-[#b8a15f] disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSendingSupport ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          {langEN ? 'Sending...' : 'Verzenden...'}
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          {langEN ? 'Send Support Request' : 'Verstuur hulpverzoek'}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Support Reply Popup Alert */}
      <AnimatePresence>
        {hasSupportReply && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white dark:bg-slate-900 border-2 border-[#c7b272] rounded-3xl shadow-2xl p-5 z-[150] flex flex-col gap-3 font-sans"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                {langEN ? 'Support Response' : 'Support Reactie'}
              </span>
              <button 
                onClick={() => {
                  setHasSupportReply(false);
                  localStorage.setItem('wedding_support_reply_unread', 'false');
                }}
                className="p-1 text-[#1A1A2E]/50 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#1A1A2E] dark:text-slate-200 mb-1">
                {langEN ? 'Message from jorik.katinkainfo@gmail.com' : 'Bericht van jorik.katinkainfo@gmail.com'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed italic">
                "{localStorage.getItem('wedding_support_reply_text') || ''}"
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A2E]/5 dark:border-white/5">
              <button
                onClick={() => {
                  setHasSupportReply(false);
                  localStorage.setItem('wedding_support_reply_unread', 'false');
                  setShowHelpModal(true);
                  setSupportActiveTab('list');
                  const repliedTicket = supportTickets.find(t => t.status === 'replied');
                  if (repliedTicket) {
                    setSelectedSupportTicketId(repliedTicket.id);
                  } else if (supportTickets.length > 0) {
                    setSelectedSupportTicketId(supportTickets[0].id);
                  }
                }}
                className="bg-[#c7b272] hover:bg-[#b8a15f] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                {langEN ? 'View Response' : 'Bekijk reactie'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
