
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class ContainerStats extends Component {
  render() {
    const { container } = this.props;
    const taskDefinition = container.stats.docker_id;
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
