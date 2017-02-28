
import React, { Component } from 'react';
import moment from 'moment';
import filesize from 'filesize';
import classname from 'classname';
import styles from './index.css';

export default class ContainerStats extends Component {
  render() {
    // TODO: Generalize stats list
    const { container } = this.props;
    const dockerId = container.stats.docker_id;
    const totalCpu = container.stats.cpu_total_usage;
    const memoryUsage = container.stats.memory_usage;
    const classes = classname({
      [styles.ServiceStats]: true,
      [styles['ServiceStats--left-aligned']]: this.props.left
    });
    return (
      <div className={classes}>
        <table>
          <tbody>
            <tr>
              <th>Docker ID</th>
              <td>{dockerId}</td>
            </tr>
            <tr>
              <th>CPU total usage</th>
              <td>{totalCpu && filesize(totalCpu)}</td>
            </tr>
            <tr>
              <th>Memory Usage</th>
              <td>{memoryUsage && filesize(memoryUsage)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};
