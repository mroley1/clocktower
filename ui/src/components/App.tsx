import './App.scss';
import { GameDataJSONTag } from './common/GameData';
import { useLoaderData, useNavigate } from 'react-router';

function App() {

  const navigate = useNavigate();
  
  function handleLoadSave(saveId: number) {
    navigate("/" + saveId)
  }
  
  function handleScriptMenu() {
    navigate("/script");
  }
  
  const loaderData: {saves: GameDataJSONTag[]} = useLoaderData();
  
  return <div>
    <br></br>
    <br></br>
    <button onClick={handleScriptMenu}>script menu</button>
    <br></br>
    {loaderData.saves.map((save) => 
      <div
        key={save.gameID}
        onClick={()=>{handleLoadSave(save.gameID)}}
      >
          {JSON.stringify(save)}
      </div>
    )}
  </div>
}

export default App;
