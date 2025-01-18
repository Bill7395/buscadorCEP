import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './styles.css'; 

import api from './services/api';

function App() {
  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});
  const [error, setError] = useState(null);

  // Função para validar o CEP
  const validateCEP = (cep) => {
    return /^[0-9]{5}-?[0-9]{3}$/.test(cep);
  };

  async function handleSearch(){
    if(input === ''){
      alert("Preencha algum CEP!");
      return;
    }

    if (!validateCEP(input)) {
      alert("CEP inválido! Digite um CEP no formato XXXXX-XXX.");
      return;
    }

    setError(null); // Reseta o erro antes da nova busca

    try {
      const response = await api.get(`${input}/json`);
      if (response.data.erro) {
        setError("CEP não encontrado!");
        setCep({});
      } else {
        setCep(response.data);
      }
      setInput("");
    } catch (error) {
      setError("Erro ao buscar CEP. Tente novamente.");
      setCep({});
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className='title'>Buscador CEP</h1>

      <div className="containerInput">
        <input 
          type="text" 
          placeholder="Digite seu CEP..."
          value={input}
          onChange={(e) => setInput(e.target.value)} 
        />
        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="white"/>
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {Object.keys(cep).length > 0 && !error && (
        <main className='main'>
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          {cep.complemento && <span>{cep.complemento}</span>}
          <span>{cep.bairro}</span>
          <span>{cep.localidade} - {cep.uf}</span>
        </main>
      )}
    </div>
  );
}

export default App;
