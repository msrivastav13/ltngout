/**
 * Lightning Out 2.0 - Event Monitoring & Communication
 * 
 * This script handles:
 * 1. Lightning Out 2.0 lifecycle events (lo.application.ready, lo.application.error, etc.)
 * 2. Custom event communication between host page and LWC components
 * 3. Real-time event logging and status tracking
 */

// =============================================================================
// APPLICATION STATE
// =============================================================================

const AppState = {
    scriptLoaded: false,
    applicationReady: false,
    componentReady: false,
    authenticated: false,
    messageCounter: 0
};

// =============================================================================
// DOM ELEMENTS
// =============================================================================

const elements = {
    // Status indicators
    scriptStatus: document.getElementById('script-status'),
    scriptText: document.getElementById('script-text'),
    appStatus: document.getElementById('app-status'),
    appText: document.getElementById('app-text'),
    componentStatusDot: document.getElementById('component-status-dot'),
    componentText: document.getElementById('component-text'),
    authStatus: document.getElementById('auth-status'),
    authText: document.getElementById('auth-text'),
    
    // Event log
    eventLog: document.getElementById('event-log'),
    
    // Message displays
    componentStatus: document.getElementById('component-status'),
    hostMessage: document.getElementById('host-message'),
    hostContent: document.getElementById('host-content'),
    componentMessage: document.getElementById('component-message'),
    componentContent: document.getElementById('component-content'),
    
    // Controls
    sendMessage: document.getElementById('send-message'),
    simulateAuth: document.getElementById('simulate-auth'),
    clearLog: document.getElementById('clear-log'),
    
    // Lightning Out elements
    lightningOutApp: document.querySelector('lightning-out-application'),
    productBrowser: document.querySelector('c-product-browser')
};

// =============================================================================
// LOGGING UTILITY
// =============================================================================

