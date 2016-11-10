import {getContentTitle, getChannelName} from '../scripts/formatting.js';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      publisher: '0x0',
      timestamp: '0',
      loading: true,
      retries: 10,
      error: ''
    };
  }

  componentDidMount() {
    var contentID = web3.toBigNumber(this.props.id);
    publisher.Publish({contentID: contentID}, {fromBlock: 0, toBlock: 'latest'}).get((error, post) => {
      publisher.Store({contentID: contentID}, {fromBlock: 0, toBlock: 'latest'}).get((error, content) => {
        if (!post || !content || post.length == 0 || content.length == 0) {
          this.setState({
            loading: false,
            retries: 0
          });
        }
        else {
          this.setState({
            title: getContentTitle(content[0].args.attributes),
            body: JSON.parse(content[0].args.document).body,
            publisher: post[0].args.accountID,
            channelName: getChannelName(post[0].args.channelID),
            timestamp: post[0].args.timestamp * 1000,
            loading: false
          });
        }
      });
    });
  }

  componentDidUpdate() {
    document.getElementById('post-'+this.props.id).innerHTML = marked(this.state.body);
  }

  render() {
    return (
      <div>
        <div style={{maxWidth: '600px', margin: '0 auto', padding: '1.5em 0'}}>
          <div style={{padding: '0 1em', color: 'dimgray'}}>
            <div style={{display: !this.state.loading ? 'block' : 'none'}}>
              <div style={{float: 'left'}}>
                <span>Published by </span>
                <a href={`#/account/${this.state.publisher}`}>{`${this.state.publisher.substr(0,5)}...${this.state.publisher.substr(-3)}`}</a>
                <span>{` in `}</span>
                <a href={`#/channel/${this.state.channelName}`}>{`#${this.state.channelName}`}</a>
                &nbsp;
              </div>
              <div style={{float: 'left'}}>
                <span>{`on ${new Date(this.state.timestamp).toLocaleString()}`}</span>
              </div>
              <div style={{float: 'none', clear: 'both'}}></div>
            </div>
            <div style={{fontStyle: 'italic', display: this.state.loading ? 'block' : 'none'}}>Loading...</div>
          </div>
        </div>
        <div style={{backgroundColor: '#FFF'}}>
          <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <div style={{padding: '1.5em 1em', display: this.state.loading ? 'none' : 'block', wordWrap: 'break-word'}}>
              <h1>{this.state.title}</h1>
              <div id={'post-'+this.props.id} className='post'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;