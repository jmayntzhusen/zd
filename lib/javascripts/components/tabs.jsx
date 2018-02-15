import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { connect } from 'react-redux';
import { setActiveTab } from "../actions/tabs";
import '../../stylesheets/tabs.scss';


/**
 * The tabs expects the tabsActiveReducer to be applied to state.tab_active
 *
 * Example usage:
 *
 * <Tabs>
 *   <Tab title={'Foo'}>
 *     <Loading/>
 *   </Tab>
 *   <Tab title={'Bar'}>
 *     <p>Bar</p>
 *   </Tab>
 * </Tabs>
 */


function propTypeTab(props, propName, componentName) {
  if(props[propName].type !== Tab) {
    return new Error(`'${componentName}' children should be of type Tab'.`);
  }

  return null;
}


function makeTabsID(length=13) {
  return Math.random().toString(36).substr(2, length)
}


/**
 * Component Tabs
 */
class Tabs extends React.Component {
  constructor(props) {
    super(props);

    // Supported themes: tabs, buttons
    this.theme = this.props.theme || 'tabs';

    // Default to randm unique ID
    this.id = this.props.id || makeTabsID();

    // Bind method to scope
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  componentDidMount() {
    if(!this.props.tab_active[this.id] && this.props.children.length > 0) {
      let _tab = this.props.children[0];
      this.setActiveTab(this.props.default || _tab.props.id || 'tab-0')
    }
  }

  setActiveTab(key) {
    this.props.setActiveTab(this.id, key);
  }

  render() {
    let _tab_active = this.props.tab_active[this.id];

    return (
      <div className={classnames({'c-tab': this.theme === 'tabs'})}>
        <ul className={classnames('u-mb', {
          'c-tab__list': this.theme === 'tabs',
          'tab l-btn-group': this.theme === 'buttons'})}>
          {this.props.children.map((tab, i) => {
            let _tab_id = tab.props.id || `tab-${i}`;

            return (
              <li
                key={_tab_id}
                className={classnames({
                  'c-tab__list__item': this.theme === 'tabs',
                  'c-btn': this.theme === 'buttons',
                  'is-selected': _tab_id === _tab_active})}
                onClick={() => this.setActiveTab(_tab_id)}>
                {tab.props.title}
              </li>
            );
          })}
        </ul>
        <div>
          {this.props.children.map((tab, i) => {
            let _tab_id = tab.props.id || `tab-${i}`;
            return _tab_id === _tab_active ? tab.props.children : ''
          })}
        </div>
      </div>
    );
  }
}


Tabs.propTypes = {
  id: PropTypes.string,
  children: PropTypes.arrayOf(propTypeTab),
  tab_active: PropTypes.object,
  default: PropTypes.string,
  theme: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    tab_active: state.tab_active,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveTab: (id, tab) => dispatch(setActiveTab(id, tab)),
  }
};


/**
 * Component Tab
 */
export class Tab extends React.Component {
  render() {
    return this.props.children;
  }
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
};


const _Tabs = connect(mapStateToProps, mapDispatchToProps)(Tabs);

export { _Tabs as Tabs };
