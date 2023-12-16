import './HeadsUp.scss'
import BoardStateMenu from './guis/BoardStateMenu';

function HeadsUp(props: any) {
  return (
    <div id='heads_up'>
        <BoardStateMenu />
    </div>
  );
}

export default HeadsUp;
