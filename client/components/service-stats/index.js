
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class ServiceStats extends Component {
  render() {
    const { service } = this.props;
    const taskDefinition = service.TaskDefinition.split('task-definition/')[1];
    const classes = classname({
      [styles.ServiceStats]: true,
      [styles['ServiceStats--left-aligned']]: this.props.left
    });
    return (
      <div className={classes}>
        <table>
          <tbody>
            <tr>
              <th>task def</th>
              <td>{taskDefinition}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};