function logEvent(type, message, isError = false) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="event-type ${isError ? 'error' : ''}">${type}</span> - ${message}`;
    
    elements.eventLog.appendChild(logEntry);
    elements.eventLog.scrollTop = elements.eventLog.scrollHeight;
    
    console.log(`[Lightning Out Tutorial] [${timestamp}] ${type}: ${message}`);
}

function updateStatus(statusElement, textElement, status, text) {
    statusElement.className = `status-dot status-${status}`;
    if (textElement) {
        textElement.textContent = text;
    }
}

// =============================================================================
// LIGHTNING OUT 2.0 LIFECYCLE EVENT HANDLERS
// =============================================================================

/**
 * Handles the lo.application.ready event
 * Fired when Lightning Out 2.0 successfully establishes a Salesforce session
 */
function handleApplicationReady(event) {
    logEvent('lo.application.ready', 'Salesforce session established successfully!');
    
    AppState.applicationReady = true;
    updateStatus(elements.appStatus, elements.appText, 'success', 'Ready');
    
    // Enable component interaction buttons
    elements.sendMessage.disabled = false;
    
    logEvent('SYSTEM', 'Lightning Out 2.0 web components initializing...');
}

/**
 * Handles the lo.application.error event
 * Fired when Lightning Out 2.0 fails to establish a Salesforce session
 */
function handleApplicationError(event) {
    const errorMessage = event.detail?.message || 'Unknown error';
    const originalError = event.detail?.originalError || 'No additional error details';
    
    logEvent('lo.application.error', `Session failed: ${errorMessage}`, true);
    logEvent('ERROR_DETAIL', `Original: ${originalError}`, true);
    
    updateStatus(elements.appStatus, elements.appText, 'error', 'Failed');
    
    // Show error in component status
    elements.componentStatus.className = 'message-box show error';
    elements.componentStatus.innerHTML = `<strong>Error:</strong> ${errorMessage}`;
}

/**
 * Handles the lo.component.ready event
 * Fired when Lightning Out 2.0 components successfully render with embedded LWC
 */
function handleComponentReady(event) {
    logEvent('lo.component.ready', 'Lightning Out 2.0 component rendered successfully!');
    
    AppState.componentReady = true;
    updateStatus(elements.componentStatusDot, elements.componentText, 'success', 'Ready');
    
    // Show success in component status
    elements.componentStatus.className = 'message-box show success';
    elements.componentStatus.innerHTML = `<strong>Success:</strong> c-product-browser component loaded`;
    
    logEvent('ARCHITECTURE', 'Component runs inside iframe with closed shadow DOM');
    
    // Set up custom event listeners for component communication
    setupCustomEventListeners();
}

/**
 * Handles the lo.component.error event
 * Fired when Lightning Out 2.0 components fail to render or encounter runtime errors
 */
function handleComponentError(event) {
    const errorMessage = event.detail?.message || 'Component failed to render';
    const originalError = event.detail?.originalError || 'No additional error details';
    
    logEvent('lo.component.error', `Component error: ${errorMessage}`, true);
    logEvent('ERROR_DETAIL', `Original: ${originalError}`, true);
    
    updateStatus(elements.componentStatusDot, elements.componentText, 'error', 'Failed');
    
    elements.componentStatus.className = 'message-box show error';
    elements.componentStatus.innerHTML = `<strong>Component Error:</strong> ${errorMessage}`;
}

// =============================================================================
// CUSTOM EVENT COMMUNICATION
// =============================================================================

/**
 * Set up custom event listeners for bidirectional communication
 */
function setupCustomEventListeners() {
    if (!elements.productBrowser) {
        logEvent('WARNING', 'c-product-browser element not found, custom event communication unavailable');
        return;
    }
    
    // Listen for custom events from the LWC component
    elements.productBrowser.addEventListener('productBrowserMessage', handleComponentMessage);
    elements.productBrowser.addEventListener('componentLifecycle', handleComponentLifecycle);
    
    logEvent('EVENT_SETUP', 'Custom event listeners established for bidirectional communication');
}

/**
 * Handle custom messages from the LWC component
 */
function handleComponentMessage(event) {
    const messageData = event.detail;
    
    logEvent('LWC→HOST', `Received: ${messageData.message}`);
    
    // Display the message in the UI
    elements.componentMessage.className = 'message-box show success';
    elements.componentContent.innerHTML = `
        <strong>Message:</strong> ${messageData.message}<br>
        <strong>Component:</strong> ${messageData.component}<br>
        <strong>Time:</strong> ${messageData.timestamp}
    `;
    
    // Hide after 5 seconds
    setTimeout(() => {
        elements.componentMessage.className = 'message-box';
    }, 5000);
}

/**
 * Handle component lifecycle events from LWC
 */
function handleComponentLifecycle(event) {
    const lifecycleData = event.detail;
    logEvent('LIFECYCLE', `Component lifecycle: ${lifecycleData.stage} - ${lifecycleData.message}`);
}

/**
 * Send a custom message to the LWC component
 */
function sendMessageToComponent() {
    if (!AppState.componentReady || !elements.productBrowser) {
        logEvent('WARNING', 'Cannot send message - component not ready');
        return;
    }
    
    AppState.messageCounter++;
    
    const messageData = {
        message: `Hello from host page! Message #${AppState.messageCounter}`,
        timestamp: new Date().toISOString(),
        source: 'host-page',
        counter: AppState.messageCounter
    };
    
    // Create and dispatch custom event
    const customEvent = new CustomEvent('hostMessage', {
        detail: messageData,
        bubbles: true,
        composed: true
    });
    
    elements.productBrowser.dispatchEvent(customEvent);
    
    logEvent('HOST→LWC', `Sent: ${messageData.message}`);
    
    // Show confirmation in UI
    elements.hostMessage.className = 'message-box show success';
    elements.hostContent.innerHTML = `
        <strong>Sent:</strong> ${messageData.message}<br>
        <strong>Time:</strong> ${messageData.timestamp}
    `;
    
    setTimeout(() => {
        elements.hostMessage.className = 'message-box';
    }, 5000);
}

// =============================================================================
// AUTHENTICATION SIMULATION
// =============================================================================

/**
 * Simulate the authentication process
 * In a real application, this would involve OAuth flow and UI Bridge API
 */
