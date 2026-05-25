import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MessageSquare, MapPin, Clock, Calendar, Info, Heart, Send, ChevronRight, Settings, Map as MapIcon, Pin, PinOff, X, Zap, Maximize, Menu, Cloud, Sun, Droplets, Trash2, Plus, Mail, Music, Camera, LogOut, FileText, Image, ArrowLeft, Check } from 'lucide-react';
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
            <button 
              onClick={() => handleDelete(idx)}
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
              title={langEN ? "Delete note" : "Notitie verwijderen"}
            >
              <Trash2 size={16} />
            </button>
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

const scheduleNL = [
  { id: 1, time: "12:15 - 12:45", title: "Welkom & aankomst", desc: "Koffie en lekkers staan voor je klaar.\nSchrijf je gelukswensen aan het bruidspaar in het gastenboek bij de ingang.", location: "Palmenkas & Terras", roles: ["Iedereen"] },
  { id: 2, time: "12:45 - 13:00", title: "Naar de haag", desc: "Je wordt uitgenodigd om buiten bij 'de haag' het bruidspaar op te wachten.", location: "Buiten", roles: ["Iedereen"] },
  { id: 3, time: "13:00 - 13:05", title: "Aankomst bruidspaar", desc: "Het bruidspaar arriveert.", location: "Buiten", roles: ["Iedereen"] },
  { id: 4, time: "13:05 - 13:15", title: "Stoet naar de Oranjerie", desc: "Samen met het bruidspaar loop je richting de Oranjerie.", location: "Buiten", roles: ["Iedereen"] },
  { id: 5, time: "13:15 - 13:25", title: "Plaatsnemen in Oranjekas", desc: "Iedereen zoekt een mooi plekje op. Voor naaste familie zijn vooraan stoelen gereserveerd.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 6, time: "13:15 - 13:25", title: "Welkom door BABS", desc: "De Bijzonder Ambtenaar Burgerlijke Stand heet jullie welkom.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 7, time: "13:25 - 13:27", title: "Intocht bruidegom", desc: "Alle gasten gaan staan.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 8, time: "13:27 - 13:30", title: "Intocht bruid", desc: "Alle gasten blijven staan.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 9, time: "13:30 - 14:00", title: "Huwelijksvoltrekking", desc: "Het ja-woord, de ringen en de geloften.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 10, time: "14:05 - 14:20", title: "Zegen en speeches", desc: "", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 11, time: "14:20 - 14:25", title: "Bloemenhulde", desc: "Iedereen gaat staan en strooit bloemblaadjes als het bruidspaar langsloopt.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 12, time: "14:25 - 14:45", title: "Felicitatiemoment", desc: "Alle gasten lopen vanaf de voorste rijen langs het bruidspaar voor felicitaties en de gelegenheid om een cadeau te overhandigen.", location: "Oranjekas", roles: ["Iedereen"] },
  { id: 13, time: "14:45 - 15:00", title: "Gasten gaan naar de Palmenkas en korte pauze", desc: "", location: "Palmenkas", roles: ["Iedereen"] },
  { id: 14, time: "15:00 - 15:30", title: "Toost en taart", desc: "Het bruidspaar snijdt de taart aan, deze wordt rondgedeeld vergezeld van een glas alcoholvrije prosecco.\nEr wordt getoost en er zijn twee creatieve bijdragen.", location: "Palmenkas", roles: ["Iedereen"] },
  { id: 15, time: "15:30 - 17:30", title: "Receptie & groepsfoto's", desc: "Geniet van hapjes en drankjes.\nDe fotograaf maakt groepsfoto's.", location: "Palmenkas & Terras", roles: ["Iedereen"] },
  { id: 16, time: "17:30 - 17:45", title: "Einde receptie & uitzwaaien", desc: "Vergeet je persoonlijke spullen niet en neem een presentje mee dat bij de ingang ligt.", location: "Haag buiten", roles: ["Iedereen"] }
];

