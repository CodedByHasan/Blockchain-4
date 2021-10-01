'use strict';

// eslint-disable-next-line no-undef
class LikeButton extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { liked: false };
    }

    render() 
    {
        if (this.state.liked) 
        {
            return 'You liked this.';
        }

        return (
            <button onClick={() => this.setState({ liked: true }) }>
        Like
            </button>
        );
    }
}

let domContainer = document.querySelector('#root');
// eslint-disable-next-line no-undef
ReactDOM.render(<LikeButton />, domContainer);
