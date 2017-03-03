
import React, { Component } from 'react';
import styles from './index.css';

export default class Page extends Component {
  render() {
    return (
      <div className={styles.Page}>
        <header>
          <h1>Hyperpilot-specs</h1>
          <p>ecs regions</p>
        </header>
        <div className={styles.PageContent}>
          {this.props.children}
        </div>
      </div>
    )
  }
};
