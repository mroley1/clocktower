import './Error.scss';

function Error(props: any) {
    
    return (
        <div className='errorContainer'>
            <span className='errorText'>Error</span>
            <br></br>
            <span className='errorMessage'>{props.message}</span>
        </div>
    );
  
}

export default Error;
