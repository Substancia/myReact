import React from 'react';

class Value extends React.Component {
  render () {
    var idmin = 'minvalue' + this.props.id;
    var idmax = 'maxvalue' + this.props.id;
    var idminlabel = 'labelminvalue' + this.props.id;
    var idmaxlabel = 'labelmaxvalue' + this.props.id;

    return (
      <div>
        <div id={idminlabel}>
          <label id={idmin + 'label'}>Value:</label>
          <input id={idmin} name={idmin} defaultValue='0' onChange={() => this.props.onClick(1, document.getElementById(idmin).value, this.props.linenum)}/><br/>
        </div>
        <div id={idmaxlabel} style={{display: "none"}}>
          <label id={idmax + 'label'}>Value:</label>
          <input id={idmax} name={idmax} defaultValue='0' onChange={() => this.props.onClick(2, document.getElementById(idmax).value, this.props.linenum)}/><br/>
        </div>
      </div>
    );
  }
}

class Condition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'greater than',
    };
  }

  dropdown = () => {
    const id = 'condition' + this.props.id;
    document.getElementById(id).classList.toggle("show");
  }

  render () {
    const conditions = ['greater than','less than','equal to','between'];
    const id = 'condition' + this.props.id;
    let selected = conditions[0];

    const condition = conditions.map((post, index) => 
      <div class="list" onClick={() => {this.setState({selected: post,}); this.props.onClick(this.props.id, post)}}><a>{post}</a><br/></div>
    );

    return (
      <div>
        <button type="button" class="btn btn-outline-secondary btn-sm" id="btn" onClick={this.dropdown}>{this.state.selected}</button>
        <div class="dropdown-content" id={id}>
          {condition}
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metric: [0, 'Average Credit Amount/Month'],
    };
  }

  dropdown = () => {
    document.getElementById("dropdown-content").classList.toggle("show");
  };

  render () {
    const Metric = this.props.Metric;

    const metric = Metric.map((step, move) => 
        <div key={step[0]} class="list" onClick={() => {this.setState({metric: step}); document.getElementById('addbtn').disabled = false}}><a>{step[1]}</a><br/></div>
    );

    return (
      <div>
        <div class="dropdown">
          <button type="button" class="btn btn-outline-secondary btn-sm" id="btn" onClick={this.dropdown}>{this.state.metric[1]}</button>
          <div class="dropdown-content" id="dropdown-content">
            {metric}
          </div>
        </div>
        <button id="addbtn" type="button" class="btn btn-secondary btn-sm" onClick={() => {this.props.onClick(this.state.metric[0]); this.setState({metric: [0, 'Select Metric']}); document.getElementById('addbtn').disabled = true}}>+</button>
      </div>
    );
  }
}

class Lines extends React.Component {
  render () {
    const pol = this.props.pol;
    const cond = this.props.cond;
    return (
      <tr id={pol[0]} key={pol[0]}>
        <td>{pol[1]}</td>
        <td><Condition id={pol[0]} onClick={(i, cond) => this.props.onClick(i, cond)}/></td>
        <td><Value id={pol[0]} cond={cond} onClick={(field, value, ind) => this.props.valueClick(field, value, ind)} linenum={this.props.linenum}/></td>
        <td><button type="button" class="btn btn-secondary btn-sm" onClick={() => this.props.remClick(pol[0])}>X</button></td>
      </tr>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Metric: [
        [0, 'Average Credit Amount/Month'],
        [1, 'Average ATM Credit Amount/Month'],
        [2, 'Average Card Credit Amount/Month'],
        [3, 'Average Cash Credit Amount/Month'],
        [4, 'Average Fund Transfer Credit Amount/Month'],
        [5, 'Average UPI Credit Amount/Month'],
      ],
      policy: [],
      lines: [],
    };
  }

  valueClick(field, value, ind) {
    const policy = this.state.policy.slice();
    const current = policy[ind].slice();
    current[field + 2] = value;
    policy[ind] = current;
    this.setState({policy: policy});
  }

