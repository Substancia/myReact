import React from 'react';
import axios from 'axios';
//import ls from 'local-storage';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      bufferText: "",
    }
  }

  componentDidMount() {
   this.getList();
  }

  getList = () => {
    fetch('/api/getList')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }

  inputChange(e) {
    this.setState({bufferText: e.target.value});
  }

  addItem() {
    var d = new Date();
    var n = d.getFullYear() + ":" + ("0" + (d.getMonth() + 1)).slice(-2) + ":" + ("0" + d.getDate()).slice(-2) + ":" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    this.setState({list: this.state.list.concat({text: this.state.bufferText, time: n}), bufferText: ""});
//    ls.set('list', this.state.list.concat({text: this.state.bufferText, time: n}));
    axios.post('/add', {text: this.state.bufferText, time: n})
    .then(() => console.log('Record Created!'))
    .catch(err => {
      console.error(err);
    });
  }

  removeItem(index) {
    var item = this.state.list;
    axios.post('/delete', {text: item[index].text})
    .then(() => console.log('Record Deleted!'))
    .catch(err => {
      console.error(err);
    });
    item.splice(index, 1);
    this.setState({list: item});
  }

  render() {
//    console.log(this.state.list);
    const list = this.state.list.map((item, index) => {
      return <tr className="listView" key={index}><td>{item.time}</td><td><a rel="noopener noreferrer" target="_blank" href={item.text}>{item.text}</a></td><td><button onClick={() => this.removeItem(index)}>X</button></td></tr>
    });

    return (
      <div className="container">
        <input value={this.state.bufferText} onChange={(e) => this.inputChange(e)} />
        <button onClick={() => this.addItem()}>Add</button>
        <table className="table">
          <tbody>
            {list}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