const scheduleEN = [
  { id: 1, time: "12:15 - 12:45", title: "Welcome & Arrival", desc: "Coffee and treats are waiting for you.\nWrite your best wishes for the couple in the guestbook at the entrance.", location: "Palmenkas & Terrace", roles: ["Everyone"] },
  { id: 2, time: "12:45 - 13:00", title: "To the Hedge", desc: "You are invited to wait outside by 'the hedge' for the couple.", location: "Outside", roles: ["Everyone"] },
  { id: 3, time: "13:00 - 13:05", title: "Arrival of Couple", desc: "The couple arrives.", location: "Outside", roles: ["Everyone"] },
  { id: 4, time: "13:05 - 13:15", title: "Procession to Oranjerie", desc: "Together with the couple, you walk towards the Oranjerie.", location: "Outside", roles: ["Everyone"] },
  { id: 5, time: "13:15 - 13:25", title: "Take Seats in Oranjekas", desc: "Everyone finds a nice spot. Seats at the front are reserved for close family.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 6, time: "13:15 - 13:25", title: "Welcome by Officiant", desc: "The wedding officiant welcomes you.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 7, time: "13:25 - 13:27", title: "Groom's Entrance", desc: "All guests stand.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 8, time: "13:27 - 13:30", title: "Bride's Entrance", desc: "All guests remain standing.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 9, time: "13:30 - 14:00", title: "Marriage Ceremony", desc: "The official vows, rings, and promises.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 10, time: "14:05 - 14:20", title: "Blessings & Speeches", desc: "", location: "Oranjekas", roles: ["Everyone"] },
  { id: 11, time: "14:20 - 14:25", title: "Flower Tribute", desc: "Everyone stands and scatters flower petals as the couple walks by.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 12, time: "14:25 - 14:45", title: "Congratulations", desc: "All guests walk past the couple from the front rows for congratulations and an opportunity to hand over a gift.", location: "Oranjekas", roles: ["Everyone"] },
  { id: 13, time: "14:45 - 15:00", title: "Break / Guests to Palmenkas", desc: "", location: "Palmenkas", roles: ["Everyone"] },
  { id: 14, time: "15:00 - 15:30", title: "Toast & Cake", desc: "The couple cuts the cake, which is distributed accompanied by a glass of alcohol-free prosecco.\nThere is a toast and two creative contributions.", location: "Palmenkas", roles: ["Everyone"] },
  { id: 15, time: "15:30 - 17:30", title: "Reception & Group Photos", desc: "Enjoy drinks and snacks.\nThe photographer takes group photos.", location: "Palmenkas & Terrace", roles: ["Everyone"] },
  { id: 16, time: "17:30 - 17:45", title: "End of Reception & Waving Off", desc: "Don't forget your personal belongings and take a small gift located at the entrance.", location: "Hedge outside", roles: ["Everyone"] }
];

const cmTasksNL = [
  {
    "id": 1,
    "time": "9.30 - 11.00",
    "action": "Opbouw locatie door ceremoniemeesters",
    "who": "- Aanwezig op locatie, alles klaarzetten en controleren. Met hulp van de Oranjerie.\n- Decoratie hebben jullie bij je. Bloemen volgen vanaf 10.30.\n- Zie bijlage Uitwerking Taken.",
    "desc": "CM zijn aanwezig op locatie, lopen alles na en zetten alles klaar, met hulp van de Oranjerie.\nZij hebben zelf ook decoratie meegekregen van Jorik eerder die week.\nWilma en Fleur doen tussen 11.00 - 11.45 een eindcontrole.\nZie bijlage Uitwerking Taken."
  },
  {
    "id": 2,
    "time": "9.00 - 9.30",
    "action": "Bruidspaar thuis, intieme setting met alleen gezin",
    "who": "",
    "desc": "Jorik komt aanrijden in Maserati en wordt boven ontvangen door de kinderen.\nFleur haalt Katinka op in de slaapkamer en brengt Katinka naar de woonkamer. We zien elkaar daar voor het eerst ❤️\nFleur en Samuel maken foto's."
  },
  {
    "id": 3,
    "time": "9.30 - 10.30",
    "action": "Bruidspaar vertrek naar Oranjerie",
    "who": "",
    "desc": "We vertrekken naar de Oranjerie. Fleur en Samuel rijden met ons mee.\nWil rijdt mee met Wilma en Rob en volgen later vanuit Den Haag.\nKatinka: NB logeerspullen, bruidsboeket, tasje, repen, water etc mee."
  },
  {
    "id": 4,
    "time": "10.30 - 11.00",
    "action": "Aankomst bruidspaar op locatie",
    "who": "- De Italiaanse playlist laten spelen in de Palmenkas als welkom voor het bruidspaar, aan laten totdat jullie met alle gasten richting 'de haag' gaan om 12.45.\n- Wij hebben de bruidstaart bij ons.",
    "desc": "We zetten zelf de auto aan de zijkant van het pand.\nKoffie met lekkers.\nKatinka: logeerspullen, make-up etc in privé-ruimte.\nTaak CM: de Italiaanse playlist laten spelen in de Palmenkas als welkom voor het bruidspaar, aan laten totdat jullie met alle gasten richting de haag gaan om 12.45."
  },
  {
    "id": 5,
    "time": "10.45 - 11.00",
    "action": "Aankomst Wilma/Rob en Wil",
    "who": "",
    "desc": "Knuffelmoment met bruidspaar ❤️"
  },
  {
    "id": 6,
    "time": "11.00 - 13.00",
    "action": "Het bruidspaar rijdt weg van het landgoed",
    "who": "",
    "desc": "Naar een onopvallende plek.\nK: tasje, bruidsboeket, eten en drinken mee."
  },
  {
    "id": 7,
    "time": "11.00 - 12.00",
    "action": "Eindcheck door Wilma en Fleur",
    "who": "- Wilma en Fleur doen een eindcheck op de decoratie.",
    "desc": "Koffie met lekkers voor Wil, Wilma en Rob. Wilma en Fleur hebben nu tijd om de decoratie te controleren, finishing touch. De CM hebben alles al klaargezet met de locatie. En rekening houden met het welkom heten van vroege gasten."
  },
  {
    "id": 8,
    "time": "12.15 - 12.45",
    "action": "Aankomst overige gasten (68 p)",
    "who": "- Welkom heten en aanspreekpunt voor gasten.",
    "desc": "Koffie en lekkers.\nTaak CM: welkom heten en aanspreekpunt voor gasten."
  },
  {
    "id": 9,
    "time": "12.45 - 13.00",
    "action": "Gasten meenemen naar de haag",
    "who": "- Gasten om 12.45 uur leiden naar de voorkant van 'de haag' om het bruidspaar op te wachten.",
    "desc": "Taak CM: de gasten om 12.45 uur leiden naar 'de haag' en vertellen wat de bedoeling is:\n\nalle gasten moeten om 12.55 klaar staan buiten vóór de haag aan de kant van de weg en wachten daar het bruidspaar op,\nervoor zorgen dat de naaste familie aan de kant bij de haag staan omdat zij het bruidspaar straks ook als eerste volgen.\nNB wij komen vanaf de kant rijden met de lange bochtige weg als je met je rug naar de locatie staat, de weg aan de rechterkant."
  },
  {
    "id": 10,
    "time": "13.00 - 13.05",
    "action": "Aankomst bruidspaar tot halverwege de haag",
    "who": "- Aangeven dat de gasten achter de auto aan mogen lopen. De auto stopt halverwege. Daar allemaal wachten.\n- Naaste familie altijd het meest in de buurt.",
    "desc": "Taak CM: aangeven dat de gasten achter de auto aan mogen lopen. De auto stopt halverwege. Daar allemaal wachten. Naaste familie altijd het meest in de buurt. Jorik stapt uit en houdt de autodeur voor Katinka open."
  },
  {
    "id": 11,
    "time": "13.05 - 13.15",
    "action": "Bruidspaar loopt met stoet achter zich aan naar de Oranjerie",
    "who": "- Zorgen dat the gasten achter ons aanlopen.\n- Fleur, Samuel en opa direct achter ons omdat zij naar een aparte ruimte met ons gaan.",
    "desc": "Het bruidspaar loopt richting de Oranjerie.\nTaak CM: zorgen dat de gasten achter ons aanlopen. En zorgen dat Fleur, Samuel en opa direct achter ons lopen. Zij gaan namelijk straks met ons mee naar onze privéruimte."
  },
  {
    "id": 12,
    "time": "13.15 - 13.25",
    "action": "Bruidspaar, opa, Fleur en Samuel nemen plaats in onze privé-ruimte / korte pauze",
    "who": "- Zorgen dat opa, Fleur en Samuel bij het bruidspaar in de privé-ruimte zijn.",
    "desc": "Vanaf daar lopen wij ongezien met hen buiten langs om weer bij de ingang te komen."
  },
  {
    "id": 13,
    "time": "13.15 - 13.25",
    "action": "Gasten nemen hun plek in de Oranjekas",
    "who": "- Aangeven dat de gasten plaats mogen nemen in de Oranjekas.\n- Zie stoelschikking in bijlage Uitwerking Taken eerste 2 rijen voor hoofdgasten.\n- 2 stoelen achter aan de zijkant reserveren voor de CM zodat jullie goed overzicht hebben.",
    "desc": "Taak CM: aangeven dat de gasten plaats mogen nemen in de Oranjekas. Voor het bruidspaar staan vooraan twee speciale stoelen klaar. Ook zijn de eerste rijen gereserveerd voor de naaste familie. Jorik en Katinka zitten half schuin. Katinka zit aan de rechterkant van Jorik.\nFilm: Jay zet zijn camera klaar."
  },
  {
    "id": 14,
    "time": "13.15 - 13.25",
    "action": "De BABS heet de gasten welkom",
    "who": "",
    "desc": "De BABS vertelt wat nu bij de aanvang van de gasten verwacht wordt:\n\ndat de gasten op haar teken moeten gaan staan,\ndat zo het bruidspaar binnen zal komen,\ndat de gasten weer moeten gaan zitten als zij het aangeeft."
  },
  {
    "id": 15,
    "time": "13.25 - 13.27",
    "action": "Jorik wordt door zijn opa naar voren geleid",
    "who": "- Zorgen dat het liedje Holy Forever afspeelt zodra Jorik met opa bij de ingang klaarstaat.",
    "desc": "Jorik en opa staan bij de deur bij de ingang van de zaal.\nAlle gasten staan.\nTaak CM: zorgen dat de muziek wordt afgespeeld als Jorik en zijn opa klaarstaan.\nJorik en opa lopen naar voren als de muziek begint. Ze blijven even samen vooraan staan, waarna opa plaats neemt op zijn gereserveerde stoel.\nJorik wacht daar vooraan staand in het midden met zijn gezicht richting de voordeur op Katinka.\nFilm: Jay filmt de gehele ceremonie vanaf het moment vlak voordat de muziek start.\nFilm ceremonie: het naar voren lopen, de ceremonie, de zegen door Derek, speech Wilma, speech Fleur tot en met lopen door haag met bloemblaadjes en felicitatiemoment.\nJorik: dit aan Jay doorgeven."
  },
  {
    "id": 16,
    "time": "13.27 - 13.30",
    "action": "Katinka wordt door Fleur en Samuel naar Jorik geleid",
    "who": "- Zorgen dat het liedje Holy Forever blijft doorspelen.\n- De deuren sluiten achter Katinka",
    "desc": "De gasten blijven staan en de muziek speelt door. Katinka: bruidsboeket en tasje bij me.\nTaak CM: zorgen dat de deuren bij de ingang achter Katinka sluiten.\nJorik en Katinka treffen elkaar vooraan en knuffelen elkaar ❤️. We blijven nog even staan, dan vervaagt de muziek, wij gaan zitten.\nDe BABS zegt dat de gasten ook moeten gaan zitten.\nTaak CM: zorgen dat de muziek stopt."
  },
  {
    "id": 17,
    "time": "13.30 - 14.00",
    "action": "Gemeentelijke huwelijksvoltrekking door BABS",
    "who": "- Zorgen dat de muziek stopt zodra de BABS zegt dat iedereen kan gaan zitten.",
    "desc": "zij vertelt dat we de ouders van Katinka: Leo en Gonnie, moeten missen,\nzij vertelt ons verhaal,\nwettelijk deel en ja-woord,\nzij vraagt Sara naar voren met het doosje met de ringen,\nringen en uitspreken beloften naar elkaar,\nJorik en Katinka kussen elkaar ❤️,\nJorik en Katinka tekenen, dan de getuigen (Wil, Cor en Wilma) en daarna de BABS."
  },
  {
    "id": 18,
    "time": "13.45 - 14.45",
    "action": "Opbouw bruidstaart",
    "who": "- Ervoor zorgen dat de Oranjerie weet dat de taart op een hoge, ronde tafel in het midden van de Palmenkas moet komen te staan, met een wit tafelkleed eronder.",
    "desc": "Door het locatiepersoneel wordt in de Palmenkas de bruidstaart klaargezet. Zij hebben het mobiele nummer van Matthew in geval van \"nood\". In principe hoeven de CM hier niets aan te doen, behalve zorgen dat het op de juiste tafel komt."
  },
  {
    "id": 19,
    "time": "14.00 - 14.05",
    "action": "Afronding door BABS",
    "who": "",
    "desc": "zij vertelt dat neef Derek een zegen gaat uitspreken, moeder van Jorik een dankwoord en dochter Fleur een speech,\ndat daarna iedereen moet gaan staan, mandjes met bloemen doorgeven per rij en iedereen een handje bloemen pakken,\nbloemen naar het bruidspaar werpen terwijl het bruidspaar langsloopt,\ndat het bruidspaar bij de ingang blijft staan,\ndat de gasten, te beginnen vanaf de naaste familie op de voorste rijen, naar voren moeten lopen voor kort felicitatiemoment en gelegenheid tot overhandigen cadeaus,\ndat meer gelegenheid is tot gesprekken tijdens de aansluitende receptie, daarom nu de felicitaties graag kort houden,\ndat er na het feliciteren een kwartier pauze is en dat de gasten naar de andere zaal moeten gaan voor het toostmoment met aansluitend receptie vanaf 15.00 tot 17.30."
  },
  {
    "id": 20,
    "time": "14.05 - 14.20",
    "action": "Zegen Derek, speech Wilma en speech Fleur",
    "who": "",
    "desc": "Er is een microfoon aanwezig. Jullie gaan staan op de plek van de BABS.\nBij de zegen van Derek zegt hij dat iedereen moet gaan staan. Als hij klaar is, zegt hij dat iedereen weer moet gaan zitten.\nBij de bijdragen van Wilma en Fleur blijft iedereen zitten."
  },
  {
    "id": 21,
    "time": "14.20 - 14.25",
    "action": "Bruidspaar loopt door het gangpad naar voren",
    "who": "- Zorgen dat het liedje Felicitat aangaat en daarna de rest van de Italiaanse playlist.\n- Zorgen dat de mandjes met bloemen doorgegeven worden en dat iedereen een handje met bloemen heeft.",
    "desc": "Taak CM: zorgen dat de juiste muziek aangaat (\"Felicitat\"), daarna moet de Italiaanse playlist doorlopen.\nIedereen gaat staan. Bruidspaar loopt naar de ingang van de zaal, de gasten werpen bloemen naar hen. Dit staat in mandjes klaar bij elke rij.\nTaak CM: zorgen dat de mandjes met bloemen doorgegeven worden en dat iedereen een handje met bloemen heeft. Bruidspaar blijft nadat ze door het middenpad zijn gelopen bij de ingang staan."
  },
  {
    "id": 22,
    "time": "14.25 - 14.45",
    "action": "Felicitatiemoment",
    "who": "",
    "desc": "De gasten komen vanaf de eregasten van de voorste rijen naar de ingang van de zaal langs het bruidspaar om hen te feliciteren en cadeaus te overhandigen.\nAchter het bruidspaar staat een tafel met een mooi kisjet waarin het bruidspaar de cadeaus doen.\nNB de bloemblaadjes moeten hierna gelijk opgeruimd worden, door Wilma en Fleur."
  },
  {
    "id": 23,
    "time": "14.45 - 14.50",
    "action": "Maserati verplaatsen",
    "who": "- De Maserati naar de zijkant van het gebouw rijden.",
    "desc": "De Maserati wordt naar de zijkant van het gebouw gereden. Als je met de rug naar de Oranjerie staat dan rechtsvoor op het terras.\n(Zie plattegrond)\nTaak Matthew: Maserati naar de zijkant van de Oranjerie rijden (behalve Jorik mag maar 1 ander rijden)."
  },
  {
    "id": 24,
    "time": "14.45 - 15.00",
    "action": "Gasten gaan naar de Palmenkas / bruidspaar naar privéruimte — korte pauze",
    "who": "- Zorgen dat de gasten naar de Palmenkas gaan.\n- Zorgen dat in de Palmenkas de Italiaanse playlist aan gaat.",
    "desc": "Bruidspaar heeft korte pauze in privéruimte.\nTaak CM: Zorgen dat de gasten naar de Palmenkas gaan.\nTaak CM: zorgen dat in de Palmenkas de Italiaanse playlist aan gaat via Spotify op mobiel (vliegtuigstand) van Katinka."
  },
  {
    "id": 25,
    "time": "15.00 - 15.30",
    "action": "Toostmoment",
    "who": "- Bruidspaar komt aan in Palmenkas.\n- Zorgen dat Fleur en Samuel bij de bruidstaart staan.\n- Vertellen wat gaat gebeuren en zorgen dat alle gasten in de Palmenkas zijn, dus niet op het terras.\n- Aansnijden bruidstaart, toost van Cor en daarna lied van vriendin Katinka (Roelfien) en gedicht Lisa. Aansluitend begint de receptie tot 17.30.\n- Muziek uit zodra Cor begint met de toost.\n- Zorgen dat de muziek van Roelfien aangaat op haar signaal.\n- Zorgen dat nadat Lisa klaar is de Italiaanse playlist weer aan gaat.",
    "desc": "Bruidspaar komt aan in Palmenkas.\nTaak CM: vertellen wat gaat gebeuren en zorgen dat alle gasten in de Palmenkas zijn (dus niet op het terras).\n\"Aansnijden bruidstaart, toost van Cor en daarna lied van vriendin Katinka (Roelfien) en gedicht Lisa. Aansluitend begint de receptie tot 17.30.\"\nNB Er is geen microfoon voor Cor, Lisa en Roelfien.\nTaak CM: zorgen dat de Italiaanse playlist uit gaat zodra Cor gaat toosten en totdat Roelfien en Lisa ook klaar zijn. Daarna de muziek weer aan.\nTaak CM: zorgen dat de begeleidende muziek van Roelfien aan gaat.\nTaak CM: zorgen dat Fleur en Samuel naast het bruidspaar bij de bruidstaart staan.\nFilm: Jay filmt het gehele toostmoment, inclusief bijdragen Cor, Roelfien en Lisa, aansnijden van de taart, heffen van glas."
  },
  {
    "id": 26,
    "time": "15.00 - 17.30",
    "action": "Ombouw Oranjekas voor diner",
    "who": "- Indien nodig beschikbaar voor het geven van aanwijzingen.\n- We laten de Oranjerie vooraf via het bijlage Uitwerking Taken zien hoe de tafels gedekt moeten worden.",
    "desc": "Tijdens de receptie wordt door het team van de Oranjerie de Oranjekas omgebouwd voor het diner.\nWe laten hen vooraf via de bijlage Uitwerking Taken zien hoe de tafels gedekt moeten worden.\nDe CM zijn indien nodig beschikbaar voor het geven van aanwijzingen.\nWilma en Fleur zijn beschikbaar voor een eindcontrole vanaf 18.00 uur als alle gasten weg zijn."
  },
  {
    "id": 27,
    "time": "15.30 - 17.30",
    "action": "Receptie + groepsfoto's",
    "who": "- Zorgen dat de Italiaanse playlist aan blijft.\n- Bruid af en toe meeroepen zodat zij in de privéruimte iets kan eten/drinken (vragen of het personeel daar ook een paar hapjes wil neerzetten) en zich kan opfrissen.\n- Jorik graag ook 1 keer meenemen, zodat het bruidspaar even samen kan zijn in de privéruimte.\n- Helpen fotograaf bij het bijeenroepen van mensen voor op de groepsfoto's.",
    "desc": "Taak CM: zorgen dat de Italiaanse playlist aan gaat.\nTaak CM: bruid af en toe meeroepen zodat Katinka even in de privéruimte iets kan eten/drinken (vragen of het personeel daar ook een paar hapjes wil neerzetten) en me kan opfrissen.\nKatinka's ervaring is (op bijvoorbeeld begrafenissen dat je anders moeilijk wegkomt uit gesprekken als eregast en daardoor niet aan eten/drinken/rust toekomt.)\nGraag ook 1 keer een moment dat ik samen met J even naar de privéruimte kan om even bij te praten/te knuffelen.\nTaak CM: helpen fotograaf bij het bijeenroepen van mensen voor op de groepsfoto's."
  },
  {
    "id": 28,
    "time": "17.15 - 17.20",
    "action": "Maserati verplaatsen",
    "who": "- De Maserati wordt van de zijkant van het gebouw weer naar de haag gereden met de achterkant naar de Oranjerie toe (door Matthew).",
    "desc": "De Maserati wordt van de zijkant van het gebouw weer naar de haag gereden met de achterkant naar de Oranjerie toe (door Matthew)."
  },
  {
    "id": 29,
    "time": "17.25 - 17.30",
    "action": "Aankondiging einde feestelijkheden",
    "who": "- De gasten het afrondende programma vertellen, dat:\n  - De feestelijkheden om 17.30 uur ten einde zijn.\n  - Nu gelegenheid tot toilet en verzamelen tassen/jassen.\n  - Er een presentje voor hen klaarligt bij de ingang van de locatie.\n  - De gasten met hun jas etc om 17.35 uur achter het bruidspaar moeten aanlopen naar de haag.\n  - De gasten daar het bruidspaar uitzwaaien.\n  - Daarmee de dag ten einde is en hen gevraagd wordt om het terrein te verlaten.",
    "desc": "Taak CM: de gasten het afrondende programma vertellen:\ndat de feestelijkheden om 17.30 uur ten einde zijn,\nnu gelegenheid tot toilet en verzamelen tassen/jassen,\ndat er een presentje voor hen klaarligt bij de ingang van de locatie,\ndat de gasten met hun jas etc om 17.35 uur achter het bruidspaar moeten aanlopen naar de haag,\ndat de gasten daar het bruidspaar uitzwaaien,\nen daarmee de dag ten einde is en hen gevraagd wordt om het terrein te verlaten."
  },
  {
    "id": 30,
    "time": "17.30 - 17.45",
    "action": "Einde receptie en uitzwaaien bruidspaar",
    "who": "- Zorgen dat gasten met hun spullen achter het bruidspaar aan lopen.\n- Uitzwaaien bruidspaar bij de 'haag'.",
    "desc": "Taak CM: Zorgen dat gasten weten dat ze achter het bruidspaar aan moeten lopen om hen uit te zwaaien en dat geen mensen achterblijven. Alleen de naaste familie blijft.\nKatinka: tasje en bloemen mee."
  },
  {
    "id": 31,
    "time": "17.45 - 18.00",
    "action": "Wegrijden receptiegasten",
    "who": "- Zorgen dat iedereen rond 18.00 van het terrein is.\n- Tijd is nodig voor decoratie dinertafels + tafelschikking. Zie bijlage Uitwerking Taken.\n- Ook even rust voor de naaste familie.\n- En het bruidspaar heeft van 18.00 - 18.30 een fotoshoot op het terrein.",
    "desc": "Taak CM: zorgen dat iedereen rond 18.00 van het terrein is. Zo hebben F/W tijd om de dinertafels in de Oranjezaal te controleren. Ook even rust voor de naaste familie.\nHet bruidspaar komt om 18.00 terug voor een fotoshoot met de fotograaf, dan moeten de gasten dus echt weg zijn."
  },
  {
    "id": 32,
    "time": "18.00 - 18.30",
    "action": "Eindcontrole dinertafels en pauze voor naaste familie",
    "who": "- Samen met Wilma en Fleur eindcontrole op dinertafels incl. tafelschikking.",
    "desc": "Fleur en Wilma hebben tijd voor de eindcontrole van de Oranjekas (dinertafel) inclusief tafelschikking.\nWij komen om 18.00 terug voor een fotoshoot met de fotograaf."
  },
  {
    "id": 33,
    "time": "18.00 - 18.30",
    "action": "Bruidspaar komt weer terugrijden + fotoshoot fotograaf",
    "who": "",
    "desc": "Zetten Maserati zelf bij de zijkant van het gebouw. Tijd voor fotoshoot met fotograaf. Familie wacht op hen in de Palmenkas. Zij gaan daarna met het bruidspaar voorop samen naar de Oranjekas."
  },
  {
    "id": 34,
    "time": "18.30 - 20.30",
    "action": "Shared dining met naaste familie",
    "who": "- Zorgen dat de Italiaanse playlist op staat.",
    "desc": "20p\nTaak CM: Italiaanse playlist op zetten."
  },
  {
    "id": 35,
    "time": "20.30 - 20.45",
    "action": "Afscheid en uitzwaaien",
    "who": "- Zorgen dat dit afscheid om 20.45 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden.",
    "desc": "Taak CM: ervoor zorgen dat dit afscheid om 20.45 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden.\nJorik/Katinka: NB logeerkoffers, persoonlijk tasje, cadeaus mee."
  },
  {
    "id": 36,
    "time": "20.45 - 21.15",
    "action": "Opruimen",
    "who": "- Alles opruimen, met hulp van locatie, Fleur, Samuel, Wilma en Wil.\n- Zorgen dat alles mee naar huis gaat wat van ons is.\n- Zie bijlage Uitwerking Taken.",
    "desc": "Fleur, Wilma, Samuel, Wil en de CM moeten nu alles opruimen. De Oranjerie helpt hierbij.\nNB zorgen dat alles mee naar huis gaat wat van ons is, zie daarvoor ook de bijlage Uitwerking Taken."
  }
];

const cmTasksEN = [
  {
    "id": 1,
    "time": "9.30 - 11.00",
    "action": "Opbouw locatie door ceremoniemeesters",
    "who": "Aanwezig op locatie, alles klaarzetten en controleren. Met hulp van de Oranjerie. Decoratie hebben jullie bij je. Bloemen volgen vanaf 10.30. Zie bijlage Uitwerking Taken.",
    "desc": "CM zijn aanwezig op locatie, lopen alles na en zetten alles klaar, met hulp van de Oranjerie.\nZij hebben zelf ook decoratie meegekregen van Jorik eerder die week.\nWilma en Fleur doen tussen 11.00 - 11.45 een eindcontrole.\nZie bijlage Uitwerking Taken."
  },
  {
    "id": 2,
    "time": "9.00 - 9.30",
    "action": "Bruidspaar thuis, intieme setting met alleen gezin",
    "who": "",
    "desc": "Jorik komt aanrijden in Maserati en wordt boven ontvangen door de kinderen.\nFleur haalt Katinka op in de slaapkamer en brengt Katinka naar de woonkamer. We zien elkaar daar voor het eerst ❤️\nFleur en Samuel maken foto's."
  },
  {
    "id": 3,
    "time": "9.30 - 10.30",
    "action": "Bruidspaar vertrek naar Oranjerie",
    "who": "",
    "desc": "We vertrekken naar de Oranjerie. Fleur en Samuel rijden met ons mee.\nWil rijdt mee met Wilma en Rob en volgen later vanuit Den Haag.\nKatinka: NB logeerspullen, bruidsboeket, tasje, repen, water etc mee."
  },
  {
    "id": 4,
    "time": "10.30 - 11.00",
    "action": "Aankomst bruidspaar op locatie",
    "who": "De Italiaanse playlist laten spelen in de Palmenkas als welkom voor het bruidspaar, aan laten totdat jullie met alle gasten richting de haag gaan om 12.45. Wij hebben de bruidstaart bij ons.",
    "desc": "We zetten zelf de auto aan de zijkant van het pand.\nKoffie met lekkers.\nKatinka: logeerspullen, make-up etc in privé-ruimte.\nTaak CM: de Italiaanse playlist laten spelen in de Palmenkas als welkom voor het bruidspaar, aan laten totdat jullie met alle gasten richting de haag gaan om 12.45."
  },
  {
    "id": 5,
    "time": "10.45 - 11.00",
    "action": "Aankomst Wilma/Rob en Wil",
    "who": "",
    "desc": "Knuffelmoment met bruidspaar ❤️"
  },
  {
    "id": 6,
    "time": "11.00 - 13.00",
    "action": "Het bruidspaar rijdt weg van het landgoed",
    "who": "",
    "desc": "Naar een onopvallende plek.\nK: tasje, bruidsboeket, eten en drinken mee."
  },
  {
    "id": 7,
    "time": "11.00 - 12.00",
    "action": "Eindcheck door Wilma en Fleur",
    "who": "Wilma en Fleur doen een eindcheck op de decoratie.",
    "desc": "Koffie met lekkers voor Wil, Wilma en Rob. Wilma en Fleur hebben nu tijd om de decoratie te controleren, finishing touch. De CM hebben alles al klaargezet met de locatie. En rekening houden met het welkom heten van vroege gasten."
  },
  {
    "id": 8,
    "time": "12.15 - 12.45",
    "action": "Aankomst overige gasten (68 p)",
    "who": "Welkom heten en aanspreekpunt voor gasten.",
    "desc": "Koffie en lekkers.\nTaak CM: welkom heten en aanspreekpunt voor gasten."
  },
  {
    "id": 9,
    "time": "12.45 - 13.00",
    "action": "Gasten meenemen naar de haag",
    "who": "Gasten om 12.45 uur leiden naar de voorkant van 'de haag' om het bruidspaar op te wachten.",
    "desc": "Taak CM: de gasten om 12.45 uur leiden naar 'de haag' en vertellen wat de bedoeling is:\n\nalle gasten moeten om 12.55 klaar staan buiten vóór de haag aan de kant van de weg en wachten daar het bruidspaar op,\nervoor zorgen dat de naaste familie aan de kant bij de haag staan omdat zij het bruidspaar straks ook als eerste volgen.\nNB wij komen vanaf de kant rijden met de lange bochtige weg als je met je rug naar de locatie staat, de weg aan de rechterkant."
  },
  {
    "id": 10,
    "time": "13.00 - 13.05",
    "action": "Aankomst bruidspaar tot halverwege de haag",
    "who": "Aangeven dat de gasten achter de auto aan mogen lopen. De auto stopt halverwege. Daar allemaal wachten. Naaste familie altijd het meest in de buurt.",
    "desc": "Taak CM: aangeven dat de gasten achter de auto aan mogen lopen. De auto stopt halverwege. Daar allemaal wachten. Naaste familie altijd het meest in de buurt. Jorik stapt uit en houdt de autodeur voor Katinka open."
  },
  {
    "id": 11,
    "time": "13.05 - 13.15",
    "action": "Bruidspaar loopt met stoet achter zich aan naar de Oranjerie",
    "who": "Zorgen dat de gasten achter ons aanlopen. Fleur, Samuel en opa direct achter ons omdat zij naar een aparte ruimte met ons gaan.",
    "desc": "Het bruidspaar loopt richting de Oranjerie.\nTaak CM: zorgen dat de gasten achter ons aanlopen. En zorgen dat Fleur, Samuel en opa direct achter ons lopen. Zij gaan namelijk straks met ons mee naar onze privéruimte."
  },
  {
    "id": 12,
    "time": "13.15 - 13.25",
    "action": "Bruidspaar, opa, Fleur en Samuel nemen plaats in onze privé-ruimte / korte pauze",
    "who": "Zorgen dat opa, Fleur en Samuel bij het bruidspaar in de privé-ruimte zijn.",
    "desc": "Vanaf daar lopen wij ongezien met hen buiten langs om weer bij de ingang te komen."
  },
  {
    "id": 13,
    "time": "13.15 - 13.25",
    "action": "Gasten nemen hun plek in de Oranjekas",
    "who": "Aangeven dat de gasten plaats mogen nemen in de Oranjekas.\nZie stoelschikking in bijlage Uitwerking Taken — eerste 2 rijen voor hoofdgasten.\n2 stoelen achter aan de zijkant reserveren voor de CM zodat jullie goed overzicht hebben.",
    "desc": "Taak CM: aangeven dat de gasten plaats mogen nemen in de Oranjekas. Voor het bruidspaar staan vooraan twee speciale stoelen klaar. Ook zijn de eerste rijen gereserveerd voor de naaste familie. Jorik en Katinka zitten half schuin. Katinka zit aan de rechterkant van Jorik.\nFilm: Jay zet zijn camera klaar."
  },
  {
    "id": 14,
    "time": "13.15 - 13.25",
    "action": "De BABS heet de gasten welkom",
    "who": "",
    "desc": "De BABS vertelt wat nu bij de aanvang van de gasten verwacht wordt:\n\ndat de gasten op haar teken moeten gaan staan,\ndat zo het bruidspaar binnen zal komen,\ndat de gasten weer moeten gaan zitten als zij het aangeeft."
  },
  {
    "id": 15,
    "time": "13.25 - 13.27",
    "action": "Jorik wordt door zijn opa naar voren geleid",
    "who": "Zorgen dat het liedje Holy Forever afspeelt zodra Jorik met opa bij de ingang klaarstaat.",
    "desc": "Jorik en opa staan bij de deur bij de ingang van de zaal.\nAlle gasten staan.\nTaak CM: zorgen dat de muziek wordt afgespeeld als Jorik en zijn opa klaarstaan.\nJorik en opa lopen naar voren als de muziek begint. Ze blijven even samen vooraan staan, waarna opa plaats neemt op zijn gereserveerde stoel.\nJorik wacht daar vooraan staand in het midden met zijn gezicht richting de voordeur op Katinka.\nFilm: Jay filmt de gehele ceremonie vanaf het moment vlak voordat de muziek start.\nFilm ceremonie: het naar voren lopen, de ceremonie, de zegen door Derek, speech Wilma, speech Fleur tot en met lopen door haag met bloemblaadjes en felicitatiemoment.\nJorik: dit aan Jay doorgeven."
  },
  {
    "id": 16,
    "time": "13.27 - 13.30",
    "action": "Katinka wordt door Fleur en Samuel naar Jorik geleid",
    "who": "Zorgen dat het liedje Holy Forever blijft doorspelen.\nDe deuren sluiten achter Katinka.",
    "desc": "De gasten blijven staan en de muziek speelt door. Katinka: bruidsboeket en tasje bij me.\nTaak CM: zorgen dat de deuren bij de ingang achter Katinka sluiten.\nJorik en Katinka treffen elkaar vooraan en knuffelen elkaar ❤️. We blijven nog even staan, dan vervaagt de muziek, wij gaan zitten.\nDe BABS zegt dat de gasten ook moeten gaan zitten.\nTaak CM: zorgen dat de muziek stopt."
  },
  {
    "id": 17,
    "time": "13.30 - 14.00",
    "action": "Gemeentelijke huwelijksvoltrekking door BABS",
    "who": "Zorgen dat de muziek stopt zodra de BABS zegt dat iedereen kan gaan zitten.",
    "desc": "zij vertelt dat we de ouders van Katinka: Leo en Gonnie, moeten missen,\nzij vertelt ons verhaal,\nwettelijk deel en ja-woord,\nzij vraagt Sara naar voren met het doosje met de ringen,\nringen en uitspreken beloften naar elkaar,\nJorik en Katinka kussen elkaar ❤️,\nJorik en Katinka tekenen, dan de getuigen (Wil, Cor en Wilma) en daarna de BABS."
  },
  {
    "id": 18,
    "time": "13.45 - 14.45",
    "action": "Opbouw bruidstaart",
    "who": "Ervoor zorgen dat de Oranjerie weet dat de taart op een hoge, ronde tafel in het midden van de Palmenkas moet komen te staan, met een wit tafelkleed eronder.",
    "desc": "Door het locatiepersoneel wordt in de Palmenkas de bruidstaart klaargezet. Zij hebben het mobiele nummer van Matthew in geval van \"nood\". In principe hoeven de CM hier niets aan te doen, behalve zorgen dat het op de juiste tafel komt."
  },
  {
    "id": 19,
    "time": "14.00 - 14.05",
    "action": "Afronding door BABS",
    "who": "",
    "desc": "zij vertelt dat neef Derek een zegen gaat uitspreken, moeder van Jorik een dankwoord en dochter Fleur een speech,\ndat daarna iedereen moet gaan staan, mandjes met bloemen doorgeven per rij en iedereen een handje bloemen pakken,\nbloemen naar het bruidspaar werpen terwijl het bruidspaar langsloopt,\ndat het bruidspaar bij de ingang blijft staan,\ndat de gasten, te beginnen vanaf de naaste familie op de voorste rijen, naar voren moeten lopen voor kort felicitatiemoment en gelegenheid tot overhandigen cadeaus,\ndat meer gelegenheid is tot gesprekken tijdens de aansluitende receptie, daarom nu de felicitaties graag kort houden,\ndat er na het feliciteren een kwartier pauze is en dat de gasten naar de andere zaal moeten gaan voor het toostmoment met aansluitend receptie vanaf 15.00 tot 17.30."
  },
  {
    "id": 20,
    "time": "14.05 - 14.20",
    "action": "Zegen Derek, speech Wilma en speech Fleur",
    "who": "",
    "desc": "Er is een microfoon aanwezig. Jullie gaan staan op de plek van de BABS.\nBij de zegen van Derek zegt hij dat iedereen moet gaan staan. Als hij klaar is, zegt hij dat iedereen weer moet gaan zitten.\nBij de bijdragen van Wilma en Fleur blijft iedereen zitten."
  },
  {
    "id": 21,
    "time": "14.20 - 14.25",
    "action": "Bruidspaar loopt door het gangpad naar voren",
    "who": "Zorgen dat het liedje Felicitat aangaat en daarna de rest van de Italiaanse playlist.\nZorgen dat de mandjes met bloemen doorgegeven worden en dat iedereen een handje met bloemen heeft.",
    "desc": "Taak CM: zorgen dat de juiste muziek aangaat (\"Felicitat\"), daarna moet de Italiaanse playlist doorlopen.\nIedereen gaat staan. Bruidspaar loopt naar de ingang van de zaal, de gasten werpen bloemen naar hen. Dit staat in mandjes klaar bij elke rij.\nTaak CM: zorgen dat de mandjes met bloemen doorgegeven worden en dat iedereen een handje met bloemen heeft. Bruidspaar blijft nadat ze door het middenpad zijn gelopen bij de ingang staan."
  },
  {
    "id": 22,
    "time": "14.25 - 14.45",
    "action": "Felicitatiemoment",
    "who": "",
    "desc": "De gasten komen vanaf de eregasten van de voorste rijen naar de ingang van de zaal langs het bruidspaar om hen te feliciteren en cadeaus te overhandigen.\nAchter het bruidspaar staat een tafel met een mooi kisjet waarin het bruidspaar de cadeaus doen.\nNB de bloemblaadjes moeten hierna gelijk opgeruimd worden, door Wilma en Fleur."
  },
  {
    "id": 23,
    "time": "14.45 - 14.50",
    "action": "Maserati verplaatsen",
    "who": "De Maserati naar de zijkant van het gebouw rijden.",
    "desc": "De Maserati wordt naar de zijkant van het gebouw gereden. Als je met de rug naar de Oranjerie staat dan rechtsvoor op het terras.\n(Zie plattegrond)\nTaak Matthew: Maserati naar de zijkant van de Oranjerie rijden (behalve Jorik mag maar 1 ander rijden)."
  },
  {
    "id": 24,
    "time": "14.45 - 15.00",
    "action": "Gasten gaan naar de Palmenkas / bruidspaar naar privéruimte — korte pauze",
    "who": "Zorgen dat de gasten naar de Palmenkas gaan.\nZorgen dat in de Palmenkas de Italiaanse playlist aan gaat via Spotify op mobiel (vliegtuigstand) van Katinka.",
    "desc": "Bruidspaar heeft korte pauze in privéruimte.\nTaak CM: Zorgen dat de gasten naar de Palmenkas gaan.\nTaak CM: zorgen dat in de Palmenkas de Italiaanse playlist aan gaat via Spotify op mobiel (vliegtuigstand) van Katinka."
  },
  {
    "id": 25,
    "time": "15.00 - 15.30",
    "action": "Toostmoment",
    "who": "Bruidspaar komt aan in Palmenkas.\nZorgen dat Fleur en Samuel bij de bruidstaart staan.\nVertellen wat gaat gebeuren en zorgen dat alle gasten in de Palmenkas zijn, dus niet op het terras.\n\"Aansnijden bruidstaart, toost van Cor en daarna lied van vriendin Katinka (Roelfien) en gedicht Lisa. Aansluitend begint de receptie tot 17.30.\"\nMuziek uit zodra Cor begint met de toost.\nZorgen dat de muziek van Roelfien aangaat op haar signaal.\nZorgen dat nadat Lisa klaar is de Italiaanse playlist weer aan gaat.",
    "desc": "Bruidspaar komt aan in Palmenkas.\nTaak CM: vertellen wat gaat gebeuren en zorgen dat alle gasten in de Palmenkas zijn (dus niet op het terras).\n\"Aansnijden bruidstaart, toost van Cor en daarna lied van vriendin Katinka (Roelfien) en gedicht Lisa. Aansluitend begint de receptie tot 17.30.\"\nNB Er is geen microfoon voor Cor, Lisa en Roelfien.\nTaak CM: zorgen dat de Italiaanse playlist uit gaat zodra Cor gaat toosten en totdat Roelfien en Lisa ook klaar zijn. Daarna de muziek weer aan.\nTaak CM: zorgen dat de begeleidende muziek van Roelfien aan gaat.\nTaak CM: zorgen dat Fleur en Samuel naast het bruidspaar bij de bruidstaart staan.\nFilm: Jay filmt het gehele toostmoment, inclusief bijdragen Cor, Roelfien en Lisa, aansnijden van de taart, heffen van glas."
  },
  {
    "id": 26,
    "time": "15.00 - 17.30",
    "action": "Ombouw Oranjekas voor diner",
    "who": "Indien nodig beschikbaar voor het geven van aanwijzingen.\nWe laten de Oranjerie vooraf via het bijlage Uitwerking Taken zien hoe de tafels gedekt moeten worden.",
    "desc": "Tijdens de receptie wordt door het team van de Oranjerie de Oranjekas omgebouwd voor het diner.\nWe laten hen vooraf via de bijlage Uitwerking Taken zien hoe de tafels gedekt moeten worden.\nDe CM zijn indien nodig beschikbaar voor het geven van aanwijzingen.\nWilma en Fleur zijn beschikbaar voor een eindcontrole vanaf 18.00 uur als alle gasten weg zijn."
  },
  {
    "id": 27,
    "time": "15.30 - 17.30",
    "action": "Receptie + groepsfoto's",
    "who": "Bruid af en toe meeroepen zodat zij in de privéruimte iets kan eten/drinken (vragen of het personeel daar ook een paar hapjes wil neerzetten) en zich kan opfrissen.\nJorik graag ook 1 keer meenemen, zodat het bruidspaar even samen kan zijn in de privéruimte.\nHelpen fotograaf bij het bijeenroepen van mensen voor op de groepsfoto's.",
    "desc": "Taak CM: zorgen dat de Italiaanse playlist aan gaat.\nTaak CM: bruid af en toe meeroepen zodat Katinka even in de privéruimte iets kan eten/drinken (vragen of het personeel daar ook een paar hapjes wil neerzetten) en me kan opfrissen.\nKatinka's ervaring is (op bijvoorbeeld begrafenissen dat je anders moeilijk wegkomt uit gesprekken als eregast en daardoor niet aan eten/drinken/rust toekomt.)\nGraag ook 1 keer een moment dat ik samen met J even naar de privéruimte kan om even bij te praten/te knuffelen.\nTaak CM: helpen fotograaf bij het bijeenroepen van mensen voor op de groepsfoto's."
  },
  {
    "id": 28,
    "time": "17.15 - 17.20",
    "action": "Maserati verplaatsen",
    "who": "De Maserati wordt van de zijkant van het gebouw weer naar de haag gereden met de achterkant naar de Oranjerie toe (door Matthew).",
    "desc": "De Maserati wordt van de zijkant van het gebouw weer naar de haag gereden met de achterkant naar de Oranjerie toe (door Matthew)."
  },
  {
    "id": 29,
    "time": "17.25 - 17.30",
    "action": "Aankondiging einde feestelijkheden",
    "who": "De gasten het afrondende programma vertellen:\ndat de feestelijkheden om 17.30 uur ten einde zijn,\nnu gelegenheid tot toilet en verzamelen tassen/jassen,\ndat er een presentje voor hen klaarligt bij de ingang van de locatie,\ndat de gasten met hun jas etc om 17.35 uur achter het bruidspaar moeten aanlopen naar de haag,\ndat de gasten daar het bruidspaar uitzwaaien,\nen daarmee de dag ten einde is en hen gevraagd wordt om het terrein te verlaten.",
    "desc": "Taak CM: de gasten het afrondende programma vertellen:\ndat de feestelijkheden om 17.30 uur ten einde zijn,\nnu gelegenheid tot toilet en verzamelen tassen/jassen,\ndat er een presentje voor hen klaarligt bij de ingang van de locatie,\ndat de gasten met hun jas etc om 17.35 uur achter het bruidspaar moeten aanlopen naar de haag,\ndat de gasten daar het bruidspaar uitzwaaien,\nen daarmee de dag ten einde is en hen gevraagd wordt om het terrein te verlaten."
  },
  {
    "id": 30,
    "time": "17.30 - 17.45",
    "action": "Einde receptie en uitzwaaien bruidspaar",
    "who": "Zorgen dat gasten met hun spullen achter het bruidspaar aan lopen.\nUitzwaaien bruidspaar bij de \"haag\".",
    "desc": "Taak CM: Zorgen dat gasten weten dat ze achter het bruidspaar aan moeten lopen om hen uit te zwaaien en dat geen mensen achterblijven. Alleen de naaste familie blijft.\nKatinka: tasje en bloemen mee."
  },
  {
    "id": 31,
    "time": "17.45 - 18.00",
    "action": "Wegrijden receptiegasten",
    "who": "Zorgen dat iedereen rond 18.00 van het terrein is.\nTijd is nodig voor decoratie dinertafels + tafelschikking. Zie bijlage Uitwerking Taken.\nOok even rust voor de naaste familie.\nEn het bruidspaar heeft van 18.00 - 18.30 een fotoshoot op het terrein.",
    "desc": "Taak CM: zorgen dat iedereen rond 18.00 van het terrein is. Zo hebben F/W tijd om de dinertafels in de Oranjezaal te controleren. Ook even rust voor de naaste familie.\nHet bruidspaar komt om 18.00 terug voor een fotoshoot met de fotograaf, dan moeten de gasten dus echt weg zijn."
  },
  {
    "id": 32,
    "time": "18.00 - 18.30",
    "action": "Eindcontrole dinertafels en pauze voor naaste familie",
    "who": "Samen met Wilma en Fleur eindcontrole op dinertafels incl. tafelschikking.",
    "desc": "Fleur en Wilma hebben tijd voor de eindcontrole van de Oranjekas (dinertafel) inclusief tafelschikking.\nWij komen om 18.00 terug voor een fotoshoot met de fotograaf."
  },
  {
    "id": 33,
    "time": "18.00 - 18.30",
    "action": "Bruidspaar komt weer terugrijden + fotoshoot fotograaf",
    "who": "",
    "desc": "Zetten Maserati zelf bij de zijkant van het gebouw. Tijd voor fotoshoot met fotograaf. Familie wacht op hen in de Palmenkas. Zij gaan daarna met het bruidspaar voorop samen naar de Oranjekas."
  },
  {
    "id": 34,
    "time": "18.30 - 20.30",
    "action": "Shared dining met naaste familie",
    "who": "Zorgen dat de Italiaanse playlist op staat.",
    "desc": "20p\nTaak CM: Italiaanse playlist op zetten."
  },
  {
    "id": 35,
    "time": "20.30 - 20.45",
    "action": "Afscheid en uitzwaaien",
    "who": "Zorgen dat dit afscheid om 20.45 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden.",
    "desc": "Taak CM: ervoor zorgen dat dit afscheid om 20.45 klaar is, we zullen allemaal moe genoeg zijn en er moet ook nog opgeruimd worden.\nJorik/Katinka: NB logeerkoffers, persoonlijk tasje, cadeaus mee."
  },
  {
    "id": 36,
    "time": "20.45 - 21.15",
    "action": "Opruimen",
    "who": "Alles opruimen, met hulp van locatie, Fleur, Samuel, Wilma en Wil. Zorgen dat alles mee naar huis gaat wat van ons is.\nZie bijlage Uitwerking Taken.",
    "desc": "Fleur, Wilma, Samuel, Wil en de CM moeten nu alles opruimen. De Oranjerie helpt hierbij.\nNB zorgen dat alles mee naar huis gaat wat van ons is, zie daarvoor ook de bijlage Uitwerking Taken."
  }
];

const photographerTasks = [
  {
    "id": 1,
    "time": "9.30 - 11.00",
    "action": "Setup at the venue",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse/Orange Greenhouse/Terrace/Garden and Parking Lot"
  },
  {
    "id": 2,
    "time": "9.00 - 9.30",
    "action": "The bride and groom at home with their family",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "At Home in Rijswijk"
  },
  {
    "id": 3,
    "time": "9.30 - 10.30",
    "action": "The bride and groom on their way to the Oranjerie",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Travel Time"
  },
  {
    "id": 4,
    "time": "10.30 - 11.00",
    "action": "Arrival of the bride and groom",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse/Terrace/Private Area"
  },
  {
    "id": 5,
    "time": "10.45 - 11.00",
    "action": "Arrival of Wilma/Rob and Wil",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 6,
    "time": "11.00 - 12.00",
    "action": "Final check by Wilma and Fleur",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse/Orange Greenhouse/Terrace/Garden and Parking Lot"
  },
  {
    "id": 7,
    "time": "12.00 - 12.15",
    "action": "Arrival of the photographer",
    "photographer": "12:00 PM Photographer arrives\n*Setup time and lunch.",
    "attachments": "Parking Information\nAddress: Oranjerie Hydepark Doorn \nDriebergsestraatweg 50 \n3941 ZX Doorn \n \nFrom Utrecht Central Station: \n30 minutes by car, 40 minutes by bus, 1 hour by bike. \nWe will reimburse travel expenses. \n\nContact Information\nDerek: 06 - 40 83 03 61\nMatthew: 06 - 45 43 20 39\nAudra: 06 - 27 59 13 63\nLocation Manager: to be announced on the day",
    "location": ""
  },
  {
    "id": 8,
    "time": "11.30 - 11.45",
    "action": "The bride and groom leave the Oranjerie",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Travel time"
  },
  {
    "id": 9,
    "time": "12.15 - 12.45",
    "action": "Arrival of the remaining guests (68 people)",
    "photographer": "If time permits: photos of the surroundings and the building\n*Photos of the rooms, the building, and the surroundings.",
    "attachments": "Important people \n\n1st priority (see profile photos)\n*Fleur: daughter \n*Samuel: son \n*Leo and Gonnie: Katinka’s parents, deceased—we want to be photographed holding their photo  \n*Wilma: Jorik’s mother \n*Cor: Jorik’s father \n*Grandpa: Jorik’s grandfather \n\n2nd priority (see profile photos)\n*Lisa: Jorik’s sister \n*Wil: Katinka’s aunt \n*Sara: Jorik’s half-sister\n*Rob: stepfather \n*Anca: stepmother \n*Arthur: stepbrother \n*Rinske: Katinka’s sister \n\n\nGeneral\nAll other guests",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 10,
    "time": "13.00 - 13.10",
    "action": "Arrival of the civil officiant",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": ""
  },
  {
    "id": 11,
    "time": "12.45 - 13.00",
    "action": "Escorting guests to ‘The hedge’",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Outside by ‘The hedge’"
  },
  {
    "id": 12,
    "time": "13.00 - 13.05",
    "action": "Arrival of the bride and groom at ‘The hedge’",
    "photographer": "Photos of the arrival at ‘The hedge’\n*The car from the front as the bride and groom drive up,\n*The car with the guests gathered around it in ‘The hedge’ with the Orangery in the background,\n*Jorik helping Katinka out of the car.",
    "attachments": "",
    "location": "Outside by ‘The hedge’"
  },
  {
    "id": 13,
    "time": "13.05 - 13.15",
    "action": "Procession to the Oranjerie",
    "photographer": "Procession\n*Of the bride and groom with the procession following behind them as they walk to the Orangery (photos from both the front and the back).",
    "attachments": "",
    "location": "Walking to the Orangery"
  },
  {
    "id": 14,
    "time": "13.15 - 13.25",
    "action": "Private room and break",
    "photographer": "Taking photos of guests and the atmosphere\n*Photos of the guests in attendance,\n*Close-up shots of the venue or decorations.",
    "attachments": "",
    "location": "Private area"
  },
  {
    "id": 15,
    "time": "13.15 - 13.25",
    "action": "Guests take their seats in the Oranjekas",
    "photographer": "Taking photos of guests and the atmosphere\n*Photos of the guests in attendance,\n*Close-up shots of the venue or decorations.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 16,
    "time": "13.15 - 13.25",
    "action": "Welcome by the civil officiant",
    "photographer": "Taking photos of the event\n*Photos of the venue,\n*Photos of the guests/setting.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 17,
    "time": "13.25 - 13.27",
    "action": "Entrance of Jorik with his grandfather",
    "photographer": "Jorik walks to the front\n*Jorik walking to the front with his grandfather,\n*Jorik standing at the front with his grandfather,\n*Jorik standing alone at the front, facing the entrance, waiting for Katinka.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 18,
    "time": "13.27 - 13.30",
    "action": "Entrance of Katinka with Fleur and Samuel",
    "photographer": "Lead Katinka to the front\n*Of Katinka walking toward Jorik with her children,\n*Of Jorik and Katinka meeting at the front and hugging,\n*Of Jorik and Katinka standing together at the front.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 19,
    "time": "13.30 - 14.00",
    "action": "Wedding ceremony",
    "photographer": "Ceremony \n*Jorik and Katinka during the ceremony,\n*The exchange of vows,\n*Sara bringing the rings,\n*The exchange of rings,\n*The exchange of vows,\n*The kiss,\n*The signing by the bride and groom, the witnesses, and the officiant.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 20,
    "time": "13.45 - 14.45",
    "action": "Setting up the wedding cake",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse"
  },
  {
    "id": 21,
    "time": "14.00 - 14.05",
    "action": "Closing remarks by the officiant",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Orange Greenhouse"
  },
  {
    "id": 22,
    "time": "14.05 - 14.20",
    "action": "Blessing and speeches",
    "photographer": "Speeches\n*By Jorik and Katinka during Derek's blessing, during Wilma's speech, and during Fleur's speech, \n*Also photos of Derek, Wilma, and Fleur.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 23,
    "time": "14.20 - 14.25",
    "action": "Flower tribute",
    "photographer": "Path lined with flowers\n*The bride and groom walk down the path toward the entrance while everyone scatters flower petals.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 24,
    "time": "14.25 - 14.45",
    "action": "Congratulations",
    "photographer": "Congratulations\n*A glimpse of the celebration.",
    "attachments": "",
    "location": "Orange Greenhouse"
  },
  {
    "id": 25,
    "time": "14.35 - 14.50",
    "action": "Moving the Maserati",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Side of the Orangery"
  },
  {
    "id": 26,
    "time": "14.45 - 15.00",
    "action": "To the Palm House and short break",
    "photographer": "Taking photos of guests and the atmosphere\n*Photos of the guests in attendance,\n*Close-up shots of the venue or decorations.",
    "attachments": "",
    "location": "Palm Greenhouse/Private Area"
  },
  {
    "id": 27,
    "time": "15.00 - 15.30",
    "action": "Toast",
    "photographer": "Toast \n*of cutting the cake,\n*of Cor's speech,\n*of Roelfien's song,\n*of Lisa's poem.",
    "attachments": "",
    "location": "Palm Greenhouse"
  },
  {
    "id": 28,
    "time": "15.00 - 17.30",
    "action": "Rearranging the Oranjekas for dinner",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Oranje Greenhouse"
  },
  {
    "id": 29,
    "time": "15.30 - 16.00",
    "action": "Group photos",
    "photographer": "Group photos 3:30–4:00 p.m.\n*30–40 min\n*Masters of ceremonies will help organize the groups.",
    "attachments": "Wedding couple photos \n*Wedding couple alone \n*With Fleur and Samuel \n*Parents from both sides: Wilma and Cor & Leo and Gonnie photo \n*Mekking family: Grandpa, Wilma, Rob, Arthur, Lisa, Jai, Fleur, and Samuel  \n*Prins family: Cor, Anca, Sara, Lisa, Jai, Fleur, and Samuel  \n*With the Uiterwijk family: Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*With the masters of ceremonies \n \nJorik photos \n*With parents: Wilma and Cor \n*With Grandpa \n*With sisters Lisa, Sara \n*With the Mekking family and their partners \n*With the Prins family and their partners \n*With a group of friends  \n \nKatinka photos \n*With Wil \n*With Rinske \n*Katinka, Fleur, Samuel, Wil, Rinske, Emma, Anna, Jet \n*Uiterwijk family: Katinka, Fleur, Samuel, Rinske, Emma, Anna, Jet, Norbert with wife, Jurjen with wife \n*The Herlaar family: Katinka, Fleur, Samuel, Rinske, Emma, Anna, Jet, Wil, Lize, Monique, Sander, Erwin, and Anja \n*With colleagues \n*With Karima \n*With Suzanne \n\nEnd \n*All guests present",
    "location": "Palm Greenhouse/Terrace"
  },
  {
    "id": 30,
    "time": "16.00 - 17.30",
    "action": "Reception",
    "photographer": "Reception 4:00 PM – 5:30 PM\n*A glimpse of the atmosphere",
    "attachments": "",
    "location": ""
  },
  {
    "id": 31,
    "time": "17.15 - 17.20",
    "action": "Moving the Maserati",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Outside by ‘The hedge’"
  },
  {
    "id": 32,
    "time": "17.25 - 17.30",
    "action": "Announcement of the end of the festivities",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": ""
  },
  {
    "id": 33,
    "time": "17.30 - 17.45",
    "action": "End of the reception and seeing off the bride and groom",
    "photographer": "Seeing them off\n*The bride and groom with their wedding procession behind them, shot from the front so you can also see the Orangery.",
    "attachments": "",
    "location": "‘The hedge’ outside"
  },
  {
    "id": 34,
    "time": "17.45 - 18.00",
    "action": "Departure of reception guests",
    "photographer": "Taking photos of guests and the atmosphere\n*Photos of guests leaving.",
    "attachments": "",
    "location": "‘The hedge’ outside/parking lot"
  },
  {
    "id": 35,
    "time": "18.00 - 18.30",
    "action": "Final check of dinner tables and break",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Oranje Greenhouse/Palm Greenhouse/Terrace"
  },
  {
    "id": 36,
    "time": "18.00 - 18.30",
    "action": "Photo shoot with the bride and groom",
    "photographer": "Photographing the bride and groom\n*Photos of the bride and groom in ‘The hedge’,\n*Photos of the bride and groom taken from a distance by the fountain with the building as a backdrop,\n*Photos of the bride and groom standing at an angle in front of the building,\n*Photos of the bride and groom at the entrance,\n*Photos of the bride and groom at the entrance with the garden as a backdrop.",
    "attachments": "",
    "location": "Palm greenhouse/Terrace"
  },
  {
    "id": 37,
    "time": "18.30 - 20.30",
    "action": "Shared dining with close family",
    "photographer": "Shared dining\n*Atmosphere pictures will be taken during the first half hour while dining.",
    "attachments": "",
    "location": "Oranje Greenhouse"
  },
  {
    "id": 38,
    "time": "20.30 - 20.45",
    "action": "Farewells and seeing off",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Terrace"
  },
  {
    "id": 39,
    "time": "20.45 - 21.15",
    "action": "Cleanup",
    "photographer": "for your information",
    "attachments": "for your information",
    "location": "Palm Greenhouse/Oranje Greenhouse/Terrace and parking lot"
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
  
  // Real-time Firebase Presence Counter
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [showPresenceHistory, setShowPresenceHistory] = useState(false);

  // --- Support States ---
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Probleem met design / lay-out');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);



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

  const handleStartLiveChat = () => {
    // Close the help modal so it doesn't overlay the chat window
    setShowHelpModal(false);

    const anyWindow = window as any;
    if (anyWindow.Tawk_API && typeof anyWindow.Tawk_API.showWidget === 'function') {
      anyWindow.Tawk_API.showWidget();
      anyWindow.Tawk_API.maximize();
    } else {
      anyWindow.Tawk_API = anyWindow.Tawk_API || {};
      anyWindow.Tawk_LoadStart = new Date();
      
      anyWindow.Tawk_API.onLoad = function() {
        if (anyWindow.Tawk_API && typeof anyWindow.Tawk_API.hideWidget === 'function') {
          anyWindow.Tawk_API.hideWidget();
          anyWindow.Tawk_API.maximize();
        }
      };

      anyWindow.Tawk_API.onChatMinimized = function() {
        if (anyWindow.Tawk_API && typeof anyWindow.Tawk_API.hideWidget === 'function') {
          anyWindow.Tawk_API.hideWidget();
        }
      };
      
      anyWindow.Tawk_API.onChatHidden = function() {
        if (anyWindow.Tawk_API && typeof anyWindow.Tawk_API.hideWidget === 'function') {
          anyWindow.Tawk_API.hideWidget();
        }
      };

      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0] || document.head;
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6a148db2d9e5ba1c3421fc36/1jpg4j0ro';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode?.insertBefore(s1, s0);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportEmail.trim() || !supportMessage.trim()) return;
    
    setIsSendingSupport(true);

    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xvzywpaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          category: supportCategory,
          message: supportMessage
        })
      });

      if (!response.ok) {
        throw new Error('Formspree response not ok');
      }

      setIsSendingSupport(false);
      setSupportSuccess(true);
      setSupportMessage('');
      setSupportEmail('');
    } catch (err) {
      console.error('Formspree connection error:', err);
      alert(langEN ? "Connection error with Formspree. Please try again." : "Verbindingsfout met Formspree. Probeer het opnieuw.");
      setIsSendingSupport(false);
    }
  };



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
  const [guestFilter, setGuestFilter] = useState('All');

  const getFloorPlanImage = () => {
    if (role === 'photographer') return '/plattegrond_fotograaf.jpg';
    if (role === 'cm') return '/plattegrond_cm.jpg';
    return '/plattegrond_gasten.jpg';
  };

  const guestDirectoryData = [
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
    },
    { 
      id: 3, 
      firstName: "Fleur", 
      relationship: langEN ? "Daughter of Jorik & Katinka" : "Dochter van Jorik & Katinka", 
      group: "1st priority", 
      initials: "F", 
      photo: "/jpegs/J&K - Daugther Fleur.jpg" 
    },
    { 
      id: 4, 
      firstName: "Samuel", 
      relationship: langEN ? "Son of Jorik & Katinka" : "Zoon van Jorik & Katinka", 
      group: "1st priority", 
      initials: "S", 
      photo: "/jpegs/J&K - Son Samuel.jpg" 
    },
    { 
      id: 5, 
      firstName: "Leo and Gonnie", 
      relationship: langEN ? "Father and mother of Katinka (deceased)" : "Vader en moeder van Katinka (overleden)", 
      group: "1st priority", 
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
      group: "1st priority", 
      initials: "W", 
      photo: "/jpegs/Jorik - Mother Wilma.jpg" 
    },
    { 
      id: 7, 
      firstName: "Cor", 
      relationship: langEN ? "Father of Jorik" : "Vader van Jorik", 
      group: "1st priority", 
      initials: "C", 
      photo: "/jpegs/Jorik - Father Cornelis.jpg" 
    },
    { 
      id: 8, 
      firstName: "Grandpa", 
      relationship: langEN ? "Grandfather of Jorik" : "Opa van Jorik", 
      group: "1st priority", 
      initials: "G", 
      photo: "/jpegs/Jorik - Grandpa.jpg" 
    },
    { 
      id: 9, 
      firstName: "Lisa", 
      relationship: langEN ? "Sister of Jorik" : "Zus van Jorik", 
      group: "1st priority", 
      initials: "L", 
      photo: "/jpegs/Jorik - Sister Lisa.jpg" 
    },
    { 
      id: 10, 
      firstName: "Wil", 
      relationship: langEN ? "Aunt of Katinka" : "Tante van Katinka", 
      group: "2nd priority", 
      initials: "W", 
      photo: "/jpegs/Katinka - Aunt Wil.jpg" 
    },
    { 
      id: 11, 
      firstName: "Sara", 
      relationship: langEN ? "Sister of Jorik" : "Zus van Jorik", 
      group: "2nd priority", 
      initials: "S", 
      photo: "/jpegs/Jorik - Sister Sara.jpg" 
    },
    { 
      id: 12, 
      firstName: "Rob", 
      relationship: langEN ? "Stepfather of Jorik" : "Stiefvader van Jorik", 
      group: "2nd priority", 
      initials: "R", 
      photo: "/jpegs/Jorik - Step father Rob.jpg" 
    },
    { 
      id: 13, 
      firstName: "Anca", 
      relationship: langEN ? "Stepmother of Jorik" : "Stiefmoeder van Jorik", 
      group: "2nd priority", 
      initials: "A", 
      photo: "/jpegs/Jorik - Step mother Anca.jpg" 
    },
    { 
      id: 15, 
      firstName: "Rinske", 
      relationship: langEN ? "Sister of Katinka" : "Zus van Katinka", 
      group: "2nd priority", 
      initials: "R", 
      photo: "/jpegs/Katinka - Sister Rinske.jpg" 
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
    ...(role === 'photographer' ? [] : [{ id: 'programma', icon: <Calendar size={20}/>, label: langEN ? 'Schedule' : 'Programma' }]),
    { id: 'locatie', icon: <MapPin size={20}/>, label: langEN ? 'Parking Location' : 'Parkeerlocatie' },
    { id: 'plattegrond', icon: <MapIcon size={20}/>, label: langEN ? 'Map' : 'Plattegrond' },

    { id: 'extra', icon: <Zap size={20}/>, label: 'Extra' }
  ];

  if (role === 'cm' || role === 'photographer') {
    pages.splice(3, 0, { id: 'cm', icon: <Filter size={20}/>, label: langEN ? 'Photographer Tasks' : 'CM Takenlijst' });
  }

  if (role === 'photographer') {
    pages.splice(4, 0, { id: 'moodboard', icon: <Image size={20}/>, label: 'Moodboard' });
    pages.splice(5, 0, { id: 'gasten', icon: <Camera size={20}/>, label: langEN ? 'Guest Directory' : 'Fotolijst' });
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
            <span className="hidden md:block">Jorik&<br/>Katinka</span>
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
                      <Trash2 size={12} />
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
                      <Trash2 size={12} />
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
                    src="/cover_foto.jpg" 
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
                  <button onClick={() => setActiveTab('programma')} className="bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:py-10">
                    <div className="bg-[#c7b272]/10 dark:bg-[#c7b272]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Calendar className="text-[#c7b272]" size={24} /></div>
                    <h3 className="font-serif font-bold text-[#1A1A2E] dark:text-slate-100 text-lg md:text-xl mb-1">{langEN ? 'Schedule' : 'Programma'}</h3>
                    <p className="text-xs md:text-sm text-[#666666] dark:text-slate-400">{langEN ? 'View the timeline' : 'Bekijk de hele dag'}</p>
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
                    <button 
                      onClick={() => handleDismissPage('programma')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
                    </button>
                    <button onClick={(e) => togglePin('programma', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('programma') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 font-medium bg-[#c7b272]/5 dark:bg-[#c7b272]/10 px-4 py-3 rounded-2xl border border-[#c7b272]/10 flex items-center gap-2.5">
                  <Info size={16} className="text-[#c7b272] shrink-0" />
                  <span>{langEN ? 'Tip: Tap a program item for details' : 'Tip: Tik op een programma-onderdeel voor details'}</span>
                </p>

                <div className="space-y-0 relative">
                  {scheduleData.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setExpandedScheduleItem(expandedScheduleItem === item.id ? null : item.id)}
                      className="group relative cursor-pointer py-6 border-b border-[#1A1A2E]/5 dark:border-white/5 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/20 -mx-6 px-6 rounded-2xl"
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                        <div className="text-[#c7b272] font-semibold text-sm md:text-base tracking-widest shrink-0 w-32 font-mono">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl md:text-2xl font-medium text-[#1A1A2E] dark:text-slate-100 flex justify-between items-center group">
                            {item.title}
                            <ChevronRight size={18} className={`text-[#c7b272] transition-transform duration-300 ${expandedScheduleItem === item.id ? 'rotate-90' : 'opacity-60 group-hover:opacity-100'}`} />
                          </h3>
                          
                          <div className="flex items-center text-xs text-[#666666] dark:text-slate-400 font-medium tracking-wide mt-1.5 gap-1">
                            <MapPin size={12} className="text-[#c7b272] shrink-0" />
                            <span>{item.location}</span>
                          </div>

                          <AnimatePresence>
                            {expandedScheduleItem === item.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 pb-2">
                                  {item.desc ? (
                                    <p className="text-[#666666] dark:text-slate-400 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{item.desc}</p>
                                  ) : (
                                    <p className="text-gray-400 dark:text-slate-500 italic text-sm">{langEN ? 'No additional details.' : 'Geen extra details beschikbaar.'}</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                    <button 
                      onClick={() => handleDismissPage('locatie')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
                    </button>
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
                    <button 
                      onClick={() => handleDismissPage('plattegrond')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
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
                    <button 
                      onClick={() => handleDismissPage('cm')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
                    </button>
                    <button onClick={(e) => togglePin('cm', e)} className="md:hidden flex items-center gap-2 text-xs font-bold text-[#c7b272] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                      {pinnedPages.includes('cm') ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                  </div>
                </div>
                {role === 'photographer' ? (
                  /* PHOTOGRAPHER PROGRAM (SCHEDULE STYLE) */
                  <div className="space-y-0 relative">
                    {photographerTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="py-6 border-b border-[#1A1A2E]/5 dark:border-white/5 -mx-6 px-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                          <div className="text-[#c7b272] font-semibold text-sm md:text-base tracking-widest shrink-0 w-32 font-mono">
                            {task.time}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-xl md:text-2xl font-medium text-[#1A1A2E] dark:text-slate-100">
                              {task.action}
                            </h3>
                            
                            {task.location && (
                              <div className="flex items-center text-xs text-[#666666] dark:text-slate-400 font-medium tracking-wide mt-1.5 gap-1">
                                <MapPin size={12} className="text-[#c7b272] shrink-0" />
                                <span>{task.location}</span>
                              </div>
                            )}

                            {task.photographer && (
                              <p className="mt-2 text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                                {task.photographer}
                              </p>
                            )}

                            {task.attachments && task.attachments !== "for your information" && (
                              <div className="mt-3">
                                <button
                                  onClick={() => setExpandedPhotoTask(expandedPhotoTask === task.id ? null : task.id)}
                                  className="flex items-center gap-1.5 text-xs font-bold text-[#c7b272] hover:text-[#b8a15f] cursor-pointer focus:outline-none bg-[#c7b272]/5 hover:bg-[#c7b272]/10 px-3 py-1.5 rounded-xl border border-[#c7b272]/15 transition"
                                >
                                  <span>{langEN ? 'Attachment' : 'Bijlage'}</span>
                                  <ChevronRight 
                                    size={12} 
                                    className={`transition-transform duration-300 ${expandedPhotoTask === task.id ? 'rotate-90' : ''}`} 
                                  />
                                </button>
                                <AnimatePresence>
                                  {expandedPhotoTask === task.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-2 text-xs text-gray-600 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-pre-wrap leading-relaxed">
                                        {task.attachments}
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
                  /* CM TAKENLIST (ORIGINAL STYLE) */
                  <div className="space-y-6">
                    {cmTasksData.filter(task => !!task.who?.trim()).map(task => {
                      // Extract roles based on mentions in text
                      const fullText = (task.action + ' ' + task.who + ' ' + task.desc).toLowerCase();
                      const roles: string[] = [];
                      if (fullText.includes('cm') || fullText.includes('ceremoniemeester')) roles.push('CM');
                      if (fullText.includes('jorik') || fullText.includes(' j ')) roles.push('J');
                      if (fullText.includes('katinka') || fullText.includes(' k ')) roles.push('K');
                      if (fullText.includes('fleur') || fullText.includes('samuel') || fullText.includes('f/s')) roles.push('F/S');
                      if (fullText.includes('wilma') || fullText.includes(' w ')) roles.push('W');
                      // Always add CM as it is the CM tab and they are generally involved if it's in this list,
                      // but we strictly follow mentions if requested, however 'CM' is mostly implied.
                      if (roles.length === 0) roles.push('CM');

                      return (
                        <div key={task.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 border-l-[6px] border-[#c7b272] flex flex-col hover:shadow-md transition">
                          <span className="text-[#c7b272] text-xs md:text-sm font-bold font-mono bg-[#c7b272]/10 w-fit px-3 py-1 rounded-md mb-3">{task.time}</span>
                          <h4 className="font-bold text-[#1A1A2E] dark:text-slate-100 text-lg mb-2">{task.action}</h4>
                          
                          <div className="mb-4 text-sm text-gray-800 dark:text-slate-200 font-medium leading-relaxed">
                            <span className="whitespace-pre-wrap">{task.who}</span>
                          </div>

                          {task.desc && (
                            <details className="text-sm group">
                              <summary className="cursor-pointer text-gray-500 hover:text-[#c7b272] font-medium transition-colors outline-none pb-1">
                                {langEN ? 'Show additional context' : 'Toon aanvullende context'}
                              </summary>
                              <div className="mt-2 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                                <span className="whitespace-pre-wrap">{task.desc}</span>
                              </div>
                            </details>
                          )}

                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                            <div className="flex flex-wrap gap-1.5">
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
                    <button 
                      onClick={() => handleDismissPage('moodboard')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
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
                      src="/moodboard.jpg" 
                      alt="Wedding Moodboard" 
                      className="w-full h-auto object-contain max-h-[80vh] mx-auto rounded-2xl"
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
                    <button 
                      onClick={() => handleDismissPage('gasten')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
                    </button>
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
                    {['All', '1st priority', '2nd priority', 'Master of ceremony'].map((cat) => {
                      const labelMap: Record<string, string> = {
                        'All': langEN ? 'All' : 'Alles',
                        '1st priority': langEN ? '1st priority' : '1e prioriteit',
                        '2nd priority': langEN ? '2nd priority' : '2e prioriteit',
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuests.map((guest) => (
                      <div 
                        key={guest.id}
                        className="bg-white dark:bg-slate-900 border border-[#1A1A2E]/5 dark:border-white/5 p-5 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex items-center gap-4 group font-sans"
                      >
                        {/* Profile Picture Frame */}
                        <div className="relative w-16 h-16 shrink-0 rounded-full bg-gradient-to-tr from-[#1A1A2E] via-[#c7b272]/30 to-[#c7b272] p-[1.5px] shadow-sm group-hover:rotate-6 transition-transform duration-300">
                          <div className="w-full h-full rounded-full bg-[#F5F0E6] dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
                            <span className="absolute text-[#1A1A2E] dark:text-[#c7b272] font-serif font-bold text-lg select-none">
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
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-serif font-semibold text-lg md:text-xl text-[#1A1A2E] dark:text-slate-100 truncate">
                            {guest.firstName}
                          </h3>
                          <p className="text-xs text-[#666666] dark:text-slate-400 italic mt-0.5 leading-snug">
                            {guest.relationship}
                          </p>
                          {guest.mobile && (
                            <p className="text-[11px] text-[#c7b272] font-semibold font-mono mt-1">
                              {guest.mobile}
                            </p>
                          )}
                          {guest.note && (
                            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">
                              {guest.note}
                            </p>
                          )}
                          <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-widest text-[#c7b272] bg-[#c7b272]/10 px-2 py-0.5 rounded">
                            {guest.group === '1st priority' ? (langEN ? '1st priority' : '1e prioriteit') :
                             guest.group === '2nd priority' ? (langEN ? '2nd priority' : '2e prioriteit') :
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
                    <button 
                      onClick={() => handleDismissPage('extra')}
                      className="text-[11px] text-red-500/60 hover:text-red-600 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                      title={langEN ? "Don't show this page again" : "Ik wil dit niet meer zien."}
                    >
                      <Trash2 size={12}/>
                      <span>{langEN ? "Hide page" : "Ik wil dit niet meer zien."}</span>
                    </button>
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
                            <Trash2 size={12} />
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
                            <Trash2 size={12} />
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
                  src="/moodboard.jpg" 
                  alt="Moodboard Fullscreen" 
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
      {!isFloatingChatOpen && !isInboxDismissed && (
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
            {(!inboxRead || (role === 'photographer' && !dismissedNotifications.includes('photo_priority') && !readNotifications.includes('photo_priority')) || (role === 'cm' && !dismissedNotifications.includes('cm_maserati') && !readNotifications.includes('cm_maserati')) || (role === 'guest' && !dismissedNotifications.includes('guest_parking') && !readNotifications.includes('guest_parking'))) && (
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
                    onClick={handleDismissInbox}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                    title={langEN ? "Hide entire Inbox feature" : "Verberg postvak volledig"}
                  >
                    <Trash2 size={18} />
                  </button>
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
                      title: '1st Priority Photography',
                      content: 'Prioriteit 1 gasten moeten vandaag absoluut gefotografeerd worden: Fleur, Samuel, Cor, Wilma, Opa, en een foto vasthoudend van Leo & Gonnie.',
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
                      content: "Je dashboard toont automatisch de fotorelevante plattegrond via '/plattegrond_fotograaf.jpg'.",
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
                    }
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
                            setActiveTab(n.targetTab);
                            setShowInboxPopup(false);
                            if (n.isChatTrigger) {
                              setIsFloatingChatOpen(true);
                              scrollToBottom();
                            }
                          }}
                          className="text-[10px] font-bold text-[#c7b272] hover:text-[#b8a15f] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {langEN ? 'Bring me here →' : 'Breng me hierheen →'}
                        </button>
                        <button
                          onClick={() => handleDismissNotification(n.id)}
                          className="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          {langEN ? 'Don\'t show this again' : 'Ik wil dit niet meer zien.'}
                        </button>
                      </div>
                    </div>
                  ));
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
                  }}
                  className="p-2 text-[#1A1A2E]/50 dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-slate-100 hover:bg-[#1A1A2E]/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Panel */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 scrollbar-thin">
                {supportSuccess ? (
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
                        setShowHelpModal(false);
                      }}
                      className="bg-[#c7b272] hover:bg-[#b8a15f] text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      {langEN ? 'Close' : 'Sluiten'}
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
                        {langEN ? 'Your Email' : 'Je e-mailadres'}
                      </label>
                      <input
                        type="email"
                        required
                        value={supportEmail}
                        onChange={e => setSupportEmail(e.target.value)}
                        placeholder={langEN ? 'Enter your email...' : 'Vul je e-mailadres in...'}
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
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center shrink-0">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 font-medium">
                      {langEN ? 'Prefer real-time human contact?' : 'Liever direct menselijk contact?'}
                    </p>
                    <button
                      type="button"
                      onClick={handleStartLiveChat}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c7b272]/10 hover:bg-[#c7b272]/20 text-[#c7b272] border border-[#c7b272]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      {langEN ? 'Start Live Chat' : 'Start Live Chat'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
