import React, { useState } from 'react'
import { MdOutlineFilterAlt, BiSearchAlt2 } from 'react-icons/all'
import { Dropdown, Menu } from 'antd'
import styles from './styles.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useSelector } from 'react-redux'

const DashboardSearchTab = ({route}) => {

    const contribution_request = useSelector(x=>x.dao.contribution_request)
    const approved_request = contribution_request.filter(x=>x.status === 'APPROVED')
    const active_request = contribution_request
    const [contriFilter, setContriFilter] = useState(1)
    const contri_filter = ['All requests', 'Active requests', 'Approved requests', 'Paid requests' ]
    const [num_request, setNumRequest] = useState(active_request.length)
    
    const onClick = ({ key }) => {
        console.log('keysss', key)
        if(key === '1'){
            setContriFilter(0)
            setNumRequest(contribution_request.length)
        }else if(key === '2'){
            setNumRequest(active_request.length)
            setContriFilter(1)
        }else if(key === '3'){
            setNumRequest(approved_request.length)
            setContriFilter(2)
        }else if(key === '4'){
            // setNumRequest(contribution_request.length)
            // setContriFilter(3)
        }
    };

    const walletMenu = (
        <Menu  style={{borderRadius:'8px',width:'120%', background:'#1F1F1F', paddingTop:'1rem', paddingBottom:'1rem'}} onClick={onClick}>
          <Menu.Item className={styles.menuContainer} key="1">
          <div className={styles.menu}>All requests</div>
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="2">
          <div className={styles.menu}>Active requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="3">
          <div className={styles.menu}>Approved requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="4">
          <div className={styles.menu}>Paid requests</div>  
          </Menu.Item>
        </Menu>
      );

    return(
        
        <div className={styles.container}>
            <Dropdown  overlay={walletMenu}>
            <div className={`${textStyles.m_16} ${styles.text}`}>
                {num_request} {contri_filter[contriFilter]}
            </div>
            </Dropdown>
            <div>
                <BiSearchAlt2 color='#808080' size='1rem'  />
                <MdOutlineFilterAlt style={{marginLeft:'1.25rem'}} color='#808080' size='1rem'  />
            </div>
        </div>
    )

}

export default DashboardSearchTab