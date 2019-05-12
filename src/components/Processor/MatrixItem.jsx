import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class MatrixItem extends Component {
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
        {Name}
      </div>
    );
  }
}

export default MatrixItem;
