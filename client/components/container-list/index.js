
import React, { Component } from 'react';
import classname from 'classname';
import { Link } from 'react-router';
// import NodeStats from '../node-stats';
import styles from './index.css';

export default class ContainerList extends Component {
  render() {
    const containers = this.matchingContainers();
    return (
      <ul className={styles.ContainerList}>
        {containers.map(::this.renderContainerItem)}
      </ul>
    );
  }

  renderContainerItem(container, n) {
    return (
      <li key={`${n}/${container.ResourceId}`} className={styles.ContainerListItem}>
        <Link to={container ? `/${this.props.activeClusterName}/container/${container.ResourceId}` : '/'}>
          <h3>{container.DisplayName}</h3>
          {/*<NodeStats node={node} />*/}
        </Link>
      </li>
    );
  }

  matchingContainers() {
    const clusters = this.props.clusters;
    const region = (this.props.region || '').toLowerCase();
    const activeClusterName = this.props.activeClusterName;

    let clustersByRegion = [];
    if (activeClusterName) {
      if (region) {
        for (let cluster of clusters) {
          if (region === cluster.Region.toLowerCase()
              && activeClusterName === cluster.Clusters.ClusterName)
            clustersByRegion.push(cluster.Clusters);
        }
      } else {
        for (let cluster of clusters) {
          if (activeClusterName === cluster.Clusters.ClusterName)
            clustersByRegion.push(cluster.Clusters);
        }
      }
    }

    let containersByCluster = [];
    for (let cluster of clustersByRegion) {
      for (let node of cluster.NodeInfos) {
        for (let task of node.Tasks) {
          containersByCluster = containersByCluster.concat(task.Containers);
        }
      }
    }

    return containersByCluster;
  }
};
