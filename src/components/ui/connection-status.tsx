import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { connectionManager } from '@/lib/connectionManager';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

export function ConnectionStatus({ className, showText = false }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Set up interval to check connection periodically
    const interval = setInterval(checkConnection, 300000); // Check every 5 minutes
    
    // Set up online/offline event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    setStatus('checking');
    const isConnected = await connectionManager.checkConnection();
    setStatus(isConnected ? 'connected' : 'disconnected');
    setLastChecked(new Date());
    setIsChecking(false);
  };
  
  const handleOnline = () => {
    checkConnection();
  };
  
  const handleOffline = () => {
    setStatus('disconnected');
    setLastChecked(new Date());
  };

  const handleManualCheck = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setStatus('checking');
    // Reset the connection manager to force a fresh check
    connectionManager.resetConnection();
    const isConnected = await connectionManager.checkConnection();
    setStatus(isConnected ? 'connected' : 'disconnected');
    setLastChecked(new Date());
    setIsChecking(false);
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-xs",
        status === 'connected' ? 'text-green-500' : 
        status === 'disconnected' ? 'text-red-500' : 
        status === 'error' ? 'text-red-500' :
        'text-yellow-500',
        className
      )}
    >
      {status === 'connected' && <Wifi className="h-3 w-3" />}
      {status === 'disconnected' && <WifiOff className="h-3 w-3" />}
      {status === 'checking' && <AlertTriangle className="h-3 w-3 animate-pulse" />}
      {status === 'error' && <AlertTriangle className="h-3 w-3" />}
      
      {showText && (
        <span>
          {status === 'connected' && 'Connected'}
          {status === 'disconnected' && 'Connection Error'}
          {status === 'checking' && 'Checking...'}
          {status === 'error' && 'Connection Error'}
        </span>
      )}
      
      {lastChecked && showText && (
        <span className="text-muted-foreground ml-1">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 rounded-full"
        onClick={handleManualCheck}
        disabled={isChecking}
      >
        <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}