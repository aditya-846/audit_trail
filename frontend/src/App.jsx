import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Thermometer, 
  History, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Anchor, 
  Truck, 
  Layers,
  Database,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://127.0.0.1:5000/api/shipments';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [shipmentState, setShipmentState] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Time-travel state scrubbing
  const [scrubIndex, setScrubIndex] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubbedState, setScrubbedState] = useState(null);

  // Forms state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newTemp, setNewTemp] = useState('');
  
  const [moveLocation, setMoveLocation] = useState('');
  const [moveStatus, setMoveStatus] = useState('IN_TRANSIT');
  const [moveVessel, setMoveVessel] = useState('');
  
  const [tempUpdate, setTempUpdate] = useState('');
  
  const [occConflict, setOccConflict] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all shipments
  const fetchShipments = async (query = '') => {
    try {
      const res = await fetch(`${API_BASE}?search=${query}`);
      const data = await res.json();
      if (data.shipments) {
        setShipments(data.shipments);
        if (data.shipments.length > 0 && !selectedId) {
          setSelectedId(data.shipments[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
    }
  };

  // Fetch active shipment details & events
  const fetchActiveShipment = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setOccConflict(null);
    try {
      // 1. Fetch current state
      const stateRes = await fetch(`${API_BASE}/${id}`);
      if (!stateRes.ok) throw new Error('Shipment not found');
      const stateData = await stateRes.json();
      setShipmentState(stateData);

      // 2. Fetch raw events
      const eventsRes = await fetch(`${API_BASE}/${id}/events`);
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);
      
      // Reset scrubber to current state (maximum index)
      setScrubIndex(eventsData.events ? eventsData.events.length : 0);
      setIsScrubbing(false);
      setScrubbedState(null);
    } catch (err) {
      setError(err.message);
      setShipmentState(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchActiveShipment(selectedId);
    }
  }, [selectedId]);

  // Handle Search Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    fetchShipments(e.target.value);
  };

  // Handle Scrubbing Slider Change
  const handleScrubChange = async (e) => {
    const index = parseInt(e.target.value, 10);
    setScrubIndex(index);
    setOccConflict(null);
    
    if (index === events.length) {
      // Returned to real-time state
      setIsScrubbing(false);
      setScrubbedState(null);
    } else {
      setIsScrubbing(true);
      if (index === 0) {
        // Initial state before any events
        setScrubbedState({
          id: selectedId,
          currentStatus: 'PENDING',
          location: 'UNKNOWN',
          temperature: null,
          version: 0,
          lastUpdated: null
        });
      } else {
        // Query state as of the event's timestamp
        const targetEvent = events[index - 1];
        try {
          const res = await fetch(`${API_BASE}/${selectedId}?asOf=${targetEvent.timestamp}`);
          const data = await res.json();
          setScrubbedState(data);
        } catch (err) {
          console.error('Error fetching time travel state:', err);
        }
      }
    }
  };

  // Submit Command
  const submitCommand = async (type, payload, expectedVersion) => {
    setOccConflict(null);
    setSuccessMsg('');
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/${selectedId}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          payload,
          expectedVersion: expectedVersion !== undefined ? parseInt(expectedVersion, 10) : undefined
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccessMsg(`Appended event: ${type} (Version ${data.version})`);
        fetchActiveShipment(selectedId);
        fetchShipments(search);
        // Clear fields
        setMoveLocation('');
        setMoveVessel('');
        setTempUpdate('');
      } else if (res.status === 409) {
        setOccConflict({
          expected: expectedVersion,
          actual: data.currentVersion
        });
      } else {
        setError(data.message || 'Error executing command');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    }
  };

  // Create Container Command
  const handleCreateContainer = async (e) => {
    e.preventDefault();
    if (!newId || !newName) return;
    
    try {
      const res = await fetch(`${API_BASE}/${newId}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTAINER_CREATED',
          payload: {
            name: newName,
            origin: newOrigin || 'UNKNOWN',
            temperature: newTemp ? parseFloat(newTemp) : undefined,
            timestamp: new Date().toISOString()
          },
          expectedVersion: 0 // Asserts it is new
        })
      });

      const data = await res.json();
      if (res.status === 201) {
        setSelectedId(newId);
        setNewId('');
        setNewName('');
        setNewOrigin('');
        setNewTemp('');
        setSuccessMsg('Container successfully created in event store.');
        fetchShipments(search);
      } else {
        setError(data.message || 'Failed to create container');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Prepare chart data: extract temperature updates from chronological events
  const getChartData = () => {
    const dataPoints = [];
    events.forEach(e => {
      // Include events up to scrubIndex if scrubbing, otherwise all
      const eventIndex = events.indexOf(e);
      if (isScrubbing && eventIndex >= scrubIndex) return;

      const dateStr = new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      if (e.eventType === 'CONTAINER_CREATED' && e.payload.temperature !== undefined) {
        dataPoints.push({ time: dateStr, temperature: e.payload.temperature, event: 'CREATED' });
      } else if ((e.eventType === 'TEMPERATURE_UPDATE' || e.eventType === 'TEMPERATURE_SPIKE') && e.payload.temperature !== undefined) {
        dataPoints.push({ time: dateStr, temperature: e.payload.temperature, event: e.eventType === 'TEMPERATURE_SPIKE' ? 'SPIKE' : 'UPDATE' });
      }
    });
    return dataPoints;
  };

  const chartData = getChartData();
  const activeState = isScrubbing ? scrubbedState : shipmentState;
  const currentVer = shipmentState ? shipmentState.version : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="glass-panel rounded-none border-t-0 border-x-0 px-8 py-4 mb-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white pulse-border">
            <Database size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              AUDIT TRAIL
            </h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Event-Sourced Logistics Ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">LOGISTICS_LEDGER_ONLINE</span>
          <button 
            onClick={() => selectedId && fetchActiveShipment(selectedId)} 
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition"
            title="Refresh Ledger State"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Shipment Search */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold">Containers Ledger</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search shipment ID or Name..." 
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {shipments.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedId(s.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                    selectedId === s.id 
                      ? 'border-indigo-500 bg-indigo-950/40 text-white' 
                      : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{s.name}</h4>
                    <span className="text-xs font-semibold text-slate-500">{s.id}</span>
                  </div>
                  <span className={`status-pill status-${s.currentStatus}`}>
                    {s.currentStatus.replace('_', ' ')}
                  </span>
                </div>
              ))}
              {shipments.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No shipments found.</p>
              )}
            </div>
          </div>

          {/* New Container Creator */}
          <div className="glass-panel p-6">
            <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold mb-4">Create Container</h2>
            <form onSubmit={handleCreateContainer} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Container ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. SHIP-003" 
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Descriptive Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pharmaceutical Reefer #12" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Origin Port</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Seattle" 
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Init Temp (°C)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5.0" 
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Append Create Event
              </button>
            </form>
          </div>

          {/* Append Commands Form */}
          {selectedId && (
            <div className="glass-panel p-6 flex flex-col gap-4">
              <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold">Append New Command</h2>
              
              {/* Move Command */}
              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1">
                  <MapPin size={12} className="text-sky-400" /> MOVE COMMAND
                </h3>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    placeholder="New location..." 
                    value={moveLocation}
                    onChange={(e) => setMoveLocation(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={moveStatus}
                      onChange={(e) => setMoveStatus(e.target.value)}
                    >
                      <option value="IN_TRANSIT">IN TRANSIT</option>
                      <option value="ARRIVED_AT_PORT">ARRIVED AT PORT</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Vessel Name (Optional)" 
                      value={moveVessel}
                      onChange={(e) => setMoveVessel(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => submitCommand('MOVE', {
                      newLocation: moveLocation,
                      status: moveStatus,
                      vesselName: moveVessel || undefined
                    }, currentVer)}
                    className="py-1.5 bg-sky-900/60 hover:bg-sky-850 text-sky-200 border border-sky-800 rounded-lg text-xs font-semibold tracking-wider transition"
                  >
                    APPEND MOVE EVENT (Assert Ver: {currentVer})
                  </button>
                </div>
              </div>

              {/* Temperature Command */}
              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1">
                  <Thermometer size={12} className="text-amber-400" /> TEMPERATURE REPORT
                </h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Temperature in °C" 
                    value={tempUpdate}
                    onChange={(e) => setTempUpdate(e.target.value)}
                  />
                  <button 
                    onClick={() => submitCommand('TEMPERATURE_UPDATE', {
                      temperature: parseFloat(tempUpdate)
                    }, currentVer)}
                    className="px-4 bg-amber-900/60 hover:bg-amber-850 text-amber-200 border border-amber-800 rounded-lg text-xs font-semibold tracking-wider transition whitespace-nowrap"
                  >
                    LOG (Assert Ver: {currentVer})
                  </button>
                </div>
              </div>

              {/* Version Conflict Demo */}
              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} className="text-rose-400" /> TEST OCC CONFLICT
                </h3>
                <p className="text-xs text-slate-500 mb-2">Simulate concurrent edit conflict by asserting version {Math.max(0, currentVer - 1)}.</p>
                <button 
                  onClick={() => submitCommand('TEMPERATURE_UPDATE', {
                    temperature: 4.8
                  }, Math.max(0, currentVer - 1))}
                  className="w-full py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-900/50 rounded-lg text-xs font-semibold transition"
                >
                  TRIGGER VERSION CONFLICT (Assert Ver: {Math.max(0, currentVer - 1)})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div className="flex flex-col gap-6">
          {/* Messages Alerts */}
          {occConflict && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 flex items-start gap-3 shadow-lg pulse-border">
              <AlertTriangle className="mt-0.5 text-rose-400 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-sm">Optimistic Concurrency Control Triggered (HTTP 409)</h4>
                <p className="text-xs text-rose-400 mt-1">
                  Write Rejected: Stale version conflict detected. Expected version <strong>{occConflict.expected}</strong>, but the aggregate state has moved on to version <strong>{occConflict.actual}</strong>.
                </p>
              </div>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-start gap-3 shadow-lg">
              <CheckCircle className="mt-0.5 text-emerald-400 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-sm">Success</h4>
                <p className="text-xs text-emerald-400 mt-1">{successMsg}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 flex items-start gap-3 shadow-lg">
              <AlertTriangle className="mt-0.5 text-red-400 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-sm">Error</h4>
                <p className="text-xs text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {activeState ? (
            <>
              {/* Reconstructed State Box */}
              <div className="glass-panel p-6 relative overflow-hidden">
                {isScrubbing && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xxs tracking-widest font-black uppercase px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
                    <History size={10} /> Time Travel View
                  </div>
                )}
                
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-indigo-400" />
                  {isScrubbing ? 'Reconstructed Snapshot State' : 'Current Read Model State'}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Status</span>
                    <span className={`status-pill status-${activeState.currentStatus}`}>
                      {activeState.currentStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="glass-card">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Location</span>
                    <span className="text-sm font-bold text-slate-200 flex items-center gap-1">
                      {activeState.currentStatus === 'IN_TRANSIT' ? <Truck size={14} className="text-sky-400" /> : <Anchor size={14} className="text-emerald-400" />}
                      {activeState.location}
                    </span>
                  </div>
                  <div className="glass-card">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Temperature</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${activeState.temperature > 8 ? 'text-rose-400' : 'text-slate-200'}`}>
                      <Thermometer size={14} className={activeState.temperature > 8 ? 'text-rose-400' : 'text-sky-400'} />
                      {activeState.temperature !== null ? `${activeState.temperature} °C` : 'N/A'}
                    </span>
                  </div>
                  <div className="glass-card">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Aggregate Version</span>
                    <span className="text-sm font-bold text-indigo-300 flex items-center gap-1">
                      <Layers size={14} className="text-indigo-400" />
                      v{activeState.version}
                    </span>
                  </div>
                </div>

                <div className="text-xxs text-slate-500 font-semibold tracking-wider mt-4 block text-right uppercase">
                  Last event timestamp: {activeState.lastUpdated ? new Date(activeState.lastUpdated).toLocaleString() : 'N/A'}
                </div>
              </div>

              {/* State Scrubbing Time Slider */}
              {events.length > 0 && (
                <div className="glass-panel p-6">
                  <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold mb-4 flex justify-between items-center">
                    <span>State Scrubbing (Temporal Analysis)</span>
                    <span className="text-xs text-slate-400 lowercase font-medium">
                      {scrubIndex === events.length ? 'Present' : `Version ${scrubIndex} / ${events.length}`}
                    </span>
                  </h2>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500 font-bold uppercase">Genesis</span>
                      <input 
                        type="range" 
                        min="0" 
                        max={events.length} 
                        value={scrubIndex}
                        onChange={handleScrubChange}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="text-xs text-slate-500 font-bold uppercase">Present</span>
                    </div>
                    {isScrubbing && (
                      <p className="text-xs text-indigo-300 text-center bg-indigo-950/20 py-1.5 rounded-lg border border-indigo-900/30 flex items-center justify-center gap-1.5">
                        <History size={12} /> Replaying append-only logs up to event version <strong>{scrubIndex}</strong>. Drag slider to right to return to real-time.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Charts Overlay */}
              {chartData.length > 0 && (
                <div className="glass-panel p-6">
                  <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold mb-4">Temperature Telemetry Overlay</h2>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} unit="°C" />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#818cf8', fontSize: '12px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }} 
                          dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (payload.event === 'SPIKE') {
                              return <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={1} />;
                            }
                            return <circle cx={cx} cy={cy} r={3} fill="#6366f1" />;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Vertical Chronological Timeline */}
              <div className="glass-panel p-6">
                <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-bold mb-6">Chronological Ledger Event Logs</h2>
                <div className="relative pl-10 flex flex-col gap-6">
                  <div className="timeline-line"></div>
                  
                  {events.map((e, idx) => {
                    const isActive = idx < scrubIndex;
                    const isSpike = e.eventType === 'TEMPERATURE_SPIKE';
                    
                    return (
                      <div 
                        key={idx} 
                        className={`relative flex flex-col gap-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-25'}`}
                      >
                        {/* Timeline dot */}
                        <div 
                          className={`absolute -left-[30px] top-1.5 w-[20px] h-[20px] rounded-full border-4 border-[#030712] flex items-center justify-center ${
                            isSpike 
                              ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                              : e.eventType === 'CONTAINER_CREATED' 
                              ? 'bg-indigo-500' 
                              : e.eventType === 'ARRIVED_AT_PORT' 
                              ? 'bg-emerald-500'
                              : 'bg-sky-500'
                          }`}
                        >
                        </div>

                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-200">
                            {e.eventType.replace('_', ' ')}
                            <span className="text-xxs text-indigo-400 ml-2 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/30">
                              v{e.version}
                            </span>
                          </h3>
                          <span className="text-xs text-slate-500">
                            {new Date(e.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="glass-card py-2 px-3 bg-slate-900/10 text-xs font-mono text-slate-400 overflow-x-auto">
                          {JSON.stringify(e.payload, null, 2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-indigo-400" size={32} />
                  <p className="text-sm font-bold text-slate-400">Reconstructing shipment states from events store...</p>
                </div>
              ) : (
                <p className="text-sm">Select a container or create a new one to view the reconstructed ledger state.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
