
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class NodeTaskDef extends Component {
  render() {
    const tasks = this.props.tasks;
    return (
      <div className={styles.NodeTaskDef}>
        {tasks.map(::this.renderItem)}
      </div>
    );
  }

  renderItem(task, n) {
    const taskArn = task.TaskArn.split('task/')[1];
    return (
      <table key={n + '/' + taskArn}>
        {task.Containers.map(::this.renderContainersItem)} 
        <tbody>
          <tr>
            <th>TaskArn</th>
            <td>{taskArn}</td>
          </tr>
          <tr>
            <th>TaskDefinitionArn</th>
            <td>{task.TaskDefinitionArn}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderContainersItem(container, n) {
    const containerArn = container.ContainerArn.split('container/')[1];
    return (
      <tbody key={n + '/' + containerArn}>
        <tr>
          <th>ContainerArn</th>
          <td>{containerArn}</td>
        </tr>
        <tr>
          <th>ContainerName</th>
          <td>{container.Name}</td>
        </tr>
      </tbody>
    );
  }
};
