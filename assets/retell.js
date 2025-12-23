// Load Retell SDK from CDN
const script = document.createElement('script');
script.src = 'https://unpkg.com/retell-client-js-sdk@latest/dist/retell-client-js-sdk.min.js';
script.onload = initializeRetellWidget;
script.onerror = () => {
  // Fallback to jsdelivr
  const script2 = document.createElement('script');
  script2.src = 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/retell-client-js-sdk.min.js';
  script2.onload = initializeRetellWidget;
  document.head.appendChild(script2);
};
document.head.appendChild(script);

function initializeRetellWidget() {
  try {
    // Try different ways to access the SDK
    let RetellWebClient;
    
    if (window.RetellSDK && window.RetellSDK.RetellWebClient) {
      RetellWebClient = window.RetellSDK.RetellWebClient;
    } else if (window.RetellWebClient) {
      RetellWebClient = window.RetellWebClient;
    } else if (window.Retell && window.Retell.RetellWebClient) {
      RetellWebClient = window.Retell.RetellWebClient;
    } else {
      throw new Error('RetellWebClient not found');
    }

    const client = new RetellWebClient();
    let isCallActive = false;

    // Inject UI
    const fab = document.createElement("div");
    fab.id = "retell-fab";
    fab.innerHTML = "💬";

    const panel = document.createElement("div");
    panel.id = "retell-panel";
    panel.innerHTML = `
      <div id="retell-header">
        <div id="retell-header-content">
          <div id="retell-header-icon">🎧</div>
          <div id="retell-header-text">
            <h4>Voice Assistant</h4>
            <p>Live Voice Agent</p>
          </div>
        </div>
        <button id="retell-close">×</button>
      </div>
      <div id="retell-content">
        <div id="retell-instruction">
          Tap the call button to start talking.
        </div>
        <div id="retell-status-section">
          <span id="retell-status-label">Status:</span>
          <span id="retell-status" class="offline">Offline</span>
        </div>
        <button id="retell-call-button" class="start">
          <span id="retell-call-icon">📞</span>
          <span id="retell-call-text">Call</span>
        </button>
        <div id="retell-transcript-container">
          <div id="retell-transcript"></div>
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const statusEl = document.getElementById("retell-status");
    const callButton = document.getElementById("retell-call-button");
    const callText = document.getElementById("retell-call-text");
    const callIcon = document.getElementById("retell-call-icon");
    const transcriptContainer = document.getElementById("retell-transcript-container");

    // Event handlers
    fab.onclick = () => {
      const isVisible = panel.style.display !== "none";
      panel.style.display = isVisible ? "none" : "block";
    };

    document.getElementById("retell-close").onclick = () => {
      panel.style.display = "none";
    };

    callButton.onclick = async () => {
      if (!isCallActive) {
        // Start call
        try {
          statusEl.innerText = "Connecting...";
          statusEl.className = "connecting";
          callButton.disabled = true;
          
          const res = await fetch(RETELL_CONFIG.makeWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const responseText = await res.text();
          let accessToken = responseText.trim();

          await client.startCall({
            accessToken: accessToken,
            sampleRate: 24000,
            enableUpdate: true
          });

        } catch (error) {
          console.error('Failed to start call:', error);
          statusEl.innerText = "Connection failed";
          statusEl.className = "offline";
          callButton.disabled = false;
        }
      } else {
        // End call
        client.stopCall();
      }
    };

    // Event listeners
    client.on("call_started", () => {
      console.log("Call started");
      statusEl.innerText = "Connected";
      statusEl.className = "online";
      isCallActive = true;
      callButton.className = "end";
      callButton.disabled = false;
      callText.innerText = "End Call";
      callIcon.innerText = "📞";
      transcriptContainer.classList.add("show");
    });

    client.on("call_ended", () => {
      console.log("Call ended");
      statusEl.innerText = "Offline";
      statusEl.className = "offline";
      isCallActive = false;
      callButton.className = "start";
      callButton.disabled = false;
      callText.innerText = "Call";
      callIcon.innerText = "📞";
    });

    client.on("agent_start_talking", () => {
      statusEl.innerText = "Agent speaking...";
      statusEl.className = "online";
    });

    client.on("agent_stop_talking", () => {
      statusEl.innerText = "Listening...";
      statusEl.className = "online";
    });

    client.on("update", (update) => {
      if (update.transcript && update.transcript.length > 0) {
        const transcriptDiv = document.getElementById("retell-transcript");
        const transcriptText = update.transcript
          .map(t => `${t.role === 'agent' ? 'Agent' : 'You'}: ${t.content}`)
          .join('\n\n');
        transcriptDiv.innerText = transcriptText;
        transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
      }
    });

    client.on("error", (error) => {
      console.error("Retell error:", error);
      statusEl.innerText = "Error occurred";
      statusEl.className = "offline";
      isCallActive = false;
      callButton.className = "start";
      callButton.disabled = false;
      callText.innerText = "Call";
      callIcon.innerText = "📞";
    });

  } catch (error) {
    console.error('Failed to initialize Retell widget:', error);
  }
}