
import React, { Component } from 'react';
import classname from 'classname';
import moment from 'moment';
import { Link } from 'react-router';
import ServiceStats from '../service-stats';
import styles from './index.css';

export default class ServiceList extends Component {
  render() {
    const matchingServices = this.matchingServices();
    let services = [];
    for (let i = 0; i < matchingServices.length; i++) {
      for (let j = 0; j < matchingServices[i].Services.length; j++) {
        matchingServices[i].Services[j].ClusterName = matchingServices[i].ClusterName;
        services.push(matchingServices[i].Services[j]);
      }
    }
    return (
      <ul className={styles.ServiceList}>
        {services.map(::this.renderServiceItem)}
      </ul>
    );
  }

  renderServiceItem(service, n) {
    return (
      <li key={n + '/' + service.ServiceArn} className={styles.ServiceListItem}>
        <Link to={`/${service.ClusterName}/service/${service.ServiceName}`}>
          <h3>{service.ServiceName}</h3>
          <ServiceStats service={service} />
        </Link>
      </li>
    );
  }

  matchingServices() {
    const clusters = this.props.clusters;
    const activeClusterName = this.props.activeClusterName;
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

    let servicesByRegion = [];
    if (activeClusterName) {
      for (let i = 0; i < clustersByRegion.length; i++) {
        if (activeClusterName === clustersByRegion[i].ClusterName) {
          let servicesObj = {};
          servicesObj.ClusterName = activeClusterName;
          servicesObj.Services = clustersByRegion[i].Services;
          servicesByRegion.push(servicesObj);
        }
      }  
    } else {
      for (let i = 0; i < clustersByRegion.length; i++) {
        let servicesObj = {};
        servicesObj.ClusterName = clustersByRegion[i].ClusterName;
        servicesObj.Services = clustersByRegion[i].Services;
        servicesByRegion.push(servicesObj);
      }  
    }

    return servicesByRegion;
  }
};
