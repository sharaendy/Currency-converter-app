import React from 'react';
import Block from './Block';
import './styles.scss';

export default function App() {
  const [fromCurrency, setFromCurrency] = React.useState('RUB');
  const [toCurrency, setToCurrency] = React.useState('USD');
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);

  // const [rates, setRates] = React.useState({});
  const ratesRef = React.useRef({});

  const onChangeToPrice = (value) => {
    const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
    setFromPrice(result.toFixed(4));
    setToPrice(value);
  };

  React.useEffect(() => {
    fetch('http://cdn.cur.su/api/latest.json')
      .then((res) => res.json())
      .then((json) => {
        // setRates(json.rates);
        ratesRef.current = json.rates;
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert('ответ от сервера не получен');
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];
    setToPrice(result.toFixed(4));
    setFromPrice(value);
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}
