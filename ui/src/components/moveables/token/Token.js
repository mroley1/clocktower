import './Token.css';

function Token(props) {
  return (
    <li>
        {JSON.stringify(props.json)}
    </li>
  );
}

export default Token;
