import './App.css';
import firebase from "./firebase";
import { useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const post = async () => {
    try{
      const apiKey = 'MQS4I6GTIFR7GWNICAA4CEZDPENIXQRNNC'; 
      const apiUrl = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      setData(jsonData.result)
      setShowTable(true);
      console.log("jsonData", jsonData.result);
      let data = jsonData.result;
      const database = firebase.database();
      // Push data
      data.map((x,y)=>{
        // if(y===0)(Indivual array get)
        database.ref("Fulldata").push({ 
          "blockNumber": x.blockNumber,
          "confirmations": x.confirmations,
          "input": x.input,
          "nonce": x.nonce,
          "timeStamp": x.timeStamp,
          "tokenName": x.tokenName,
          "tokenSymbol": x.tokenSymbol
        });
       
      })
      console.log("success");
    }catch(err)
    {
      console.error(err);
    }
  }
  return (
    <div className="App">
    <div>
      <h1>Extract data from API to fetch into Firebase</h1>
      <button onClick={post} className="fetch-button">
        Fetch data
      </button>
    </div>
    {showTable && data.length > 0 && (
    <div className="data-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="Black Bold">BlockNumber</th>
            <th className="Black Bold">&nbsp;Confirmations</th>
            <th className="Black Bold">&nbsp;Input</th>
            <th className="Black Bold">&nbsp;Nonce</th>
            <th className="Black Bold">TimeStamp</th>
            <th className="Black Bold">&nbsp;TokenName</th>
            <th className="Black Bold">&nbsp;TokenSymbol</th>
          </tr>
        </thead>
        <tbody>
          {data.map((X, index) => (
            <tr key={index}>
              <td className="underline-cell">{X.blockNumber}</td>
              <td className="underline-cell">&nbsp;{X.confirmations}</td>
              <td className="underline-cell">&nbsp;{X.input}</td>
              <td className="underline-cell">&nbsp;{X.nonce}</td>
              <td className="underline-cell">{X.timeStamp}</td>
              <td className="underline-cell">{X.tokenName}</td>
              <td className="underline-cell">{X.tokenSymbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
     {showTable && data.length === 0 && <p>No data to display.</p>}
  </div>
  );
}

export default App;