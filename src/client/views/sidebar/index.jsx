import React from 'react';
import Tree from 'react-ui-tree';
import Menu from 'rc-menu';
import WorkingstepList from './workingstepslist';
import WorkplanList from './workplanlist';
import ToolList from './toollist';
import ToleranceList from './tolerancelist';
import PropertiesPane from './propertiespane';
import ReactTooltip from 'react-tooltip';
import cadManager from '../../models/cad_manager';
let MenuItem = Menu.Item;
let scrolled=false;

export default class SidebarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedEntity : null };

        let disabledView = (name) => {
          return (() => {
            this.props.cbMode("disabled");
            this.props.cbAltMenu(name);
          }).bind(this);
        };

        let self = this;
        let updateWorkingstep = (state) => {
            self.props.cbWS(state);
            return;
        };

        this.selectMenuItem = this.selectMenuItem.bind(this);
        this.openProperties = this.openProperties.bind(this);

        this.props.actionManager.on('change-workingstep', updateWorkingstep);
    }

    componentDidMount(){
    }

    selectMenuItem (info) {
        this.props.cbMode(info.key);
    }
    
    openProperties(node) {
        this.setState({selectedEntity: node});
    }
    
    render() {
      // TODO currently mode menu can only have two layers
      let nested = this.props.mode != "tree";
        
      let properties = <PropertiesPane 
              entity={this.state.selectedEntity}
              pid={this.props.pid}
              ws={this.props.ws}
              clearEntity={(event) => {this.setState({selectedEntity: null});}}
              propertiesCb = {this.openProperties}
          />;
        
      const modeMenu = (
          <Menu onSelect={this.selectMenuItem}
                defaultSelectedKeys={[this.props.mode]}
                mode='horizontal'
                className='sidebar-menu-tabs'>
              <MenuItem key='ws' id='sidebar-menu-ws' className='ws'>Workingsteps</MenuItem>
              <MenuItem key='tree' id='sidebar-menu-tree' className='wp'>Workplan</MenuItem>
              <MenuItem key='tools' id='sidebar-menu-tools' className='tool'>Tools</MenuItem>
              <MenuItem key='tolerance' id='sidebar-menu-tolerance' className='tolerance'>Tolerances</MenuItem>
          </Menu>
      );
      if((!scrolled) && (this.props.ws > -1))
      {
        if(document.getElementById(this.props.ws) != null)
        {
          $('.m-tree').animate({
          scrollTop: $("#"+this.props.ws).offset().top-$(".m-tree").offset().top
          }, 1000);
          scrolled=true;
        }
      }
        return <div className="sidebar">
                  {properties}
                  {modeMenu}
                  {this.props.mode == 'ws' ?
                      <WorkingstepList
                          pid = {this.props.pid}
                          cbMode = {this.props.cbMode}
                          cbTree = {this.props.cbTree}
                          ws = {this.props.ws}
                          propertyCb = {this.openProperties}
                      />
                      : null}
                  {this.props.mode == 'tree' ?
                      <WorkplanList
                          pid = {this.props.pid}
                          cbMode = {this.props.cbMode}
                          cbTree = {this.props.cbTree}
                          ws = {this.props.ws}
                          propertyCb = {this.openProperties}
                      />
                      : null}
                  {this.props.mode == 'tolerance' ?
                      <ToleranceList 
                          pid = {this.props.pid}
                          cbMode = {this.props.cbMode}
                          cbTree = {this.props.cbTree}
                          propertyCb = {this.openProperties}
                      />
                      : null}
                  {this.props.mode == 'tools' ?
                      <ToolList pid = {this.props.pid} cbMode = {this.props.cbMode} cbTree = {this.props.cbTree} ws = {this.props.ws}/>
                      : null}
               </div>;
    }
}

SidebarView.propTypes = {cadManager: React.PropTypes.instanceOf(cadManager).isRequired, mode : React.PropTypes.string.isRequired,
                          ws: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
                          cbMode: React.PropTypes.func.isRequired, cbTree: React.PropTypes.func.isRequired, cbWS: React.PropTypes.func.isRequired,
                          cbAltMenu: React.PropTypes.func.isRequired, pid: React.PropTypes.string.isRequired};
