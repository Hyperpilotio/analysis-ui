
import React, { Component } from 'react';
import classname from 'classname';
import { Link } from 'react-router';
import styles from './index.css';

export default class ClusterList extends Component {
  render() {
    const clusters = this.matchingClusters();
    return (
      <div className={styles.ClusterList}>
        <h2>clusters</h2>
        <ul>
          {this.renderItem(null)}
          {clusters.map(::this.renderItem)}
        </ul>
      </div>
    );
  }

  renderItem(item) {
    const isActive = item
      ? item.ClusterName === this.props.activeClusterName
      : !this.props.activeClusterName;
    const classes = classname({
      [styles.ClusterListItem]: true,
      [styles['ClusterListItem--is-active']]: isActive,
    });
    return (
      <li key={item ? item.ClusterName : 'all_clusters'} className={classes}>
        <Link to={item ? `/${item.ClusterName}` : '/'}>
          {item ? item.ClusterName : 'all'}
        </Link>
      </li>
    );
  }

  matchingClusters() {
    const clusters = this.props.clusters;
    const region = (this.props.region || '').toLowerCase();

    let clustersByRegion = [];
    if (region) {
      for (let i = 0; i < clusters.length; i++) {
        if (region === (clusters[i].Region).toLowerCase()) {
          clustersByRegion.push(clusters[i].Clusters);
        }
      }  
    } else {
      for (let i = 0; i < clusters.length; i++) {
        clustersByRegion.push(clusters[i].Clusters);
      }  
    }

    return clustersByRegion;
  }
};
