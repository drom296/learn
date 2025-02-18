import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TopicsScreen.css';
import * as topicsActions from '../store/topics/actions';
import * as topicsSelectors from '../store/topics/reducer';
import ListView from '../components/ListView';
import ListRow from '../components/ListRow';

class TopicsScreen extends Component {
  componentDidMount() {
    this.props.dispatch(topicsActions.fetchTopics());
  }

  render() {
    if (!this.props.rowsById) return this.renderLoading();
    return (
      <div className="TopicsScreen">
        <ListView
          rowsIdArray={this.props.rowsIdArray}
          rowsById={this.props.rowsById}
          renderRow={this.renderRow}
        />

        {!this.props.canFinalizeSelection
          ? false
          : <button className="NextScreen" onClick={this.onNextScreenClick} />}
      </div>
    );
  }

  renderLoading() {
    return <p>Loading...</p>;
  }

  renderRow = (rowId, row) => {
    const selected = this.props.selectedRowsById[rowId];
    return (
      <ListRow rowId={rowId} onClick={this.onRowClick} selected={selected}>
        <h3>
          {row.title}
        </h3>
        <p>
          {row.description}
        </p>
      </ListRow>
    );
  };

  onRowClick = rowId => {
    this.props.dispatch(topicsActions.selectTopic(rowId));
  };

  onNextScreenClick = () => {
    this.props.dispatch(topicsActions.finalizeTopicSelection());
  };
}

// which props do we want to inject, given the global store state?
function mapStateToProps(state) {
  return {
    rowsById: topicsSelectors.getTopicsByUrl(state),
    rowsIdArray: topicsSelectors.getTopicsUrlArray(state),
    selectedRowsById: topicsSelectors.getSelectedTopicsByUrl(state),
    canFinalizeSelection: topicsSelectors.isTopicSelectionValid(state)
  };
}

export default connect(mapStateToProps)(TopicsScreen);