  condition(i, cond) {
    const policy = this.state.policy.slice();
    const lines = this.state.lines.slice();
    var ind;
    const pol = this.state.policy.find(function(post, index) {
      if(post[0] === i) {
        ind = index;
        policy[index][2] = cond;
        return true;
      }
    });
    this.setState({
      policy: policy,
      lines: lines,
    });
    var idmin = 'minvalue' + i;
    var idmax = 'maxvalue' + i;
    var idminlabel = 'labelminvalue' + i;
    var idmaxlabel = 'labelmaxvalue' + i;
    if(cond === 'equal to' || cond === 'greater than') {
      document.getElementById(idmin + 'label').innerHTML = 'Value:'
      document.getElementById(idminlabel).style.display = 'inline-block'
      document.getElementById(idmaxlabel).style.display = 'none'
      document.getElementById(idmax).value = 0;
      this.valueClick(2, 0, ind);
    } else if(cond === 'less than') {
      document.getElementById(idmax + 'label').innerHTML = 'Value:'
      document.getElementById(idminlabel).style.display = 'none'
      document.getElementById(idmaxlabel).style.display = 'inline-block'
      document.getElementById(idmin).value = 0;
      this.valueClick(1, 0, ind);
    } else if(cond === 'between') {
      document.getElementById(idmin + 'label').innerHTML = 'Min:'
      document.getElementById(idmax + 'label').innerHTML = 'Max:'
      document.getElementById(idminlabel).style.display = 'inline-block'
      document.getElementById(idmaxlabel).style.display = 'inline-block'
      this.valueClick(1, 0, ind);
      this.valueClick(2, 0, ind);
    }
  }

  removeClick(i) {
    var rem = this.state.policy.slice();
    var Metric = [];
    const pol = this.state.policy.find(function(post, index) {
      if(post[0] === i) {
        Metric = Metric.concat([rem[index].slice(0, 2)]);
        rem.splice(index, 1);
        return true;
      }
    });
    this.setState({
      Metric: this.state.Metric.concat(Metric).sort(),
      policy: rem,
    });
    document.getElementById(i).remove();
  }

  handleClick(i) {
    var rem = this.state.Metric;
    const pol = this.state.Metric.find(function(post, index) {
      if(post[0] === i) {
        rem.splice(index, 1);
        return true;
      }
    });
    this.setState({
      policy: this.state.policy.concat([pol.concat(['greater than', 0, 0])]),
      lines: this.state.lines.concat(
              <Lines 
                pol={pol} 
                onClick={(i, cond) => this.condition(i, cond)} 
                remClick={() => this.removeClick(pol[0])} 
                cond='greater than' 
                valueClick={(field, value, ind) => this.valueClick(field, value, ind)} 
                linenum={this.state.policy.length} 
              />
            ),
      Metric: rem,
    });
  }

  resetClick() {
    const policy = this.state.policy.slice();
    var Metric = [];
    this.state.policy.forEach((value, index, array) => {
      document.getElementById(value[0]).remove();
      Metric= Metric.concat([policy[index].slice(0, 2)]);
    });

    this.setState({
      policy: [],
      Metric: this.state.Metric.concat(Metric).sort()
    });
  }

  render () {
    return (
        <div class="row">
          <div class="col-10">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Condition</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody id="lines">
                {this.state.lines}
              </tbody>
            </table>
          </div>
          <div class="col">
            <button type="button" class="btn btn-danger btn-sm btn-special">Discard</button><br/>
            <button type="button" class="btn btn-primary btn-sm btn-special" onClick={() => this.resetClick()}>Reset</button><br/>
            <button type="button" class="btn btn-warning btn-sm btn-special">Preview</button><br/>
            <button type="button" class="btn btn-success btn-sm btn-special" onClick={() => {console.log(this.state.policy.sort())}}>Save</button><br/>
          </div>
          <List 
            Metric={this.state.Metric} 
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
    );
  }
}

window.onclick = function(event) {
  if (!event.target.matches('#btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for(var i = 0; i < dropdowns.length; ++i) {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
  }
}

export default Table;
