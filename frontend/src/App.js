import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { 
  Activity, 
  Shield, 
  Server, 
  FileText, 
  Target, 
  Github, 
  Linkedin, 
  Menu, 
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';
import './App.css';

cytoscape.use(dagre);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/infrastructure', label: 'Infrastructure', icon: Server },
    { path: '/soc', label: 'SOC Monitoring', icon: Shield },
    { path: '/network', label: 'Network Diagram', icon: Activity },
    { path: '/documentation', label: 'Documentation', icon: FileText },
    { path: '/threats', label: 'Threat Simulation', icon: Target }
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-white font-bold text-lg">Drew's Lab</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Home/Landing Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Drew Syverson
          </h1>
          <h2 className="text-2xl md:text-3xl text-blue-400 mb-8">
            Home SOC & IT Lab
          </h2>
          <div className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            <p className="mb-4 font-semibold text-green-400">
              "Self-Hosted, Self-Taught, Security-Driven."
            </p>
            <p>
              This is my self-hosted cybersecurity lab designed to simulate a real-world 
              enterprise network, complete with a firewall, domain controller, SIEM, VPN access, 
              and web services.
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 mb-16">
            <a
              href="https://github.com/rayzax"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/andrew-syverson"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <Server className="h-8 w-8 text-blue-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Infrastructure</h3>
              <p className="text-gray-300">Real-time monitoring of VM status, resource usage, and system health.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <Shield className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Security Operations</h3>
              <p className="text-gray-300">SIEM integration with Wazuh for comprehensive security monitoring.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <Target className="h-8 w-8 text-red-400 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Threat Testing</h3>
              <p className="text-gray-300">Controlled attack simulations with MITRE ATT&CK framework mapping.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// VM Status Card Component
const VMStatusCard = ({ deviceName, vmData, isLoading, error }) => {
  const getStatusColor = () => {
    if (error || !vmData) return 'border-red-500 bg-red-50';
    if (vmData.powerState !== 'running') return 'border-red-500 bg-red-50';
    if (vmData.cpuUsage > 70 || vmData.memoryUsage > 70) return 'border-orange-500 bg-orange-50';
    return 'border-green-500 bg-green-50';
  };

  const getStatusIcon = () => {
    if (error || !vmData) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (vmData.powerState !== 'running') return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (vmData.cpuUsage > 70 || vmData.memoryUsage > 70) return <Clock className="h-5 w-5 text-orange-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className={`bg-white rounded-lg border-l-4 p-6 shadow-md ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">{deviceName}</h3>
        {getStatusIcon()}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : error ? (
        <div className="text-red-600">
          <p className="font-medium">Error fetching data</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : vmData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Power State:</span>
            <span className={`font-medium ${vmData.powerState === 'running' ? 'text-green-600' : 'text-red-600'}`}>
              {vmData.powerState || 'Unknown'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">CPU:</span>
              </div>
              <span className="font-medium">{vmData.cpuUsage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${(vmData.cpuUsage || 0) > 70 ? 'bg-red-500' : (vmData.cpuUsage || 0) > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${vmData.cpuUsage || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Memory:</span>
              </div>
              <span className="font-medium">{vmData.memoryUsage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${(vmData.memoryUsage || 0) > 70 ? 'bg-red-500' : (vmData.memoryUsage || 0) > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${vmData.memoryUsage || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Disk:</span>
              </div>
              <span className="font-medium">{vmData.diskUsage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${(vmData.diskUsage || 0) > 70 ? 'bg-red-500' : (vmData.diskUsage || 0) > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${vmData.diskUsage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
};

// Infrastructure Dashboard Component
const InfrastructurePage = () => {
  const [vmData, setVmData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  
  const devices = ['pfsense', 'dc01', 'UbuWebServ', 'WinWork', 'Kali'];

  const fetchVMData = async (deviceName) => {
    setLoading(prev => ({ ...prev, [deviceName]: true }));
    try {
      const response = await axios.get(`${API}/vm-status/${deviceName}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      setVmData(prev => ({ ...prev, [deviceName]: response.data }));
      setErrors(prev => ({ ...prev, [deviceName]: null }));
    } catch (error) {
      console.error(`Error fetching data for ${deviceName}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [deviceName]: error.response?.data?.message || error.message || 'Failed to fetch data'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [deviceName]: false }));
    }
  };

  useEffect(() => {
    // Initial fetch
    devices.forEach(device => fetchVMData(device));
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      devices.forEach(device => fetchVMData(device));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    devices.forEach(device => fetchVMData(device));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Infrastructure Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring of lab environment VMs</p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Activity className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <VMStatusCard
              key={device}
              deviceName={device}
              vmData={vmData[device]}
              isLoading={loading[device]}
              error={errors[device]}
            />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {devices.map(device => {
              const data = vmData[device];
              const isOnline = data?.powerState === 'running';
              return (
                <div key={device} className="text-center">
                  <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm font-medium text-gray-700 capitalize">{device}</p>
                  <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// SOC Monitoring Component
const SOCPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SOC Monitoring</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Wazuh SIEM Dashboard</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Wazuh serves as the central SIEM (Security Information and Event Management) solution 
            for this lab environment, providing comprehensive security monitoring and threat detection.
          </p>
          
          <a
            href="https://labenv-as.com/wazuh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Shield className="h-5 w-5 mr-2" />
            Access Wazuh Dashboard
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Log Collection</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Windows Event Logs
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Sysmon Events
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                pfSense Firewall Logs
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Linux System Logs
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Application Logs
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detection Capabilities</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                Intrusion Detection
              </li>
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                Malware Detection
              </li>
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                Policy Violations
              </li>
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                Anomaly Detection
              </li>
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                Compliance Monitoring
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sample Alerts & Detection Rules</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">Coming Soon</p>
            <p className="text-yellow-700 text-sm">Sample alerts with timestamps and detection rules will be uploaded here later.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Network Diagram Component
const NetworkDiagramPage = () => {
  const cyRef = React.useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: [
        // Physical Infrastructure
        { data: { id: 'router', label: 'Router\n192.168.0.1', type: 'router', layer: 'physical' } },
        { data: { id: 'switch', label: 'Cisco Switch\n192.168.0.93', type: 'switch', layer: 'physical' } },
        { data: { id: 'proxmox', label: 'Proxmox\n192.168.0.15', type: 'hypervisor', layer: 'physical' } },
        { data: { id: 'docker', label: 'Docker\n192.168.0.26', type: 'server', layer: 'physical' } },
        
        // Virtual Machines - pfSense acts as gateway between networks
        { data: { id: 'pfsense', label: 'pfSense\n.0.204/.1.1', type: 'firewall', layer: 'virtual' } },
        
        // Lab Network VMs (192.168.1.x)
        { data: { id: 'ubuntu-web', label: 'Ubuntu Web\n192.168.1.102', type: 'webserver', layer: 'virtual' } },
        { data: { id: 'windows-dc', label: 'Win DC\n192.168.1.3', type: 'domaincontroller', layer: 'virtual' } },
        { data: { id: 'kali', label: 'Kali\n192.168.1.103', type: 'security', layer: 'virtual' } },
        { data: { id: 'windows-ws', label: 'Win10 WS\n192.168.1.104', type: 'workstation', layer: 'virtual' } },

        // Network segments (invisible nodes for grouping)
        { data: { id: 'net-0', label: '192.168.0.x\nManagement', type: 'network', layer: 'network' } },
        { data: { id: 'net-1', label: '192.168.1.x\nLab Network', type: 'network', layer: 'network' } },
        
        // Physical connections
        { data: { source: 'router', target: 'switch', type: 'physical' } },
        { data: { source: 'switch', target: 'proxmox', type: 'physical' } },
        { data: { source: 'switch', target: 'docker', type: 'physical' } },
        
        // Virtual connections within Proxmox
        { data: { source: 'proxmox', target: 'pfsense', type: 'virtual' } },
        
        // Lab network connections through pfSense
        { data: { source: 'pfsense', target: 'ubuntu-web', type: 'virtual' } },
        { data: { source: 'pfsense', target: 'windows-dc', type: 'virtual' } },
        { data: { source: 'pfsense', target: 'kali', type: 'virtual' } },
        { data: { source: 'pfsense', target: 'windows-ws', type: 'virtual' } },

        // Network segment connections (for visual grouping)
        { data: { source: 'switch', target: 'net-0', type: 'network' } },
        { data: { source: 'pfsense', target: 'net-1', type: 'network' } },
      ],
      style: [
        // Base node styling
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'text-outline-color': '#000000',
            'text-outline-width': 1,
            'font-size': '10px',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            'width': 110,
            'height': 110,
            'border-width': 3,
            'border-opacity': 0.8,
            'background-opacity': 0.9,
            'shadow-blur': 10,
            'shadow-color': '#000000',
            'shadow-opacity': 0.3,
            'shadow-offset-x': 3,
            'shadow-offset-y': 3,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': '0.3s'
          }
        },

        // Physical Infrastructure Styling
        {
          selector: 'node[type="router"]',
          style: {
            'background-color': '#1e40af', // Deep blue
            'border-color': '#1e3a8a',
            'width': 130,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="switch"]',
          style: {
            'background-color': '#059669', // Emerald
            'border-color': '#047857',
            'width': 140,
            'height': 80,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="hypervisor"]',
          style: {
            'background-color': '#7c3aed', // Purple
            'border-color': '#6d28d9',
            'width': 130,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="server"]',
          style: {
            'background-color': '#0891b2', // Cyan
            'border-color': '#0e7490',
            'width': 120,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },

        // Virtual Machine Styling
        {
          selector: 'node[type="firewall"]',
          style: {
            'background-color': '#dc2626', // Red
            'border-color': '#b91c1c',
            'width': 130,
            'height': 100,
            'shape': 'diamond'
          }
        },
        {
          selector: 'node[type="webserver"]',
          style: {
            'background-color': '#16a34a', // Green
            'border-color': '#15803d',
            'width': 130,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="domaincontroller"]',
          style: {
            'background-color': '#2563eb', // Blue
            'border-color': '#1d4ed8',
            'width': 120,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="security"]',
          style: {
            'background-color': '#7c2d12', // Dark red
            'border-color': '#991b1b',
            'width': 120,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="workstation"]',
          style: {
            'background-color': '#ea580c', // Orange
            'border-color': '#c2410c',
            'width': 130,
            'height': 90,
            'shape': 'round-rectangle'
          }
        },

        // Network segment styling
        {
          selector: 'node[type="network"]',
          style: {
            'background-color': '#374151',
            'border-color': '#4b5563',
            'width': 160,
            'height': 50,
            'shape': 'round-rectangle',
            'opacity': 0.7,
            'font-size': '10px',
            'color': '#d1d5db'
          }
        },

        // Edge styling
        {
          selector: 'edge',
          style: {
            'width': 4,
            'target-arrow-shape': 'triangle',
            'target-arrow-size': 10,
            'curve-style': 'bezier',
            'opacity': 0.8
          }
        },
        {
          selector: 'edge[type="physical"]',
          style: {
            'line-color': '#1f2937',
            'target-arrow-color': '#1f2937',
            'width': 6
          }
        },
        {
          selector: 'edge[type="virtual"]',
          style: {
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
            'line-style': 'dashed',
            'width': 3
          }
        },
        {
          selector: 'edge[type="network"]',
          style: {
            'line-color': '#6b7280',
            'target-arrow-color': '#6b7280',
            'width': 2,
            'opacity': 0.5,
            'line-style': 'dotted'
          }
        },

        // Hover effects
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0.2,
            'overlay-color': '#3b82f6',
            'width': 'mapData(width, 80, 160, 90, 170)',
            'height': 'mapData(height, 60, 120, 70, 130)'
          }
        },

        // Selected state
        {
          selector: '.selected',
          style: {
            'border-width': 5,
            'border-color': '#fbbf24',
            'background-color': 'mapData(background-color, #000000, #ffffff, #333333, #cccccc)'
          }
        }
      ],
      layout: {
        name: 'preset',
        positions: {
          'router': { x: 400, y: 50 },
          'switch': { x: 400, y: 150 },
          'proxmox': { x: 250, y: 250 },
          'docker': { x: 550, y: 250 },
          'pfsense': { x: 250, y: 350 },
          'ubuntu-web': { x: 100, y: 450 },
          'windows-dc': { x: 200, y: 450 },
          'kali': { x: 300, y: 450 },
          'windows-ws': { x: 400, y: 450 },
          'net-0': { x: 600, y: 100 },
          'net-1': { x: 450, y: 350 }
        },
        fit: true,
        padding: 50
      }
    });

    // Enhanced interaction handlers
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const nodeId = node.id();
      
      // Remove previous selection
      cy.elements().removeClass('selected');
      // Add selection to clicked node
      node.addClass('selected');
      
      const nodeInfo = {
        router: {
          role: 'Network Gateway',
          function: 'Primary internet gateway and router for the lab network',
          ip: '192.168.0.1',
          type: 'Physical',
          os: 'Router Firmware'
        },
        switch: {
          role: 'Network Switch',
          function: 'Cisco 350 2G managed switch providing network connectivity',
          ip: '192.168.0.93',
          type: 'Physical',
          os: 'Cisco IOS'
        },
        proxmox: {
          role: 'Hypervisor Host',
          function: 'Proxmox VE hypervisor hosting virtual machines',
          ip: '192.168.0.15',
          type: 'Physical',
          os: 'Proxmox VE'
        },
        docker: {
          role: 'Container Host',
          function: 'Docker container server for containerized applications',
          ip: '192.168.0.26',
          type: 'Physical',
          os: 'Linux'
        },
        pfsense: {
          role: 'Firewall & Gateway',
          function: 'Network security and routing between lab segments',
          ip: '192.168.0.204 / 192.168.1.1',
          type: 'Virtual Machine',
          os: 'pfSense'
        },
        'ubuntu-web': {
          role: 'Web Server',
          function: 'Ubuntu server hosting web applications and services',
          ip: '192.168.1.102',
          type: 'Virtual Machine',
          os: 'Ubuntu Linux'
        },
        'windows-dc': {
          role: 'Domain Controller',
          function: 'Windows Server providing Active Directory and DNS services',
          ip: '192.168.1.3',
          type: 'Virtual Machine',
          os: 'Windows Server'
        },
        kali: {
          role: 'Security Testing',
          function: 'Kali Linux for penetration testing and security assessment',
          ip: '192.168.1.103',
          type: 'Virtual Machine',
          os: 'Kali Linux'
        },
        'windows-ws': {
          role: 'Workstation',
          function: 'Windows 10 client for testing and administration',
          ip: '192.168.1.104',
          type: 'Virtual Machine',
          os: 'Windows 10'
        }
      };

      const info = nodeInfo[nodeId];
      if (info) {
        setSelectedNode(info);
      }
    });

    // Hover effects
    cy.on('mouseover', 'node', function(evt) {
      const node = evt.target;
      node.style({
        'width': node.style('width') * 1.1,
        'height': node.style('height') * 1.1
      });
    });

    cy.on('mouseout', 'node', function(evt) {
      const node = evt.target;
      if (!node.hasClass('selected')) {
        node.removeStyle('width height');
      }
    });

    return () => {
      cy.destroy();
    };
  }, []);

  const networkSegments = [
    {
      name: '192.168.0.x - Management Network',
      description: 'Physical infrastructure and management interfaces',
      devices: ['Router/Gateway', 'Cisco Switch', 'Proxmox Server', 'Docker Server'],
      color: 'border-blue-500'
    },
    {
      name: '192.168.1.x - Lab Network',
      description: 'Isolated virtual lab environment for testing',
      devices: ['Ubuntu Web Server', 'Windows DC/DNS', 'Kali Attack Box', 'Windows 10 WS'],
      color: 'border-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Network Architecture</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Interactive Network Topology</h2>
                <p className="text-gray-600">Click on devices to view detailed information</p>
              </div>
              <div ref={cyRef} style={{ width: '100%', height: '600px', backgroundColor: '#f8fafc' }}></div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedNode && (
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Device Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Role:</span> {selectedNode.role}</div>
                  <div><span className="font-medium">IP Address:</span> {selectedNode.ip}</div>
                  <div><span className="font-medium">Type:</span> {selectedNode.type}</div>
                  <div><span className="font-medium">OS:</span> {selectedNode.os}</div>
                  <div className="pt-2">
                    <span className="font-medium">Function:</span>
                    <p className="text-gray-600 mt-1">{selectedNode.function}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-800 mr-3 rounded"></div>
                  <span>Physical Connection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-dashed mr-3 rounded"></div>
                  <span>Virtual Connection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-dotted mr-3 rounded"></div>
                  <span>Network Segment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {networkSegments.map((segment, index) => (
            <div key={index} className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${segment.color}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{segment.name}</h3>
              <p className="text-gray-600 mb-4">{segment.description}</p>
              <div className="space-y-1">
                {segment.devices.map((device, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    {device}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Documentation Component
const DocumentationPage = () => {
  const docs = [
    {
      title: 'Lab Architecture and Segmentation',
      description: 'Detailed overview of network design, VLAN configuration, and security zones.',
      status: 'placeholder'
    },
    {
      title: 'VPN and Firewall Configuration (pfSense)',
      description: 'Step-by-step guide for setting up VPN access and firewall rules.',
      status: 'placeholder'
    },
    {
      title: 'Reverse Proxy and HTTPS (NGINX + Let\'s Encrypt)',
      description: 'Configuration guide for web services with SSL/TLS termination.',
      status: 'placeholder'
    },
    {
      title: 'Wazuh Alert Setup and Configuration',
      description: 'SIEM deployment, agent installation, and custom rule creation.',
      status: 'placeholder'
    },
    {
      title: 'Domain Controller Setup and AD Usage',
      description: 'Active Directory deployment and management best practices.',
      status: 'placeholder'
    },
    {
      title: 'Device Hardening Basics',
      description: 'Security baseline configurations for Windows and Linux systems.',
      status: 'placeholder'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Documentation</h1>
        
        <div className="space-y-6">
          {docs.map((doc, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{doc.title}</h2>
                  <p className="text-gray-600 mb-4">{doc.description}</p>
                  {doc.status === 'placeholder' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 font-medium text-sm">Coming Soon</p>
                      <p className="text-blue-700 text-sm">Documentation content will be added here.</p>
                    </div>
                  )}
                </div>
                <FileText className="h-6 w-6 text-gray-400 ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Threat Simulation Component
const ThreatSimulationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Threat Simulation</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Attack Testing & Analysis</h2>
          </div>
          <p className="text-gray-600 mb-6">
            This section will contain detailed walkthroughs of controlled attack simulations 
            performed in the lab environment, along with corresponding security alerts and analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Planned Content</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Attack Walkthroughs</h4>
                <p className="text-yellow-700 text-sm">Step-by-step documentation of simulated attacks and techniques tested in the lab.</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Wazuh Alert Correlation</h4>
                <p className="text-yellow-700 text-sm">Analysis of SIEM alerts generated during attack simulations with timeline correlation.</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">MITRE ATT&CK Mapping</h4>
                <p className="text-yellow-700 text-sm">Each tested technique mapped to the MITRE ATT&CK framework for comprehensive threat modeling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/soc" element={<SOCPage />} />
          <Route path="/network" element={<NetworkDiagramPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/threats" element={<ThreatSimulationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;