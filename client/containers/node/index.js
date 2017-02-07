
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classname from 'classname';
import moment from 'moment';
import qs from 'querystring';
import { Link, browserHistory } from 'react-router';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';
import Sheet from '../../components/sheet';
import ServiceEventList from '../../components/service-event-list';
import NodeStats from '../../components/node-stats';
import NodeTaskDef from '../../components/node-task-def';
import styles from './index.css';

const activeLinkStyle = {
  borderBottomColor: '#fff',
  color: '#54585E',
};

export default class Node extends Component {
  constructor() {
    super()
    const hash = window.location.hash.slice(1)
    const map = qs.decode(hash)
    this.state = {
      tab: map.tab
    }
  }

  render() {
    return (
      <div className={styles.Node}>
        <Sheet onClose={::this.closeSheet}>
          <h1 tabIndex="-1" ref="heading">{this.props.node.PublicDnsName}</h1>
          <NodeStats node={this.props.node} left={true} />
          <Tabs handleSelect={::this.selectTab} selectedTab={this.state.tab} className={styles.NodeTabs} activeLinkStyle={activeLinkStyle}>
            <nav className={styles['NodeTabs-navigation']}>
              <ul>
                <li>
                  <a href="#tab=task_def">
                    <TabLink to="task_def">Task Def</TabLink>
                  </a>
                </li>
                <li>
                  <a href="#tab=events">
                    <TabLink to="events">Events</TabLink>
                  </a>
                </li>
              </ul>
            </nav>

            <div className={styles['NodeTabs-content']}>
              <TabContent for="task_def">
                <NodeTaskDef
                  tasks={this.props.node.Tasks} />
              </TabContent>
              <TabContent for="events">
{/*                <ServiceEventList events={this.props.service.events} />*/}
              </TabContent>
            </div>
          </Tabs>
        </Sheet>
      </div>
    );
  }

  /**
   * Select the given `tab`.
   */

  selectTab(tab) {
    this.setState({ tab: tab })
  }

  /**
   * Close the sheet.
   */

  closeSheet() {
    const clusterName = this.props.clusterName;
    browserHistory.push(`/${clusterName}`);
  }

  /**
   * Put focus in the sheet.
   */

  componentDidMount() {
    findDOMNode(this.refs.heading).focus();
  }
};
