
import React, { Component } from 'react';
import request from 'superagent';
import Batch from 'batch';
import flatten from 'flatten';
import Loader from 'react-loader';
import Page from '../../components/page';
import ErrorMessage from '../../components/error-message';
import Sidebar from '../../components/sidebar';
import ServiceList from '../../components/service-list';
import NodeList from '../../components/node-list';
import Node from '../node';

export default class ClustersContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      error: null,
      clusters: [],
      activeClusterName: null,
      currentTimeout: null
    };
  }

  /**
   * Render.
   */

  render() {
    const activeClusterName = this.getActiveClusterName();
    const isLoading = !!this.state.error || !!this.state.clusters.length;
    return (
      <Page>
        <Sidebar
          clusters={this.state.clusters}
          activeClusterName={activeClusterName}
          searchTerm={this.state.searchTerm}
          setSearchTerm={::this.setSearchTerm}
          selectCluster={::this.setActiveCluster} />

        <Loader loaded={isLoading} color="#3cc76a">
          {this.renderError()}
          <ServiceList
            clusters={this.state.clusters}
            activeClusterName={activeClusterName}
            region={this.state.searchTerm} />
          <NodeList
            clusters={this.state.clusters}
            activeClusterName={activeClusterName}
            region={this.state.searchTerm} />
        </Loader>
        {this.renderNodeSheet()}
      </Page>
    )
  }

  /**
   * Get the active cluster Name.
   */

  getActiveClusterName() {
    if (this.state.activeClusterName) {
      return this.state.activeClusterName;
    }

    const clusterName = this.props.params.clusterName;
    const cluster = this.getByName('Cluster', clusterName);
    // TODO: if no matching cluster, show an error
    return cluster && cluster.ClusterName;
  }

  /**
   * Set the current search term.
   */

  setSearchTerm(str) {
    this.setState({ searchTerm: str });
  }

  /**
   * Set the active cluster Name.
   */

  setActiveCluster(cluster) {
    this.setState({
      activeClusterName: cluster && cluster.ClusterName
    });
  }

  /**
   * Render the service sheet.
   */

  renderNodeSheet() {
    const nodeInstanceId = this.props.params.nodeInstanceId;
    if (!nodeInstanceId) return null;
    const node = this.getNodeByInstanceId(nodeInstanceId);
    if (!node) return null;
    const clusterName = this.props.params.clusterName;
    // TODO: if no matching node is found, show an error
    return <Node node={node} clusterName={clusterName}/>
  }

  /**
   * Render the error.
   */

  renderError() {
    return this.state.error
      ? <ErrorMessage error={this.state.error} />
      : null;
  }

  /**
   * Get item of `type` by its `name`.
   */

  getByName(type, name) {
    const items = this.state.clusters;
    const prop = `${type}Name`;
    for (let i = 0; i < items.length; i++) {
      const item = items[i].Clusters;
      if (item[prop] === name) {
        return item;
      }
    }

    return null;
  }

  /**
   * Get node instance by instanceId.
   */

  getNodeByInstanceId(instanceId) {
    const items = this.state.clusters;
    for (let i = 0; i < items.length; i++) {
      const nodeInfos = items[i].Clusters.NodeInfos;
      for (let key in nodeInfos) {
        if (nodeInfos[key].Instance.InstanceId === instanceId) {
          return nodeInfos[key];
        }
      }
    }

    return null;
  }

  /**
   * Fetch data.
   */

  fetchClustersData(nextFetchTimeout) {
    request
    .get('/api/clusters')
    .end(function(err, res) {
      if (err) {
        return this.setState({ error: err.message });
      }

      const deps = res.body;

      // Flatten the Clusters from query result
      let clustersArray = [];
      for (let i = 0; i < deps.length; i++) {
        let clustersObj = {};
        clustersObj.Region = deps[i].Region;

        for (let cluster of deps[i].Clusters) {

          if (cluster.Services.length !== 0 &&
              Object.keys(cluster.NodeInfos).length !== 0) {

            // Try to get monitor's dns address
            let monitorTaskDefinitionArn;
            for (let service of cluster.Services) {
              if (service.ServiceName === "monitor-service")
                monitorTaskDefinitionArn = service.TaskDefinition;
            }
            if (monitorTaskDefinitionArn) {
              for (let node of cluster.NodeInfos) {
                for (let task of node.Tasks) {
                  if (task.TaskDefinitionArn === monitorTaskDefinitionArn)
                    cluster.MonitorDnsAddress = node.PublicDnsName;
                }
              }
            }

            clustersArray.push(Object.assign(
              {}, clustersObj, { Clusters: cluster }
            ));

          }
        }
      }

      this.setState({
        clusters: clustersArray
      });

      if (nextFetchTimeout) {
        const timeout = setTimeout(
          this.fetchClustersData.bind(this, nextFetchTimeout),
          nextFetchTimeout
        );
        this.setState({
          currentTimeout: timeout
        });
      }

    }.bind(this));
  }

  componentDidMount() {
    // TODO: Customizable interval time
    this.fetchClustersData(30 * 1000);
  }
};
