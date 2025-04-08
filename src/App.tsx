import { useState } from 'react'
import './App.css'

function App() {
  const [quote, setQuote] = useState({ latin: '', italian: '' })
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '')

  const fetchQuote = async () => {
    if (!apiKey) {
      setShowConfig(true)
      setQuote({
        latin: 'API key required',
        italian: 'Chiave API richiesta'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-maverick:free',
          messages: [{
            role: 'user',
            content: 'Generate a random famous Latin quote with its Italian translation. The response MUST be valid JSON with EXACTLY this format: { "latin": "quote", "italian": "translation" } - nothing else. No additional text, explanations, or formatting outside the JSON object.'
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API')
      }

      let content
      try {
        content = JSON.parse(data.choices[0].message.content)
        if (!content.latin || !content.italian) {
          throw new Error('Invalid quote format received')
        }
        setQuote(content)
      } catch (e) {
        throw new Error(`Failed to parse API response: ${e instanceof Error ? e.message : String(e)}. Response content: ${data.choices[0].message.content}`)
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
      setQuote({
        latin: error instanceof Error ? error.message : 'Error fetching quote',
        italian: error instanceof Error ? 'Errore: ' + error.message : 'Errore nel recupero della citazione'
      })
    } finally {
      setLoading(false)
    }
  }

  const saveApiKey = () => {
    localStorage.setItem('apiKey', apiKey)
    setShowConfig(false)
  }

  return (
    <div className="app">
      <button 
        className="config-button"
        onClick={() => setShowConfig(!showConfig)}
      >
        ⚙️
      </button>

      {showConfig && (
        <div className="config-panel">
          <h3>Configurazione API</h3>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Inserisci la chiave API"
          />
          <button onClick={saveApiKey}>Salva</button>
        </div>
      )}

      <div className="quote-container">
        <h1>Citazioni Latine</h1>
        
        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <>
            <div className="quote">
              <h2>Latino</h2>
              <p>{quote.latin || 'Premi il pulsante per una citazione'}</p>
            </div>
            <div className="quote">
              <h2>Italiano</h2>
              <p>{quote.italian || 'Premi il pulsante per una traduzione'}</p>
            </div>
          </>
        )}

        <button 
          className="fetch-button" 
          onClick={fetchQuote}
          disabled={loading}
        >
          {loading ? 'Caricamento...' : 'Nuova Citazione'}
        </button>
      </div>
    </div>
  )
}

export default App
