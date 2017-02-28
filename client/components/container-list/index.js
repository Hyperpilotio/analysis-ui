
import React, { Component } from 'react';
import update from 'immutability-helper';
import classname from 'classname';
import { Link } from 'react-router';
import ContainerStats from '../container-stats';
import styles from './index.css';

export default class ContainerList extends Component {
  constructor() {
    super();
    this.state = {
      influxData: {
        docker_ids: {}
      }
    };
  }

  render() {
    const containersByCluster = this.matchingContainers();
    return (
      <ul className={styles.ContainerList}>
        {Object.entries(containersByCluster).map(function([cluster, containers]) {
          return containers.map(function(container, n) {
            return ::this.renderContainerItem(cluster, container, n)
          }.bind(this));
        }.bind(this))}
        {/*containers.map(::this.renderContainerItem)*/}
      </ul>
    );
  }

  renderContainerItem(cluster, container, n) {
    container.stats = {};
    for (let row of (this.state.influxData.docker_ids[cluster] || [])) {
      if (row.last_value.startsWith(container.DockerNamePrefix)) {
        container.stats.docker_id = row.docker_id;
      }
    }
    return (
      <li key={`${n}/${container.ResourceId}`} className={styles.ContainerListItem}>
        <Link to={container ? `/${this.props.activeClusterName}/container/${container.ResourceId}` : '/'}>
          <h3>{container.DisplayName}</h3>
          <ContainerStats container={container} />
        </Link>
      </li>
    );
  }

  matchingContainers() {
    const clusters = this.props.clusters;
    const region = (this.props.region || '').toLowerCase();
    const activeClusterName = this.props.activeClusterName;

    let clustersByRegion = [];
    // let clusterStats = [];
    if (activeClusterName) {
      if (region) {
        for (let cluster of clusters) {
          if (region === cluster.Region.toLowerCase()
              && activeClusterName === cluster.Clusters.ClusterName)
            clustersByRegion.push(cluster.Clusters);
        }
      } else {
        for (let cluster of clusters) {
          if (activeClusterName === cluster.Clusters.ClusterName) {
            clustersByRegion[`${cluster.Region}:${cluster.Clusters.ClusterName}`] =
              cluster.Clusters;
            // clusterStats.push(cluster.Clusters.Influx.query`
            //   SELECT last(*) FROM "intel/docker/spec/name"
            //   WHERE value =~ /\/ecs-/ GROUP BY docker_id;
            // `);
          }
        }
      }
    }

    let containersByCluster = {};
    for (let cluster in clustersByRegion) {
      containersByCluster[cluster] = [];
      // TODO: Only show containers on the same node as snap
      for (let node of clustersByRegion[cluster].NodeInfos) {
        for (let task of node.Tasks) {
          containersByCluster[cluster] =
            containersByCluster[cluster].concat(task.Containers);
        }
      }
      ::this.fetchDockerIds(cluster, clustersByRegion[cluster].Influx);
    }

    return containersByCluster;
  }

  fetchDockerIds(cluster, influx) {
    influx.query`
      SELECT last(*) FROM "intel/docker/spec/name"
      WHERE value =~ /\\/ecs-/ GROUP BY docker_id;
    `.then(function(rows) {
      let setting = {};
      setting[cluster] = rows;
      this.setState(update(this.state, {
        influxData: {docker_ids: {$set: setting}}
      }));
    }.bind(this));
  }
};
