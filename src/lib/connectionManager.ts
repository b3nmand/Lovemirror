import { supabase } from './supabase';

/**
 * Connection manager to handle database connection pooling and optimization
 */
class ConnectionManager {
  private static instance: ConnectionManager;
  private connectionStatus: 'connected' | 'disconnected' | 'error' | 'checking' = 'disconnected';
  private lastConnectionCheck: number = 0;
  private connectionCheckInterval: number = 300000; // 5 minutes
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private offlineMode: boolean = false;

  private constructor() {
    // Initialize offline detection
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Check initial connection status
    this.offlineMode = !navigator.onLine;
  }

  /**
   * Get the singleton instance of the connection manager
   */
  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Check if the database connection is healthy
   * @returns Promise<boolean> - True if connection is healthy, false otherwise
   */
  public async checkConnection(): Promise<boolean> {
    // If we're offline, return false immediately
    if (this.offlineMode) {
      console.log('Device is offline, skipping connection check');
      this.connectionStatus = 'disconnected';
      return false;
    }
    
    const now = Date.now();
    
    // Only check connection if it's been more than the interval since last check
    // or if we're not already connected
    if (now - this.lastConnectionCheck < this.connectionCheckInterval && this.connectionStatus === 'connected') {
      return this.connectionStatus === 'connected';
    }
    
    this.lastConnectionCheck = now;
    this.connectionStatus = 'checking';

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      // Perform a lightweight query to check connection
      const { data, error } = await supabase
        .from('health_check')
        .select('*')
        .limit(1);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Connection check failed:', error);
        
        // Implement retry logic
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying connection check (${this.retryCount}/${this.maxRetries})...`);
          
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.retryCount)));
          return this.checkConnection();
        }
        
        this.connectionStatus = 'error';
        return false;
      }
      
      // Reset retry count on success
      this.retryCount = 0;
      this.connectionStatus = 'connected';
      return true;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Connection check failed:', err);
      
      // Implement retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying connection check (${this.retryCount}/${this.maxRetries})...`);
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.retryCount)));
        return this.checkConnection();
      }
      
      this.connectionStatus = 'error';
      return false;
    }
  }

  /**
   * Get a database client with optimized settings for the specific operation
   * @param operation - The type of operation being performed
   * @returns The supabase client with optimized settings
   */
  public getClient(operation: 'read' | 'write' | 'realtime' = 'read') {
    // For now, we're just returning the main supabase client
    // In the future, this could be expanded to provide different client configurations
    // based on the operation type
    return supabase;
  }

  /**
   * Reset the connection status and force a new connection check
   */
  public resetConnection(): void {
    this.connectionStatus = 'disconnected';
    this.lastConnectionCheck = 0;
    this.retryCount = 0;
  }
  
  /**
   * Get the current connection status
   */
  public getConnectionStatus(): 'connected' | 'disconnected' | 'error' | 'checking' {
    return this.connectionStatus;
  }
  
  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('Device is online');
    this.offlineMode = false;
    this.resetConnection();
    this.checkConnection(); // Trigger a connection check
  }
  
  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('Device is offline');
    this.offlineMode = true;
    this.connectionStatus = 'disconnected';
  }
  
  /**
   * Check if the device is in offline mode
   */
  public isOffline(): boolean {
    return this.offlineMode;
  }
}

// Export the singleton instance
export const connectionManager = ConnectionManager.getInstance();