# Lightning Out 2.0 - Events & Communication

## 🚀 Simple Lightning Out 2.0 Implementation

A clean, focused implementation of Lightning Out 2.0 with real-time event monitoring and bidirectional communication between host page and embedded Lightning Web Components.

**🔗 [Live Demo](https://[username].github.io/[repository-name])** | **📚 [Lightning Out 2.0 Docs](https://developer.salesforce.com/docs/platform/lwc/guide/use-apps-lightning-out.html)**

## ✨ Features

- **Exact Lightning Out 2.0 Implementation** - Uses the precise code structure you specified
- **Real-time Event Monitoring** - Live console showing all Lightning Out lifecycle events  
- **Bidirectional Communication** - Send/receive messages between host page and LWC
- **Visual Status Tracking** - Clear indicators for script, application, component, and auth status
- **Clean, Simple Interface** - Focused on core functionality without tutorial overhead

## 🏗️ Lightning Out 2.0 Code

This implementation uses exactly the Lightning Out structure you specified:

```html
<!-- Lightning Out 2.0 JavaScript Library -->
<script type="text/javascript" async="" 
    src="https://pronto-5e.my.salesforce.com/lightning/lightning.out.latest/index.iife.prod.js">
</script>

<!-- Lightning Out Application & Component -->
<lightning-out-application components="c-product-browser"></lightning-out-application>
<c-product-browser></c-product-browser>
```

## 🔄 Event Monitoring

### **Lightning Out 2.0 Lifecycle Events**
- `lo.application.ready` - Session established
- `lo.application.error` - Session failed  
- `lo.component.ready` - Component rendered
- `lo.component.error` - Component failed

### **Custom Event Communication**
- **Host → LWC**: Send messages from host page to Lightning components
- **LWC → Host**: Receive responses from embedded components
- Real-time logging of all event communication

## 🚀 Quick Start

### **GitHub Pages Deployment**
1. Fork this repository
2. Go to Settings → Pages
3. Select "main" branch and "/ (root)" folder
4. Access at: `https://[username].github.io/ltngOut`

### **Local Development**
```bash
# Clone and run locally
git clone https://github.com/[username]/ltngOut.git
cd ltngOut

# Start local server
python -m http.server 8000
# or
npx http-server

# Open http://localhost:8000
```

## 🔧 Interactive Controls

- **Send Message to LWC** - Test host page → component communication
- **Simulate Authentication** - Mock frontdoor URL setup for testing
- **Clear Event Log** - Reset the real-time event console

## 📊 Status Monitoring

The interface provides real-time status for:
- **Script Loading** - Lightning Out 2.0 library initialization
- **Application** - Salesforce session establishment
- **Component** - LWC rendering completion  
- **Authentication** - Frontdoor URL configuration

## 💡 Event Communication Example

```javascript
// Send message from host page to LWC
const component = document.querySelector('c-product-browser');
component.dispatchEvent(new CustomEvent('hostMessage', {
    detail: { message: 'Hello from host!' },
    bubbles: true,
    composed: true
}));

// Listen for messages from LWC in host page
component.addEventListener('lwcMessage', (event) => {
    console.log('Received from LWC:', event.detail);
});
```

## 🔐 Authentication

### **Mock Authentication (for testing)**
This implementation includes a "Simulate Authentication" button that sets a mock frontdoor URL for demonstration purposes.

### **Production Implementation**  
```javascript
// Real authentication would be:
const response = await fetch('/api/auth/salesforce');
const { frontdoorUrl } = await response.json();
document.querySelector('lightning-out-application')
    .setAttribute('frontdoor-url', frontdoorUrl);
```

## 📋 Salesforce Setup Required

For real Lightning Out 2.0 deployment:
1. **Lightning Out App** - Create in Lightning Out App Manager
2. **Add Components** - Include your LWCs in the app  
3. **CORS Configuration** - Allow your domain in Salesforce
4. **Authentication** - Set up OAuth or session-based auth

## ⚠️ Common Browser Warnings

### **Iframe Sandbox Security Warning**
You may see this warning in your browser console:
```
An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.
```

**This is expected behavior** - Lightning Out 2.0 creates secure iframes for component isolation. The warning occurs because:

1. **Lightning Out 2.0 Security Model** - Uses iframes with specific sandbox permissions for component isolation
2. **Demo Mode Limitations** - Mock authentication doesn't provide real Salesforce session context
3. **Browser Security** - Modern browsers flag certain iframe configurations as potentially insecure

### **Resolving for Production**

1. **Implement Real OAuth 2.0 Flow**
```javascript
// Instead of mock frontdoor URL, use real session ID
const sessionResponse = await fetch('/api/auth/salesforce');
const { sessionId } = await sessionResponse.json();
lightningApp.setAttribute('session-id', sessionId);
```

2. **Configure Proper CSP Headers**
```html
<meta http-equiv="Content-Security-Policy" 
      content="frame-src https://*.salesforce.com https://*.force.com;">
```

3. **Set Up CORS in Salesforce Org**
   - Add your domain to CORS whitelist in Setup → CORS

## 📚 Resources

- **[Lightning Out 2.0 Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/use-apps-lightning-out.html)**
- **[Lightning Web Components](https://lwc.dev/)**
- **[Salesforce Lightning Design System](https://www.lightningdesignsystem.com/)**

---

**Simple Lightning Out 2.0 implementation with real-time event monitoring and bidirectional communication.**
