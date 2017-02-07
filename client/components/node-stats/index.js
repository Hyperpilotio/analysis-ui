
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class NodeStats extends Component {
  render() {
    const { node } = this.props;
    const instanceId = node.Instance.InstanceId;
    const instanceType = node.Instance.InstanceType;
    const updated = moment(node.Instance.LaunchTime).fromNow();
    const classes = classname({
      [styles.NodeStats]: true,
      [styles['NodeStats--left-aligned']]: this.props.left
    });
    return (
      <div className={classes}>
        <table>
          <tbody>
            <tr>
              <th>InstanceId</th>
              <td>{instanceId}</td>
            </tr>
            <tr>
              <th>InstanceType</th>
              <td>{instanceType}</td>
            </tr>
            <tr>
              <th>Updated</th>
              <td>{updated}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};
