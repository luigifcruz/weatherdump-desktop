import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ReactSVG from 'react-svg';

@inject('store')
@observer
class ListItem extends Component {
  toggleItem() {
    this.props.cell.Activated = !this.props.cell.Activated;
  }

  render() {
    let { Activated, Name } = this.props.cell;

    return (
      <div
        onClick={() => this.toggleItem()}
        className={Activated ? 'mtx-cell cell-active' : 'mtx-cell'}
      >
        <div className="Label">{Name}</div>
        <ReactSVG src="/icons/check.svg" />
      </div>
    );
  }
}

export default ListItem;
