import './Token.scss';
import Player from '@Common/Player'

function Token(props: any) {
  const json: Player = props.json
  const icon = require(`@assets/icons/${json.role}.png`)
  return (
    <div id={"token_"+json.id} className='container'>
        <img src={icon}></img>
    </div>
  );
}

export default Token;
