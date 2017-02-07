
import React, { Component } from 'react';
import classname from 'classname';
import { Link } from 'react-router';
import styles from './index.css';

export default class NodeList extends Component {
  render() {
    const nodes = this.matchingNodes();
    return (
      <ul className={styles.NodeList}>
        {nodes.map(::this.renderNodeItem)}
      </ul>
    );
  }

  renderNodeItem(item, n) {
    return (
      <li key={n + '/' + item.PublicDnsName} className={styles.NodeListItem}>
        <Link to={item ? `/${this.props.activeClusterName}` : '/'}>
          <h3>{item.PublicDnsName}</h3>
          {/*<ServiceStats service={service} />*/}
        </Link>
      </li>
    );
  }

  matchingNodes() {
    const clusters = this.props.clusters;
    const region = (this.props.region || '').toLowerCase();
    const activeClusterName = this.props.activeClusterName;

    let clustersByRegion = [];
    if (activeClusterName) {
      if (region) {
        for (let i = 0; i < clusters.length; i++) {
          if (region === (clusters[i].Region).toLowerCase()
            && activeClusterName === clusters[i].Clusters.ClusterName) {
            clustersByRegion.push(clusters[i].Clusters);
          }
        }  
      } else {
        for (let i = 0; i < clusters.length; i++) {
          if (activeClusterName === clusters[i].Clusters.ClusterName) {
            clustersByRegion.push(clusters[i].Clusters);
          }
        }  
      }
    }

    let nodesByCluster = [];
    for (let i = 0; i < clustersByRegion.length; i++) {
      for (let key in clustersByRegion[i].NodeInfos) {
        nodesByCluster.push(clustersByRegion[i].NodeInfos[key]);
      }
    } 

    return nodesByCluster;
  }
};