function simulateAuthentication() {
    logEvent('AUTH_START', 'Starting authentication simulation...');
    updateStatus(elements.authStatus, elements.authText, 'pending', 'Authenticating...');
    
    // Simulate OAuth flow delay
    setTimeout(() => {
        // Generate a mock frontdoor URL for demonstration
        const mockFrontdoorUrl = `https://pronto-5e.salesforce.com/secur/frontdoor.jsp?sid=MOCK_${Date.now()}`;
        
        // Set the frontdoor URL on the Lightning Out application
        if (elements.lightningOutApp) {
            elements.lightningOutApp.setAttribute('frontdoor-url', mockFrontdoorUrl);
            
            AppState.authenticated = true;
            updateStatus(elements.authStatus, elements.authText, 'success', 'Simulated');
            
            logEvent('AUTH_SUCCESS', `Mock frontdoor URL set`);
            logEvent('SYSTEM', 'Lightning Out 2.0 attempting session establishment...');
            logEvent('NOTE', 'This is simulation - real auth requires valid Salesforce org');
        } else {
            logEvent('AUTH_ERROR', 'lightning-out-application element not found', true);
            updateStatus(elements.authStatus, elements.authText, 'error', 'Failed');
        }
    }, 2000);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clear the event log
 */
function clearEventLog() {
    elements.eventLog.innerHTML = '<div><span class="timestamp">[Cleared]</span> <span class="event-type">SYSTEM</span> - Log cleared</div>';
    logEvent('SYSTEM', 'Event log cleared - monitoring continues...');
}

/**
 * Check if Lightning Out 2.0 script has loaded
 */
function checkScriptLoad() {
    // The Lightning Out script creates custom elements when it loads
    if (window.customElements && window.customElements.get('lightning-out-application')) {
        AppState.scriptLoaded = true;
        updateStatus(elements.scriptStatus, elements.scriptText, 'success', 'Loaded');
        logEvent('SCRIPT_LOADED', 'Lightning Out 2.0 JavaScript library loaded');
        
        // Set up Lightning Out lifecycle event listeners
        document.addEventListener('lo.application.ready', handleApplicationReady);
        document.addEventListener('lo.application.error', handleApplicationError);
        document.addEventListener('lo.component.ready', handleComponentReady);
        document.addEventListener('lo.component.error', handleComponentError);
        
        logEvent('EVENT_SETUP', 'Lightning Out 2.0 lifecycle listeners registered');
        
        return true;
    }
    return false;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the application
 */
function initApp() {
    logEvent('INIT', 'Lightning Out 2.0 monitoring initialized');
    
    // Set up control event listeners
    elements.sendMessage.addEventListener('click', sendMessageToComponent);
    elements.simulateAuth.addEventListener('click', simulateAuthentication);
    elements.clearLog.addEventListener('click', clearEventLog);
    
    // Check for script loading periodically
    const scriptLoadInterval = setInterval(() => {
        if (checkScriptLoad()) {
            clearInterval(scriptLoadInterval);
            logEvent('READY', 'Ready for authentication and component interaction');
        }
    }, 100);
    
    // Timeout after 10 seconds if script doesn't load
    setTimeout(() => {
        if (!AppState.scriptLoaded) {
            clearInterval(scriptLoadInterval);
            updateStatus(elements.scriptStatus, elements.scriptText, 'error', 'Timeout');
            logEvent('ERROR', 'Lightning Out 2.0 script failed to load', true);
            logEvent('HELP', 'Check network and script URL accessibility');
        }
    }, 10000);
    
    logEvent('SYSTEM', 'Waiting for Lightning Out 2.0 script to load...');
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Global error handling
window.addEventListener('error', (event) => {
    logEvent('ERROR', `${event.message} at ${event.filename}:${event.lineno}`, true);
});

// Page visibility changes (useful for debugging session issues)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        logEvent('PAGE_HIDDEN', 'Page hidden - session may be affected');
    } else {
        logEvent('PAGE_VISIBLE', 'Page visible - session resuming');
    }
});

/**
 * Global access for debugging
 */
window.LightningOutApp = {
    state: AppState,
    elements: elements,
    sendMessage: sendMessageToComponent,
    clearLog: clearEventLog,
    authenticate: simulateAuthentication
};
